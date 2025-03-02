export const totalConditionCounter = (conditions) => {
    let totalConditions = 0;

    for (const key in conditions) {
        if (Array.isArray(conditions[key])) {
            totalConditions += conditions[key].length; // প্রতিটি শর্তের লম্বা সংখ্যা যোগ করা
        }
    }

    return totalConditions;
}

export const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
};