import { Popover, TextField, Icon, ActionList, Box, Text } from "@shopify/polaris";
import { CalendarIcon } from "@shopify/polaris-icons";
import { capitalizeFirstLetter } from "../../../hooks/utils";

const ConditionDaySelect = ({ handleChange, day, label, visible, setVisible }) => {
    const daysOfWeek = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];

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
                    value={day ? capitalizeFirstLetter(day) : ""}
                    onFocus={() => setVisible(true)}
                    autoComplete="off"
                />
            }
        >
            <ActionList
                actionRole="menuitem"
                items={daysOfWeek.map((dayName) => ({
                    content: (
                        <Box>
                            <Text variant="bodyMd" as="div">
                                {dayName}
                            </Text>
                        </Box>
                    ),
                    role: 'menuitem',
                    onAction: () => {
                        handleChange(dayName);
                        setVisible(false);
                    }
                }))}
            />
        </Popover>
    );
};

export default ConditionDaySelect;
