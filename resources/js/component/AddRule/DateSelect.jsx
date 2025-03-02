import { Card, DatePicker, Icon, Popover, TextField } from "@shopify/polaris";
import { CalendarIcon } from "@shopify/polaris-icons";
import { useEffect, useRef, useState } from "react";

const DateSelect = ({ setFormData, updateField, formDate, label }) => {
    const [visible, setVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [{ month, year }, setDate] = useState({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
    });


    const handleOnClose = () => {
        setVisible(false);
    };

    const handleMonthChange = (month, year) => {
        setDate({ month, year });
    };

    const handleDateSelection = ({ end: newSelectedDate }) => {

        const formattedValue = `${newSelectedDate.getFullYear()}-${String(
            newSelectedDate.getMonth() + 1
        ).padStart(2, "0")}-${String(newSelectedDate.getDate()).padStart(2, "0")}`;

        setFormData((prevFormData) => {
            const updateActiveDate = {
                ...prevFormData.activeDate,
                [updateField]: formattedValue
            }
            return {
                ...prevFormData,
                activeDate: updateActiveDate,
            };
        })
        setSelectedDate(newSelectedDate);
        setVisible(false);
    };

    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    useEffect(() => {
        setFormData((prevFormData) => {
            const initialDate = formatDate(selectedDate);

            const updateActiveDate = {
                ...prevFormData.activeDate,
                [updateField]: initialDate,
            };
            return {
                ...prevFormData,
                activeDate: updateActiveDate,
            };
        });
    }, [setFormData, updateField, selectedDate]);


    useEffect(() => {
        setDate({
            month: selectedDate.getMonth(),
            year: selectedDate.getFullYear(),
        });
    }, [selectedDate]);

    return (
        <Popover
            active={visible}
            autofocusTarget="none"
            preferredAlignment="left"
            fullWidth
            preferInputActivator={false}
            preferredPosition="below"
            preventCloseOnChildOverlayClick
            onClose={handleOnClose}
            activator={
                <TextField
                    role="combobox"
                    label={label}
                    prefix={<Icon source={CalendarIcon} />}
                    value={formDate}
                    onFocus={() => setVisible(true)}
                    autoComplete="off"
                />
            }
        >
            <Card>
                <DatePicker
                    month={month}
                    year={year}
                    selected={selectedDate}
                    onMonthChange={handleMonthChange}
                    onChange={handleDateSelection}
                />
            </Card>
        </Popover>
    );
};

export default DateSelect;
