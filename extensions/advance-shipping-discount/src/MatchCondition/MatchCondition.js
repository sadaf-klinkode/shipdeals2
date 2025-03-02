import * as ConditionHelpers from './conditionHelpers';

export const MatchCondition = (payload, change, input, conditionList, lines, buyerIdentity, companyName, countryCode, provinceCodes, zipCodes, markets, deliveryTypes, customerIsCompany, discountAmountAdjusted, presentmentCurrencyRate, singleCondition, customerTotalSpent) => {
    let changeResults = [];

    // Context object to simplify passing related data
    const context = {
        lines,
        companyName,
        countryCode,
        provinceCodes,
        zipCodes,
        markets,
        deliveryTypes,
        customerIsCompany,
        discountAmountAdjusted,
        presentmentCurrencyRate,
        input,
        customerTotalSpent
    };

    // Map condition types to corresponding handler functions
    const conditionHandlers = {
        cartTotal: (context, condition) => {
            const cartTotal = parseFloat(context.input.cart.cost.totalAmount.amount ?? "0.0");

            condition.forEach(item => {
                const result = item?.action === 'More than'
                    ? cartTotal > parseFloat(item?.value) * presentmentCurrencyRate
                    : cartTotal < parseFloat(item?.value) * presentmentCurrencyRate;
                changeResults.push(result);
            });

        },
        cartSubtotal: (context, condition) => {
            const cartSubtotal = parseFloat(context.input.cart.cost.subtotalAmount.amount ?? "0.0");
            condition.forEach(item => {
                const result = item?.action === 'More than'
                    ? cartSubtotal > parseFloat(item?.value) * presentmentCurrencyRate
                    : cartSubtotal < parseFloat(item?.value) * presentmentCurrencyRate;
                changeResults.push(result);
            });
        },
        totalQuantity: (context, condition) => {
            const totalQuantity = ConditionHelpers.extractQuantities(context.lines);
            condition.forEach(item => {
                const result = item?.action === 'More than'
                    ? totalQuantity > parseFloat(item?.value)
                    : totalQuantity < parseFloat(item?.value);
                changeResults.push(result);
            });
        },
        singleVariantQuantity: (context, condition) => {
            const maxQuantity = ConditionHelpers.extractQuantities(context.lines);
            if (maxQuantity <= 0) return; // Early exit if condition is already false
            ConditionHelpers.processCondition(condition, [maxQuantity], condition[0]?.action);
        },
        singleProductQuantity: (context, condition) => {
            const maxQuantity = ConditionHelpers.extractQuantities(context.lines);
            if (maxQuantity <= 0) return; // Early exit if condition is already false
            ConditionHelpers.processCondition(condition, [maxQuantity], condition[0]?.action);
        },
        products: (context, condition) => {
            const productIds = context.input.cart.lines.map(line => line?.merchandise?.product?.id);
            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? ConditionHelpers.checkItemsPresence(item?.items, productIds)
                    : !ConditionHelpers.checkItemsPresence(item?.items, productIds);
                changeResults.push(result);
            });
        },
        collections: (context, condition) => {
            // Extract an array of boolean values from lines
            const collectionStatuses = context.lines.flatMap(line =>
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
        productTags: (context, condition) => {

            const tagStatuses = context.lines.flatMap(line =>
                line.merchandise.product.hasTags
                    .filter(tag => tag.hasTag)
                    .map(tag => tag.tag)
            );

            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? tagStatuses.includes(item?.value)
                    : !tagStatuses.includes(item?.value);


                changeResults.push(result);
            });
        },
        cartCurrency: (context, condition) => {
            const cartCurrency = context.input.cart.cost.totalAmount.currencyCode;
            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? item?.value.includes(cartCurrency)
                    : !item?.value.includes(cartCurrency);
                changeResults.push(result);
            });

        },
        companyNames: (context, condition) => {
            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? item?.value?.includes(context.companyName)
                    : !item?.value?.includes(context.companyName);
                changeResults.push(result);
            });
        },
        shippingCountry: (context, condition) => {
            condition.forEach(item => {
                context.countryCode.forEach(item2 => {
                    const result = item?.action === 'If found'
                        ? item?.value?.includes(item2)
                        : !item?.value?.includes(item2);
                    changeResults.push(result);
                });
            });
        },
        customerTags: (context, condition) => {
            const tags = buyerIdentity.customer.hasTags
                .filter(tag => tag.hasTag)
                .map(tag => tag.tag);

            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? tags.includes(item?.value)
                    : !tags.includes(item?.value);

                changeResults.push(result);
            });
        },
        discountAmount: (context, condition) => {
            condition.forEach(item => {
                const result = item?.action === 'More than'
                    ? context.discountAmountAdjusted > parseFloat(item?.value) * presentmentCurrencyRate
                    : context.discountAmountAdjusted < parseFloat(item?.value) * presentmentCurrencyRate;
                changeResults.push(result);
            });
        },
        provinceCodes: (context, condition) => {
            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? item?.value?.includes(context.provinceCodes)
                    : !item?.value?.includes(context.provinceCodes);
                changeResults.push(result);
            });
        },
        zipPostalCodes: (context, condition) => {
            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? item?.value?.includes(context.zipCodes)
                    : !item?.value?.includes(context.zipCodes);
                changeResults.push(result);
            });
        },
        markets: (context, condition) => {
            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? item?.value?.includes(context.markets)
                    : !item?.value?.includes(context.markets);
                changeResults.push(result);
            });
        },
        deliveryTypes: (context, condition) => {
            console.log('Entered delivery types condition.\nEvaluating...');

            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? item.items.some(item => context.deliveryTypes.includes(item.toLowerCase()))
                    : item.items.every(item => !context.deliveryTypes.includes(item.toLowerCase()));
                changeResults.push(result);
            });
        },
        customerIsCompany: (context, condition) => {
            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? item?.value?.includes(context.customerIsCompany)
                    : !item?.value?.includes(context.customerIsCompany);
                changeResults.push(result);
            });
        },
        hours: (context, condition) => {

            const shopTimeZone = payload?.shopTimeZone;
            const date = new Date();

            const hours = date.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: shopTimeZone });
            const minutes = date.toLocaleString('en-US', { minute: '2-digit', timeZone: shopTimeZone });
            const ampm = date.toLocaleString('en-US', { hour: '2-digit', hour12: true, timeZone: shopTimeZone }).split(' ')[1];
            const weekday = date.toLocaleString('en-US', { weekday: 'long', timeZone: shopTimeZone });

            const hoursMinutes = `${hours}:${minutes}`;
            const hoursMinutesAMPM = `${hoursMinutes} ${ampm}`;
            const hoursMinutesAMPMWeekday = `${hoursMinutesAMPM} ${weekday}`;

            context.hours = hours;
            context.minutes = minutes;
            context.ampm = ampm;
            context.weekday = weekday;
            context.hoursMinutes = hoursMinutes;
            context.hoursMinutesAMPM = hoursMinutesAMPM;
            context.hoursMinutesAMPMWeekday = hoursMinutesAMPMWeekday;

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
        weekday: (context, condition) => {
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
        city: (context, condition) => {
            const cities = context.input.cart.deliveryGroups.map(deliveryGroup => deliveryGroup.deliveryAddress.city);


            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? cities.includes(item?.value)
                    : !cities.includes(item?.value);
                changeResults.push(result);
            });
        },
        specificItemsTotal: (context, condition) => {
            let subChange = [];
            let result = false;

            if(singleCondition?.collections){

                const validCollectionsSet = new Set(
                    singleCondition.collections
                      .map(item => item.items || [])
                      .reduce((acc, items) => acc.concat(items), [])
                  );

                const totalCost = lines
                                    .filter(line => 
                                        Array.isArray(line.merchandise.product.inCollections) &&
                                        line.merchandise.product.inCollections.some(
                                        collection => validCollectionsSet.has(collection.collectionId) // ✅ Access collectionId properly
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

                const totalCost = lines
                .filter(line => validProductIds.has(line.merchandise.product.id))
                .reduce((sum, line) => sum + parseFloat(line.cost.amountPerQuantity.amount) * line.quantity, 0);



                condition.forEach(item => {
                    const result = item?.action === 'More than'
                        ? totalCost > parseFloat(item?.value) * presentmentCurrencyRate
                        : totalCost < parseFloat(item?.value) * presentmentCurrencyRate;
                    subChange.push(result);
                });


            }else if(singleCondition?.productTags){
                const tagStatuses = context.lines.flatMap(line =>
                    (line.merchandise.product.hasTags || [])
                      .filter(tag => tag.hasTag && tag.tag === 'winter')
                      .map(tag => tag.tag)
                  );
                  
                  const totalCost = context.lines
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
        totalOrderWeight: (context, condition) => {

            const totalWeight = context.input.cart.lines.reduce((total, line) => {
                const weight = parseFloat(line.merchandise.weight);
                return total + weight * line.quantity;
            }, 0);

            condition.forEach(item => {
                const result = item?.action === 'More than'
                    ? totalWeight > parseFloat(item?.value)
                    : totalWeight < parseFloat(item?.value);
                changeResults.push(result);
            });
        },
        specificItemsWeight: (context, condition) => {
            let subChange = [];
            let result = false;

            if(singleCondition?.collections){

                const validCollectionsSet = new Set(
                    singleCondition.collections
                      .map(item => item.items || [])
                      .reduce((acc, items) => acc.concat(items), [])
                  );

                const totalWeight = lines
                                    .filter(line => 
                                        Array.isArray(line.merchandise.product.inCollections) &&
                                        line.merchandise.product.inCollections.some(
                                        collection => validCollectionsSet.has(collection.collectionId) // ✅ Access collectionId properly
                                        )
                                    )
                                    .reduce((sum, line) => sum + parseFloat(line.merchandise.weight) * line.quantity, 0);

                condition.forEach(item => {
                    const result = item?.action === 'More than'
                        ? totalWeight > parseFloat(item?.value)
                        : totalWeight < parseFloat(item?.value);
                    subChange.push(result);
                });


            }else if(singleCondition?.products){
                const validProductIds = new Set(singleCondition.products.flatMap(p => p.items));

                const totalWeight = lines
                .filter(line => validProductIds.has(line.merchandise.product.id))
                .reduce((sum, line) => sum + parseFloat(line.merchandise.weight) * line.quantity, 0);



                condition.forEach(item => {
                    const result = item?.action === 'More than'
                        ? totalWeight > parseFloat(item?.value)
                        : totalWeight < parseFloat(item?.value);
                    subChange.push(result);
                });


            }else if(singleCondition?.productTags){
                const tagStatuses = context.lines.flatMap(line =>
                    (line.merchandise.product.hasTags || [])
                      .filter(tag => tag.hasTag && tag.tag === 'winter')
                      .map(tag => tag.tag)
                  );
                  
                  const totalWeight = context.lines
                    .filter(line => 
                      Array.isArray(line.merchandise.product.hasTags) &&
                      line.merchandise.product.hasTags.some(tag => tag.hasTag && tag.tag === 'winter')
                    )
                    .reduce((sum, line) => sum + parseFloat(line.merchandise.weight) * line.quantity, 0);
                  

                condition.forEach(item => {
                    const result = item?.action === 'More than'
                        ? totalWeight > parseFloat(item?.value)
                        : totalWeight < parseFloat(item?.value);
                    subChange.push(result);
                })                  
            }else {
                subChange.push(false);
            }

            if(subChange.length > 0){
                result = subChange.some(item => item === true);
                changeResults.push(result);
            }


        },
        specificItemsQuantity: (context, condition) => {
            let subChange = [];
            let result = false;

            if(singleCondition?.collections){

                const validCollectionsSet = new Set(
                    singleCondition.collections
                      .map(item => item.items || [])
                      .reduce((acc, items) => acc.concat(items), [])
                  );

                const totalQuantity = lines
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

                const totalQuantity = lines
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

                const totalQuantity = context.lines
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
        sku: (context, condition) => {
            const skus = context.lines.map(line => line.merchandise.sku);

            condition.forEach(item => {
                if (item?.value && Array.isArray(item.value)) {
                    const found = item.value.some(val => skus.includes(val));
                    const result = item.action === 'If found' ? found : !found;
                    changeResults.push(result);
                }
            });
        },
        customerLogin: (context, condition) => {
            const customerLogin = context.input.cart.buyerIdentity ? true : false;

            condition.forEach(item => {
                let result = false;

                if(item.action === 'If found'){
                    result = customerLogin ? true : false;
                }else {
                    result = !customerLogin ? true : false;
                }
                changeResults.push(result);
            });
        },
        customerTotalSpent: (context, condition) => {

            if(buyerIdentity){
                condition.forEach(item => {
                    const result = item?.action === 'More than'
                        ? context.customerTotalSpent > parseFloat(item?.value) * presentmentCurrencyRate
                        : context.customerTotalSpent < parseFloat(item?.value) * presentmentCurrencyRate;
                    changeResults.push(result);
                });
            }else{
                changeResults.push(false);
            }
        },
        address: (context, condition) => {
            const addresses = context.input.cart.deliveryGroups.map((item) => {
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
        pobox: (context, condition) => {
            console.log('Entered PO box condition.');

            const addresses = context.input.cart.deliveryGroups.map((item) => {
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

                console.log('PO box condition satisfied.');
            } else {
                changeResults.push(false);

                console.log('PO box condition not satisfied.');
            }
        },
        selectedShippingMethod: (context, condition) => {
            console.log('Entered selected shipping method condition.');

            const shippingMethods = context.input.cart.deliveryGroups.map(deliveryGroup => deliveryGroup.selectedDeliveryOption.title);


            if (shippingMethods.length > 0) {
                condition.forEach(item => {
                    const result = item?.action === 'If found'
                        ? item.value.some(value => shippingMethods.includes(value))
                        : item.value.every(value => !shippingMethods.includes(value));
                
                    changeResults.push(result);
                });

                console.log('Selected shipping method condition evaluating.');
            }else{
                changeResults.push(false);
                console.log('Selected shipping method condition not satisfied.');
            }
        },
        shippingMethod: (context, condition) => {
            console.log('Entered shipping method condition.');

            const shippingMethods = context.input.cart.deliveryGroups.flatMap(deliveryGroup => deliveryGroup.deliveryOptions.map(option => option.title));

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
        freeShippingMethod: (context, condition) => {
            console.log('Entered free shipping method condition.\nEvaluating...');

            const shippingCost = context.input.cart.deliveryGroups.flatMap(deliveryGroup => deliveryGroup.deliveryOptions.map(option => parseFloat(option.cost.amount)));

            const containsFreeShipping = shippingCost.some(cost => cost === 0);


            condition.forEach(item => {
                const result = item?.action === 'If found'
                    ? containsFreeShipping
                    : !containsFreeShipping;
                changeResults.push(result);
            });
        },
        specificDates: (context, condition) => {
            console.log('Entered specific dates condition.\nEvaluating...');
        
            condition.forEach(item => {
                if (item?.type === 'single' && Array.isArray(item?.value)) {
                    // Check if today's date exists in the list
                    const result = item.value.includes(localDate);
                    changeResults.push(item?.action === 'If found' ? result : !result);
                } 
                else if (item?.type === 'range' && item?.start && item?.end) {
                    const startDate = new Date(item.start).toISOString().split('T')[0];
                    const endDate = new Date(item.end).toISOString().split('T')[0];
        
                    // Compare localDate with the start and end date
                    const isInRange = localDate >= startDate && localDate <= endDate;
                    changeResults.push(item?.action === 'If found' ? isInRange : !isInRange);
                } 
                else {
                    console.error("Invalid condition format:", JSON.stringify(item, null, 2));
                }
            });
        }
    }

    // Evaluate all conditions and apply corresponding handler
    if (singleCondition.always) {
        changeResults.push(true);
    } else {
        Object.keys(singleCondition).forEach(conditionKey => {
            if (conditionHandlers[conditionKey]) {
                conditionHandlers[conditionKey](context, singleCondition[conditionKey]);
            }
        });
    }

    // Return true only if all conditions are satisfied
    return changeResults.every(result => result === true);
};
