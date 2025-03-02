import { Popover, TextField, Icon, ActionList, Box, Text } from "@shopify/polaris";
import { CalendarIcon } from "@shopify/polaris-icons";
import { convertTimeWithAmPm } from "../../../hooks/convertTime";

const ConditionTimeSelect = ({ handleChange, formTime, label, visible, setVisible }) => {
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
                            handleChange(time);
                        }
                    }))
                ]}
            />
        </Popover>
    );
};

export default ConditionTimeSelect;
