import { Card, DatePicker, Icon, Popover, TextField } from "@shopify/polaris";
import { CalendarIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useRef, useState } from "react";

const DateSelectCondition = ({ handleDateSelection, selectedDate }) => {

    const [{ month, year }, setDate] = useState({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
    });

    const handleMonthChange = (month, year) => {
        setDate({ month, year });
    };


    useEffect(() => {
        setDate({
            month: selectedDate.getMonth(),
            year: selectedDate.getFullYear(),
        });
    }, [selectedDate]);
    return (
        <DatePicker
            month={month}
            year={year}
            onChange={handleDateSelection}
            onMonthChange={handleMonthChange}
            selected={selectedDate}
        />

    );
};

export default DateSelectCondition;
