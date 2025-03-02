import { MatchCondition } from "./MatchCondition/MatchCondition";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = { discounts: [] };

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const configuration = JSON.parse(input?.discountNode?.metafield?.value ?? "{}");
  const payload = configuration?.ruleData;

  const shippingMethods = payload?.shippingMethods;
  const deliveryGroups = input.cart.deliveryGroups;
  const shippingCost = input.cart.deliveryGroups[0]?.selectedDeliveryOption?.cost?.amount ?? 0;
  const presentmentCurrencyRate = parseFloat(input.presentmentCurrencyRate ?? "1.0");
  const shippingTitles = deliveryGroups.flatMap(deliveryGroup => deliveryGroup.deliveryOptions.map(option => option.title));

  let change = false;
  const changeResults = [];


  console.log('total: ',input.cart.lines.length)


  if (payload?.conditions) {
    for (let item of payload.conditions) {
      const response = MatchCondition(payload, input, presentmentCurrencyRate, item);
      if (response) changeResults.push(response);
    }
  }

  // console.log(JSON.stringify(changeResults, null, 2));


  const targets = [];
  if (shippingMethods?.label) {
    const methodLabel = shippingMethods.label;
    const methodValues = shippingMethods.values || [];
    
    deliveryGroups.forEach(deliveryGroup => {
      let addTarget = false;
      const selectedDeliveryMethod = deliveryGroup?.selectedDeliveryOption?.deliveryMethodType;

      if (methodLabel === 'All shipping methods') {
        addTarget = true;
      } else if (methodLabel === 'Contains' && methodValues.some(method => shippingTitles?.includes(method))) {
        addTarget = true;
      } else if (methodLabel === 'Is exactly' && methodValues.includes(shippingTitles)) {
        addTarget = true;
      } else if (methodLabel === 'Does not contain' && !methodValues.some(method => shippingTitles?.includes(method))) {
        addTarget = true;
      }

      if (addTarget) {
        targets.push({
          deliveryGroup: { id: deliveryGroup?.id },
        });
      }
    });
  }


  // console.log('targets: ',JSON.stringify(shippingTitles));


  change = changeResults.length > 0 && changeResults.some(result => result === true);


  if (change && targets.length > 0) {
    const discountValue = payload?.discountAmount;
    const discountType = payload?.discount_type;

    if (discountType === 'percentage') {
      return {
        discounts: [{
          targets,
          value: { percentage: { value: discountValue } },
          message: payload?.discountMessage,
        }],
      };
    } else if (discountType === 'fixedAmount') {
      return {
        discounts: [{
          targets,
          value: { fixedAmount: { amount: discountValue } },
          message: payload?.discountMessage,
        }],
      };
    } else if (discountValue > shippingCost) {
      return EMPTY_DISCOUNT;
    } else {
      const temp = shippingCost - discountValue;
      return {
        discounts: [{
          targets,
          value: { fixedAmount: { amount: temp } },
          message: payload?.discountMessage,
        }],
      };
    }
  }

  return EMPTY_DISCOUNT;
}
