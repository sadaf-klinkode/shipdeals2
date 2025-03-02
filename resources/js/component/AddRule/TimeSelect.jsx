import { Popover, TextField, Icon, Card, ActionList, Box, Text } from "@shopify/polaris";
import { CalendarIcon } from "@shopify/polaris-icons";
import { useEffect, useState } from "react";
import { convertTimeWithAmPm, convertTimeWithoutAmPm } from "../../hooks/convertTime";

const TimeSelect = ({ setFormData, updateField, formTime, label }) => {
    const [visible, setVisible] = useState(false);

    const generateTimeSlots = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute of [0, 30]) {
                const period = hour < 12 ? "AM" : "PM";
                const displayHour = hour % 12 || 12; // Convert 24-hour to 12-hour format
                const displayMinute = minute.toString().padStart(2, "0");
                times.push(`${displayHour}:${displayMinute} ${period}`);
            }
        }
        return times;
    };

    const timeSlots = generateTimeSlots();

    const handleTimeSelect = (time) => {
        setVisible(false); // Close the Popover
        const formatTime = convertTimeWithoutAmPm(time)
        const formattedTime = convertTimeWithAmPm(formatTime)
        console.log(formatTime);
        console.log(formattedTime);
        setFormData((prevFormData) => {
            const updateActiveDate = {
                ...prevFormData.activeDate,
                [updateField]: formatTime,
            };
            return {
                ...prevFormData,
                activeDate: updateActiveDate,
            };
        });
    };

    useEffect(() => {
        setFormData((prevFormData) => {
            const updateActiveDate = {
                ...prevFormData.activeDate,
                [updateField]: "12:00",
            };
            return {
                ...prevFormData,
                activeDate: updateActiveDate,
            };
        });
    }, [updateField]);
    return (
        <Popover
            active={visible}
            autofocusTarget="none"
            preferredAlignment="left"
            fullWidth
            onClose={() => setVisible(false)}
            activator={
                <TextField
                    role="combobox"
                    label={label}
                    prefix={<Icon source={CalendarIcon} />}
                    value={convertTimeWithAmPm(formTime)}
                    onFocus={() => setVisible(true)}
                    autoComplete="off"
                />
            }
        >
            <ActionList
                actionRole="menuitem"
                items={[
                    ...timeSlots.map((time) => ({
                        content: (
                            <Box>
                                <Text variant="bodyMd" as="div">
                                    {time}
                                </Text>
                            </Box>
                        ),
                        role: 'menuitem',
                        onAction: () => {
                            handleTimeSelect(time);
                        }
                    }))
                ]}
            />
        </Popover>
    );
};

export default TimeSelect;
