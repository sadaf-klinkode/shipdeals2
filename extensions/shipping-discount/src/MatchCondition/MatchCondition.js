import * as ConditionHelpers from './conditionHelpers';

export const MatchCondition = (payload, input, presentmentCurrencyRate, singleCondition) => {
    let changeResults = [];

    /* const context = {
        lines: input.cart.lines,
        companyName,
        countryCode,
        provinceCodes,
        zipCodes,
        markets,
        deliveryTypes,
        customerIsCompany,
        presentmentCurrencyRate,
        input
    }; */

    // Map condition types to corresponding handler functions
    const conditionHandlers = {
        cartTotal: (condition) => {
            const cartTotal = parseFloat(input.cart.cost.totalAmount.amount ?? "0.0");

            condition.forEach(item => {
                const result = item?.action === 'More than'
                    ? cartTotal > parseFloat(item?.value)*presentmentCurrencyRate
                    : cartTotal < parseFloat(item?.value)*presentmentCurrencyRate;
                changeResults.push(result);
            });

        },
        cartSubtotal: (condition) => {
            const cartSubtotal = parseFloat(input.cart.cost.subtotalAmount.amount ?? "0.0");
            condition.forEach(item => {
                const result = item?.action === 'More than'
                    ? cartSubtotal > parseFloat(item?.value)*presentmentCurrencyRate
                    : cartSubtotal < parseFloat(item?.value)*presentmentCurrencyRate;
                changeResults.push(result);
            });
        },
        cartCurrency: (condition) => {
            const cartCurrency = input.cart.cost.totalAmount.currencyCode;
            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? item?.value.includes(cartCurrency)
                    : !item?.value.includes(cartCurrency);
                changeResults.push(result);
            });
        },
        specificItemsTotal: (condition) => {
            let subChange = [];
            let result = false;

            if(singleCondition?.collections){

                const validCollectionsSet = new Set(
                    singleCondition.collections
                      .map(item => item.items || [])
                      .reduce((acc, items) => acc.concat(items), [])
                  );

                const totalCost = input.cart.lines
                                    .filter(line => 
                                        Array.isArray(line.merchandise.product.inCollections) &&
                                        line.merchandise.product.inCollections.some(
                                        collection => validCollectionsSet.has(collection.collectionId)
                                        )
                                    )
                                    .reduce((sum, line) => sum + parseFloat(line.cost.amountPerQuantity.amount) * line.quantity, 0);

                condition.forEach(item => {
                    const result = item?.action === 'More than'
                        ? totalCost > parseFloat(item?.value) * presentmentCurrencyRate
                        : totalCost < parseFloat(item?.value) * presentmentCurrencyRate;
                    subChange.push(result);
                });


            }else if(singleCondition?.products){
                
                const validProductIds = new Set(singleCondition.products.flatMap(p => p.items));

                const totalCost = input.cart.lines
                .filter(line => validProductIds.has(line.merchandise.product.id))
                .reduce((sum, line) => sum + parseFloat(line.cost.amountPerQuantity.amount) * line.quantity, 0);



                condition.forEach(item => {
                    const result = item?.action === 'More than'
                        ? totalCost > parseFloat(item?.value) * presentmentCurrencyRate
                        : totalCost < parseFloat(item?.value) * presentmentCurrencyRate;
                    subChange.push(result);
                });


            }else if(singleCondition?.productTags){
                  
                  const totalCost = input.cart.lines
                    .filter(line => 
                      Array.isArray(line.merchandise.product.hasTags) &&
                      line.merchandise.product.hasTags.some(tag => tag.hasTag && tag.tag === 'winter')
                    )
                    .reduce((sum, line) => sum + parseFloat(line.cost.amountPerQuantity.amount) * line.quantity, 0);
                  

                condition.forEach(item => {
                    const result = item?.action === 'More than'
                        ? totalCost > parseFloat(item?.value) * presentmentCurrencyRate
                        : totalCost < parseFloat(item?.value) * presentmentCurrencyRate;
                    subChange.push(result);
                })                  
            }else {
                subChange.push(false);
            }

            if(subChange.length > 0){
                result = subChange.some(item => item === true);
                changeResults.push(result);
            }else{
                changeResults.push(false);
            }

        },
        totalQuantity: (condition) => {
            const totalQuantity = input.cart.lines.reduce((sum, line) => sum + line.quantity, 0);

            condition.forEach(item => {
                const result = item?.action === 'More than'
                    ? totalQuantity > parseFloat(item?.value)
                    : totalQuantity < parseFloat(item?.value);
                changeResults.push(result);
            });
        },
        singleVariantQuantity: (condition) => {

            const maxQuantity = input.cart.lines.reduce((max, line) => {
                const quantity = line.quantity;
                return quantity > max ? quantity : max;
            }, 0);

            condition.forEach(item => {
                const result = item?.action === 'More than'
                    ? maxQuantity > parseFloat(item?.value)
                    : maxQuantity < parseFloat(item?.value);
                changeResults.push(result);
            });
        },
        specificItemsQuantity: (condition) => {
            let subChange = [];
            let result = false;

            if(singleCondition?.collections){

                const validCollectionsSet = new Set(
                    singleCondition.collections
                      .map(item => item.items || [])
                      .reduce((acc, items) => acc.concat(items), [])
                  );

                const totalQuantity = input.cart.lines
                                    .filter(line => 
                                        Array.isArray(line.merchandise.product.inCollections) &&
                                        line.merchandise.product.inCollections.some(
                                        collection => validCollectionsSet.has(collection.collectionId) // ✅ Access collectionId properly
                                        )
                                    )
                                    .reduce((sum, line) => sum + line.quantity, 0);

                condition.forEach(item => {
                    const result = item?.action === 'More than'
                        ? totalQuantity > parseFloat(item?.value)
                        : totalQuantity < parseFloat(item?.value);
                    subChange.push(result);
                });


            }else if(singleCondition?.products){
                
                const validProductIds = new Set(singleCondition.products.flatMap(p => p.items));

                const totalQuantity = input.cart.lines
                .filter(line => validProductIds.has(line.merchandise.product.id))
                .reduce((sum, line) => sum + line.quantity, 0);



                condition.forEach(item => {
                    const result = item?.action === 'More than'
                        ? totalQuantity > parseFloat(item?.value)
                        : totalQuantity < parseFloat(item?.value);
                    subChange.push(result);
                });


            }else if(singleCondition?.productTags){
                // Flatten all the tags from productTags, handle multiple tags by splitting the string
                const validTags = new Set(
                    singleCondition.productTags.flatMap(tagCondition => 
                        tagCondition.value.split(',').map(tag => tag.trim())
                    )
                );

                const totalQuantity = input.cart.lines
                    .filter(line => 
                        Array.isArray(line.merchandise.product.hasTags) &&
                        line.merchandise.product.hasTags.some(tag => validTags.has(tag.tag) && tag.hasTag)
                    )
                    .reduce((sum, line) => sum + line.quantity, 0);

                // Evaluate each condition
                condition.forEach(item => {
                    if (!item?.value || isNaN(item.value)) return; // Ensure valid numeric value
                    const value = parseFloat(item.value);
                    const result = item.action === 'More than' ? totalQuantity > value : totalQuantity < value;
                    subChange.push(result);
                });


            }else {
                subChange.push(false);
            }

            if(subChange.length > 0){
                result = subChange.some(item => item === true);
                changeResults.push(result);
            }

        },
        singleProductQuantity: (condition) => {
            const maxQuantity = ConditionHelpers.extractQuantities(input.cart.lines);
            if (maxQuantity <= 0) return;
            ConditionHelpers.processCondition(condition, [maxQuantity], condition[0]?.action);
        },
        products: (condition) => {
            const productIds = input.cart.lines.map(line => line?.merchandise?.product?.id);
            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? ConditionHelpers.checkItemsPresence(item?.items, productIds)
                    : !ConditionHelpers.checkItemsPresence(item?.items, productIds);
                changeResults.push(result);
            });
        },
        collections: (condition) => {
            const collectionStatuses = input.cart.lines.flatMap(line => 
                line.merchandise.product.inCollections
                  .filter(collection => collection.isMember)
                  .map(collection => collection.collectionId)
              );
        
            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? ConditionHelpers.checkItemsPresence(item?.items, collectionStatuses)
                    : !ConditionHelpers.checkItemsPresence(item?.items, collectionStatuses);


                changeResults.push(result);
            })
        },
        productTags: (condition) => {
            const lines = input.cart.lines;

            const tagStatuses = lines.flatMap(line => 
                line.merchandise.product.hasTags
                    .filter(tag => tag.hasTag)
                    .map(tag => tag.tag)
            );
        
            condition.forEach(item => {
                const tagsToCheck = item?.value.split(',').map(tag => tag.trim()); 
        
                const result = item?.action === 'If found'
                    ? tagsToCheck.every(tag => tagStatuses.includes(tag))
                    : tagsToCheck.every(tag => !tagStatuses.includes(tag));
        
                changeResults.push(result);
            });
        },
        companyNames: (condition) => {
            const companyName = input.cart.buyerIdentity?.purchasingCompany?.company?.name ?? null;

            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? item?.value?.includes(companyName)
                    : !item?.value?.includes(companyName);
                changeResults.push(result);
            });
        },
        
        customerTags: (condition) => {
            const tags = input.cart.buyerIdentity.customer.hasTags
                        .filter(tag => tag.hasTag)
                        .map(tag => tag.tag);

            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? tags.includes(item?.value)
                    : !tags.includes(item?.value);

                changeResults.push(result);
            });
        },
        shippingCountry: (condition) => {
            const countryCode = input.cart.deliveryGroups.map(address => address?.deliveryAddress?.countryCode) ?? null;

            condition.forEach(item => {
                countryCode.forEach(item2 => {
                    const result = item?.action === 'If found'
                        ? item?.value?.includes(item2)
                        : !item?.value?.includes(item2);
                    changeResults.push(result);
                });
            });
        },
        city: (condition) => {
            const cities = input.cart.deliveryGroups.map(deliveryGroup => deliveryGroup?.deliveryAddress?.city);

            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? cities.includes(item?.value)
                    : !cities.includes(item?.value);
                changeResults.push(result);
            });
        },
        discountAmount: (context, condition) => {
            condition.forEach(item => {
                const result = item?.action === 'More than'
                    ? context.discountAmountAdjusted > parseFloat(item?.value)*presentmentCurrencyRate
                    : context.discountAmountAdjusted < parseFloat(item?.value)*presentmentCurrencyRate;
                changeResults.push(result);
            });
        },
        provinceCodes: (condition) => {
            const provinceCodes = input.cart.deliveryGroups.map(address => address?.deliveryAddress?.provinceCode) ?? null;

            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? provinceCodes.includes(item?.value)
                    : !provinceCodes.includes(item?.value);
                changeResults.push(result);
            });

        },
        zipPostalCodes: (condition) => {
            const zipCodes = input.cart.deliveryGroups.map(address => address?.deliveryAddress?.zip) ?? null;

            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? zipCodes.includes(item?.value)
                    : !zipCodes.includes(item?.value);
                changeResults.push(result);
            });
        },
        markets: (condition) => {
            const markets = input.cart.deliveryGroups.map(address => address?.deliveryAddress?.market?.id) ?? null;

            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? markets.includes(item?.value)
                    : !markets.includes(item?.value);
                changeResults.push(result);
            });
        },
        deliveryTypes: (condition) => {
            const deliveryTypes = input.cart.deliveryGroups.map(address => address?.selectedDeliveryOption?.deliveryMethodType) ?? null;


            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? deliveryTypes.includes(item?.value)
                    : !deliveryTypes.includes(item?.value);
                changeResults.push(result);
            });
        },
        customerIsCompany: (condition) => {
            const companyName = input.cart.buyerIdentity?.purchasingCompany?.company?.name ?? null;
            const customerIsCompany = companyName ? true : false;
            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? item?.value?.includes(customerIsCompany)
                    : !item?.value?.includes(customerIsCompany);
                changeResults.push(result);
            });
        },
        hours: (condition) => {

            const shopTimeZone = payload?.shopTimeZone;
            const date = new Date();
            
            const hours = date.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: shopTimeZone });
            const minutes = date.toLocaleString('en-US', { minute: '2-digit', timeZone: shopTimeZone });
            const ampm = date.toLocaleString('en-US', { hour: '2-digit', hour12: true, timeZone: shopTimeZone }).split(' ')[1];
            const weekday = date.toLocaleString('en-US', { weekday: 'long', timeZone: shopTimeZone });
        
            const hoursMinutes = `${hours}:${minutes}`;
            const hoursMinutesAMPM = `${hoursMinutes} ${ampm}`;
            const hoursMinutesAMPMWeekday = `${hoursMinutesAMPM} ${weekday}`;
        
            /* context.hours = hours;
            context.minutes = minutes;
            context.ampm = ampm;
            context.weekday = weekday;
            context.hoursMinutes = hoursMinutes;
            context.hoursMinutesAMPM = hoursMinutesAMPM;
            context.hoursMinutesAMPMWeekday = hoursMinutesAMPMWeekday; */
        
            condition?.forEach(item => {
                // Check if `startAt`, `endAt`, and `action` are valid
                if (!item.startAt || !item.endAt || !item.action) {
                    console.warn("Missing startAt, endAt, or action", item);
                    return;  // Skip this item if any necessary values are missing
                }
            
                // Convert "HH:MM" to a comparable number (e.g., "22:30" → 2230)
                const timeToNumber = timeStr => parseInt(timeStr.replace(":", ""), 10);
                
                // Convert all times to a comparable number format
                const currentTime = timeToNumber(hoursMinutes);
                const startTime = timeToNumber(item.startAt);
                const endTime = timeToNumber(item.endAt);
            
                // Handle time ranges where the range does not span midnight (e.g., "00:00" to "12:00")
                if (startTime < endTime) {
                    // Standard case: startAt is before endAt
                    if (item.action === 'is in between') {
                        const isInBetween = (currentTime >= startTime && currentTime <= endTime);
                        changeResults.push(isInBetween);
                    } else if (item.action === 'is not in between') {
                        const isNotBetween = (currentTime < startTime || currentTime > endTime);
                        changeResults.push(isNotBetween);
                    }
                } else {
                    // Case where the time range spans midnight (not applicable for "00:00" to "12:00")
                    if (item.action === 'is in between') {
                        const isInBetween = (currentTime >= startTime || currentTime <= endTime);
                        changeResults.push(isInBetween);
                    } else if (item.action === 'is not in between') {
                        const isNotBetween = (currentTime < startTime && currentTime > endTime);
                        changeResults.push(isNotBetween);
                    }
                }
            });
        },
        weekday: (condition) => {
            console.log('Entered weekday condition.\nEvaluating...');
        
            const currentDate = new Date();
            const currentDay = currentDate.getDay(); // 0 (Sunday) - 6 (Saturday)
        
            const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const weekdayName = weekdays[currentDay];
        
        
        
            condition.forEach(item => {
                // Convert input weekdays to lowercase for case-insensitive comparison
                const startIdx = weekdays.findIndex(day => day.toLowerCase() === item.startWeekday.toLowerCase());
                const endIdx = weekdays.findIndex(day => day.toLowerCase() === item.endWeekday.toLowerCase());
        
                if (startIdx === -1 || endIdx === -1) {
                    console.error("Invalid weekday names in condition.");
                    changeResults.push(false);
                    return;
                }
        
                if (item?.action === 'is in between') {
                    let result = false;
                    if (startIdx === endIdx) {
                        // Special case: If start and end are the same, check for exact match
                        result = currentDay === startIdx;
                    } else if (startIdx < endIdx) {
                        // Normal case: range is sequential (e.g., Monday to Friday)
                        result = currentDay >= startIdx && currentDay <= endIdx;
                    } else {
                        // Wrapped case: range spans across the weekend (e.g., Friday to Monday)
                        result = currentDay >= startIdx || currentDay <= endIdx;
                    }
        
                    changeResults.push(result);
                } 
                else if (item?.action === 'is not in between') {
                    let result = true;
                    if (startIdx === endIdx) {
                        // Special case: If start and end are the same, check for exact match
                        result = currentDay !== startIdx;
                    } else if (startIdx < endIdx) {
                        // Normal case: range is sequential (e.g., Monday to Friday)
                        result = !(currentDay >= startIdx && currentDay <= endIdx);
                    } else {
                        // Wrapped case: range spans across the weekend (e.g., Friday to Monday)
                        result = !(currentDay >= startIdx || currentDay <= endIdx);
                    }
        
                    changeResults.push(result);
                }
            });
        
        },
        address: (condition) => {
            const addresses = input.cart.deliveryGroups.map((item) => {
                const { address1, address2 } = item.deliveryAddress;
                return `${address1 || ''} ${address2 || ''}`.trim();
            });
            
             condition.map(item => {
                const result = item?.action === 'If found'
                    ? addresses.some(address => address.toLowerCase().includes(item?.value.toLowerCase()))
                    : addresses.every(address => !address.toLowerCase().includes(item?.value.toLowerCase()));

                changeResults.push(result);
            });
        },
        pobox: (condition) => {

            const addresses = input.cart.deliveryGroups.map((item) => {
                const { address1, address2 } = item.deliveryAddress;
                return `${address1 || ''} ${address2 || ''}`.trim();
            });

            // Correctly checking for multiple variations of "P.O. Box"
            const poboxKeywords = ['p.o. box', 'pobox', 'pob']; 
            const containsPobox = addresses.some(address =>
                poboxKeywords.some(keyword => address.toLowerCase().includes(keyword))
            );
            
            if (containsPobox) {
                condition.forEach(item => {
                    changeResults.push(item?.action === 'If found' ? true : false);
                });

                // console.log('PO box condition satisfied.');
            } else {
                changeResults.push(false);

                console.log('PO box condition not satisfied.');
            }
        },
        shippingMethod: (condition) => {
            console.log('Entered shipping method condition.');

            const shippingMethods = input.cart.deliveryGroups.flatMap(deliveryGroup => deliveryGroup.deliveryOptions.map(option => option.title));

            if (shippingMethods.length > 0) {
                condition.forEach(item => {
                    const result = item?.action === 'If found'
                        ? item.value.some(value => shippingMethods.includes(value)) 
                        : item.value.every(value => !shippingMethods.includes(value));
                
                    changeResults.push(result);
                });

                console.log('Shipping method condition evaluating.');
            }else{
                changeResults.push(false);
                console.log('Shipping method condition not satisfied.');
            }
        },
        freeShippingMethod: (condition) => {
            console.log('Entered free shipping method condition.\nEvaluating...');

            const shippingCost = input.cart.deliveryGroups.flatMap(deliveryGroup => deliveryGroup.deliveryOptions.map(option => parseFloat(option.cost.amount)));

            const containsFreeShipping = shippingCost.some(cost => cost === 0);


            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? containsFreeShipping
                    : !containsFreeShipping;
                changeResults.push(result);
            });
        },
        
    };

    // Evaluate all conditions and apply corresponding handler
    if (singleCondition.always) {
        changeResults.push(true);
    } else {
        Object.keys(singleCondition).forEach(conditionKey => {
            if (conditionHandlers[conditionKey]) {
                conditionHandlers[conditionKey](singleCondition[conditionKey]);
                // conditionHandlers[conditionKey](context, singleCondition[conditionKey]);
            }
        });
    }

    // console.log('Change results: ', JSON.stringify(changeResults, null, 2));

    // Return true only if all conditions are satisfied
    return changeResults.every(result => result === true);
};
