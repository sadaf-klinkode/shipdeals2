import { Card, DatePicker, Icon, Popover, TextField } from "@shopify/polaris";
import { CalendarIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useRef, useState } from "react";

const DateSelectRange = ({ handleDateSelection, selectedDateRange }) => {

    const [{ month, year }, setDate] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    });

    const handleMonthChange = (month, year) => {
        setDate({ month, year });
    };


    useEffect(() => {
        setDate({
            month: new Date().getMonth(),
            year: new Date().getFullYear()
        });
    }, [selectedDateRange]);
    return (
        <DatePicker
            month={month}
            year={year}
            onChange={handleDateSelection}
            onMonthChange={handleMonthChange}
            selected={selectedDateRange}
            allowRange
        />

    );
};

export default DateSelectRange;
