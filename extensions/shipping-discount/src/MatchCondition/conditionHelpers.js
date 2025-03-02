// Memoization cache to avoid redundant calculations
const memoCache = {};

// Optimized comparison function with caching
const compareValues = (value1, value2, action, cacheKey) => {
    // Check cache for this key
    if (cacheKey && memoCache[cacheKey]) {
        return memoCache[cacheKey];
    }

    let result;

    switch (action) {
        case 'More than': result = value1 > value2; break;
        case 'If found': result = value1 === value2; break;
        case 'Block if a company': result = value1 === value2; break;
        default: result = false;
    }

    // Cache result if a cacheKey is provided
    if (cacheKey) {
        memoCache[cacheKey] = result;
    }

    return result;
};

// Efficient function for repeated calculations like quantities
export const extractQuantities = (lines, getMaxQuantity = true) => {
    const cacheKey = 'productQuantities';
    if (memoCache[cacheKey]) {
        return memoCache[cacheKey]; // Retrieve from cache
    }

    const productQuantities = lines.reduce((acc, line) => {
        const productId = line.merchandise.product.id;
        acc[productId] = (acc[productId] || 0) + line.quantity;
        return acc;
    }, {});

    const maxQuantity = getMaxQuantity ? Math.max(...Object.values(productQuantities)) : productQuantities;

    memoCache[cacheKey] = maxQuantity; // Cache result
    return maxQuantity;
};

// Generic condition evaluator with composable actions
export const processCondition = (condition, valuesToCompare, action) => {
    const cacheKey = `${action}-${condition?.value}`;
    return valuesToCompare.map(value => compareValues(value, condition?.value, action, cacheKey));
};

// Use Sets for optimized lookups
export const checkItemsPresence = (items, list) => {
    const itemsSet = new Set(items);
    return list.some(item => itemsSet.has(item));
};
