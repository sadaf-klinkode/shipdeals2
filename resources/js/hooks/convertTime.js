export const convertTimeWithoutAmPm = (time) => {
    if (!time) return "";
    // সময় ভাগ করা
    let [timePart, modifier] = time.split(" "); // timePart = "1:00", modifier = "PM"
    let [hours, minutes] = timePart.split(":"); // hours = "1", minutes = "00"

    // ২৪-ঘণ্টা ফরম্যাটে রূপান্তর
    if (modifier === "PM" && hours !== "12") {
        hours = parseInt(hours, 10) + 12; // PM হলে ১২ যোগ করুন
    } else if (modifier === "AM" && hours === "12") {
        hours = "00"; // মধ্যরাতের জন্য
    }

    // যদি সময় একক সংখ্যা হয়, তাহলে শূন্য যোগ করুন
    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");

    let result = `${hours}:${minutes}`; // চূড়ান্ত সময়
    return result
};


export const convertTimeWithAmPm = (time) => {
    if (!time) return "";
    // সময় ভাগ করা
    let [hours, minutes] = time.split(":"); // hours = "13", minutes = "00"
    let modifier = "AM";

    // ১২-ঘণ্টা ফরম্যাটে রূপান্তর
    if (parseInt(hours, 10) >= 12) {
        modifier = "PM"; // দুপুর বা বিকাল
        if (hours !== "12") {
            hours = (parseInt(hours, 10) - 12).toString();
        }
    } else if (hours === "00") {
        hours = "12"; // মধ্যরাতের জন্য
    }

    // একক সংখ্যা হলে শূন্য বাদ দিন
    hours = parseInt(hours, 10).toString(); // একক ঘণ্টার জন্য শূন্য বাদ দিন

    let result = `${hours}:${minutes} ${modifier}`; // চূড়ান্ত সময়
    return result;
};
