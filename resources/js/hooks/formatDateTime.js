
export const formatDateTime = (timeDate, storeTimeZone = "America/New_York") => {
    if (!timeDate) return { date: null, time: null };
    const storeTime = new Intl.DateTimeFormat("en-US", {
        timeZone: storeTimeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(new Date(timeDate));

    if (!storeTime) return { date: null, time: null };

    const [datePart, timePart] = storeTime.split(", ");

    return { date: datePart, time: timePart };
};



