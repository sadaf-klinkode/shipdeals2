import { Box, Button, Grid, InlineStack, Text } from "@shopify/polaris";
import ConditionCardTitle from "./ConditionCardTitle";
import ConditionSelect from "./ConditionSelect";
import { useEffect, useState } from "react";
import { ShowSaveBar } from "../../../hooks/showSaveBar";
import ConditionTimeSelect from "./ConditionTimeSelect";
import { convertTimeWithoutAmPm } from "../../../hooks/convertTime";

const HoursCondition = ({ conditionKey, conditionIndex, index, setFormData, condition, options, shopTimeZone }) => {
    const [visibleStart, setVisibleStart] = useState(false);
    const [visibleEnd, setVisibleEnd] = useState(false);
    const handleLabelChange = (value) => {
        ShowSaveBar();
        setFormData((prevFormData) => {
            let updatedConditions = [...prevFormData.conditions];
            updatedConditions[conditionIndex][conditionKey][index].action = value;

            return {
                ...prevFormData,
                conditions: updatedConditions
            };
        });
    };


    const handleChangeStartAt = (value) => {
        ShowSaveBar();
        setFormData((prevFormData) => {
            let updatedConditions = [...prevFormData.conditions];
            updatedConditions[conditionIndex][conditionKey][index].startAt = convertTimeWithoutAmPm(value);

            return {
                ...prevFormData,
                conditions: updatedConditions
            };
        });
        setVisibleStart(false)
    };
    const handleChangeEndAt = (value) => {
        ShowSaveBar();
        setFormData((prevFormData) => {
            let updatedConditions = [...prevFormData.conditions];
            updatedConditions[conditionIndex][conditionKey][index].endAt = convertTimeWithoutAmPm(value);

            return {
                ...prevFormData,
                conditions: updatedConditions
            };
        });
        setVisibleEnd(false)
    };

    const removeCondition = () => {
        ShowSaveBar();
        setFormData((prevFormData) => {
            let updatedConditions = [...prevFormData.conditions];

            updatedConditions[conditionIndex] = {
                ...updatedConditions[conditionIndex],
                [conditionKey]: updatedConditions[conditionIndex][conditionKey].filter((_, i) => i !== index)
            };

            return {
                ...prevFormData,
                conditions: updatedConditions
            };
        });
    };

    useEffect(() => {

        setFormData((prevFormData) => {
            let updatedConditions = [...prevFormData.conditions];
            updatedConditions[conditionIndex][conditionKey][index].action = condition?.action || "is in between";
            updatedConditions[conditionIndex][conditionKey][index].startAt = condition?.startAt || "12:00";
            updatedConditions[conditionIndex][conditionKey][index].endAt = condition?.endAt || "12:00";

            return {
                ...prevFormData,
                conditions: updatedConditions
            };
        });

    }, [conditionKey])
    return (
        <Box paddingInlineStart={400} paddingInlineEnd={400}>
            <Box paddingBlockStart="200">
                <InlineStack gap="2" align="space-between">
                    <ConditionCardTitle conditionKey={conditionKey} />
                    <Button variant="plain" onClick={removeCondition}>
                        <Text variant="bodySmall" as="small">remove</Text>
                    </Button>
                </InlineStack>
            </Box>
            <Box paddingBlockStart="200">
                <ConditionSelect
                    options={options}
                    onChange={handleLabelChange}
                    value={condition?.action}
                />
                <Box paddingBlockStart={400}>
                    <Grid gap={500}>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                            <ConditionTimeSelect visible={visibleStart} setVisible={setVisibleStart} handleChange={handleChangeStartAt} label={'Start hour'} formTime={condition?.startAt} />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                            <ConditionTimeSelect visible={visibleEnd} setVisible={setVisibleEnd} handleChange={handleChangeEndAt} label={'End hour'} formTime={condition?.endAt} />
                        </Grid.Cell>
                    </Grid>
                </Box>
            </Box>
            <Box paddingBlockStart="100">
                <Text as="p" variant="bodyMd">
                    *The time is automatically based on the store's timezone: {shopTimeZone}
                </Text>
            </Box>
        </Box>
    );
};

export default HoursCondition;