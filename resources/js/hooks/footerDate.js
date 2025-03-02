export function getDateDifference(inputDate) {
    // Parse the input date and today's date
    const givenDate = new Date(inputDate);
    const today = new Date();

    // Set both dates to midnight for accurate day comparisons
    givenDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Calculate the difference in time (in milliseconds)
    const timeDifference = today - givenDate;

    // Convert the time difference to days
    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    // Determine the descriptive string
    if (dayDifference === 0) {
        return "today";
    } else if (dayDifference === 1) {
        return "1 day ago";
    } else if (dayDifference > 1) {
        return `${dayDifference} days ago`;
    } else if (dayDifference === -1) {
        return "tomorrow";
    } else {
        return `${Math.abs(dayDifference)} days from now`;
    }
}