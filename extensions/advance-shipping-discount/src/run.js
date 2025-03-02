import { MatchCondition } from "./MatchCondition/MatchCondition";


/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );

  const payload = configuration?.ruleData;


  // console.log(JSON.stringify(payload?.conditions, null, 2));




  let change = false;
  let changeResults = [];
  const conditionList = payload?.conditionList;

  const presentmentCurrencyRate = parseFloat(input.presentmentCurrencyRate ?? "1.0");


  // const matchCondition = payload?.matchCondition;
  // const cartTotal = parseFloat(input.cart.cost.totalAmount.amount ?? "0.0");
  const cartSubtotal = parseFloat(input.cart.cost.subtotalAmount.amount ?? "0.0");
  const lines = input.cart.lines;
  const buyerIdentity = input.cart.buyerIdentity;
  const companyName = input.cart.buyerIdentity?.purchasingCompany?.company?.name ?? null;
  const countryCode = input.cart.deliveryGroups.map(address => address?.deliveryAddress?.countryCode) ?? null;
  const provinceCodes = input.cart.deliveryGroups.map(address => address?.deliveryAddress?.provinceCode) ?? null;
  const zipCodes = input.cart.deliveryGroups.map(address => address?.deliveryAddress?.zip) ?? null;
  const markets = input.cart.deliveryGroups.map(address => address?.deliveryAddress?.market?.id) ?? null;
  const deliveryTypes = input.cart.deliveryGroups.map(address => address?.selectedDeliveryOption?.deliveryMethodType.toLowerCase()) ?? null;
  const customerIsCompany = companyName ? true : false;
  const shippingMethods = payload?.shippingMethods;
  const deliveryGroups = input.cart.deliveryGroups;
  const shippingCost = input.cart.deliveryGroups[0]?.selectedDeliveryOption?.cost?.amount ?? 0;
  const customerTotalSpent = parseFloat(input.cart.buyerIdentity?.customer?.amountSpent?.amount ?? "0.0") * presentmentCurrencyRate;
  // const localDate = input.shop.localTime.date;



  const calculatedSubtotal = input.cart.lines.reduce((total, line) => {
    const lineTotal = line.quantity * parseFloat(line.cost.amountPerQuantity.amount ?? "0.0");
    return total + lineTotal;
  }, 0);
  const roundedCalculatedSubtotal = parseFloat(calculatedSubtotal.toFixed(2));
  const roundedCartSubtotal = parseFloat(cartSubtotal.toFixed(2));
  const discountAmount = roundedCalculatedSubtotal - roundedCartSubtotal;
  const discountAmountAdjusted = parseFloat(discountAmount.toFixed(2));
  let targets = [];
  




  payload?.conditions?.forEach(item => {
    const singleCondition = item;
    const response = MatchCondition(payload, change, input, conditionList, lines, buyerIdentity, companyName, countryCode, provinceCodes, zipCodes, markets, deliveryTypes, customerIsCompany,discountAmountAdjusted, presentmentCurrencyRate, singleCondition,customerTotalSpent);

    changeResults.push(response);
  });


  // console.log('change results: ', changeResults);


  if (shippingMethods?.label == 'All shipping methods') {
    targets = deliveryGroups?.map(deliveryGroup => {
      return {
        deliveryGroup: {
          id: deliveryGroup?.id
        }
      }
    })
  } else if (shippingMethods?.label == 'Contains') {

    deliveryGroups?.map(deliveryGroup => {
      targets = shippingMethods?.values?.map(deliveryMethod => {
        if (deliveryGroup?.selectedDeliveryOption?.deliveryMethodType?.includes(deliveryMethod)) {
          return {
            deliveryGroup: {
              id: deliveryGroup?.id
            }
          }
        }
      })
    });

  } else if (shippingMethods?.label == 'Is exactly') {

    deliveryGroups?.map(deliveryGroup => {

      targets = shippingMethods?.values?.map(deliveryMethod => {
        if (deliveryGroup?.selectedDeliveryOption?.deliveryMethodType === deliveryMethod) {
          return {
            deliveryGroup: {
              id: deliveryGroup?.id
            }
          }
        }
      })
    });

  } else if (shippingMethods?.label == 'Does not contain') {

    deliveryGroups?.map(deliveryGroup => {

      targets = shippingMethods?.values?.map(deliveryMethod => {
        if (!deliveryGroup?.selectedDeliveryOption?.deliveryMethodType?.includes(deliveryMethod)) {
          return {
            deliveryGroup: {
              id: deliveryGroup?.id
            }
          }
        }
      })
    });
  }


  if (changeResults?.length > 0) {
    change = changeResults?.some(item => item == true) ? true : false;
  } else {
    change = false;
  }


  if (change) {
    // console.log('Conditions matched, applying discount.');

    if (targets) {
      if (payload?.discount_type == 'percentage') {
        return {
          discounts: [
            {
              targets: targets,
              value: {
                percentage: {
                  value: payload?.discountAmount
                },
              },
              message: payload?.discountMessage
            },
          ]
        };
      } else if (payload?.discount_type == 'fixedAmount') {
        return {
          discounts: [
            {
              targets: targets,
              value: {
                fixedAmount: {
                  amount: payload?.discountAmount
                },
              },
              message: payload?.discountMessage
            },
          ]
        };
      } else {


        if (payload?.discountAmount > shippingCost) {
          return EMPTY_DISCOUNT;
        } else {
          const temp = shippingCost - payload?.discountAmount;

          return {
            discounts: [
              {
                targets: targets,
                value: {
                  fixedAmount: {
                    amount: temp
                  },
                },
                message: payload?.discountMessage
              },
            ]
          };
        }

      }

    } else {
      return EMPTY_DISCOUNT;
    }


  } else {
    // console.log('Conditions not matched.');
    return EMPTY_DISCOUNT;
  }

};