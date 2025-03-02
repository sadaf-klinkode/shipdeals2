import { Box, Button, Grid, InlineStack, Tag, Text } from "@shopify/polaris";
import ConditionCardTitle from "./ConditionCardTitle";
import ConditionSelect from "./ConditionSelect";
import { useCallback, useEffect, useState } from "react";
import { ShowSaveBar } from "../../../hooks/showSaveBar";
import DateSelectCondition from "./DateSelectCondition";
import DateTypeChoice from "./DateTypeChoice";
import DateSelectRange from "./DateSelectRange";

const SpecificDatesCondition = ({ conditionKey, conditionIndex, index, setFormData, condition, options, shopTimeZone }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDateRange, setSelectedDateRange] = useState({
        start: condition?.start ? new Date(condition?.start) : new Date(),
        end: condition?.end ? new Date(condition?.end) : new Date(),
    });


    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    const handleDateSelection = (date) => {

        if (condition?.type == 'single') {

            const formattedValue = `${date?.end.getFullYear()}-${String(
                date?.end.getMonth() + 1
            ).padStart(2, "0")}-${String(date?.end.getDate()).padStart(2, "0")}`;

            setSelectedDate(date?.end);

            setFormData((prevFormData) => {
                let updatedConditions = [...prevFormData.conditions];
                if (Array.isArray(updatedConditions[conditionIndex][conditionKey][index].value)) {
                    if (!updatedConditions[conditionIndex][conditionKey][index].value.includes(formattedValue)) {
                        updatedConditions[conditionIndex][conditionKey][index].value = [...updatedConditions[conditionIndex][conditionKey][index].value, formattedValue];
                    }
                }


                return {
                    ...prevFormData,
                    conditions: updatedConditions
                };
            });
        }
        if (condition?.type == 'range') {



            setSelectedDateRange(date);
            setFormData((prevFormData) => {
                let updatedConditions = [...prevFormData.conditions];
                updatedConditions[conditionIndex][conditionKey][index] = {
                    action: updatedConditions[conditionIndex][conditionKey][index].action,
                    type: updatedConditions[conditionIndex][conditionKey][index].type,
                    start: formatDate(date?.start),
                    end: formatDate(date?.end)
                }
                return {
                    ...prevFormData,
                    conditions: updatedConditions
                };
            });

        }


    };

    const handleChange = useCallback((key) => {
        return (value) => {
            ShowSaveBar();
            setFormData((prevFormData) => {
                let updatedConditions = [...prevFormData.conditions];
                updatedConditions[conditionIndex][conditionKey][index].type = value[0];
                if (value[0] === "range") {
                    updatedConditions[conditionIndex][conditionKey][index] = {
                        action: updatedConditions[conditionIndex][conditionKey][index].action,
                        type: updatedConditions[conditionIndex][conditionKey][index].type
                    }
                    setSelectedDateRange({
                        start: new Date(),
                        end: new Date()
                    })
                } else {
                    updatedConditions[conditionIndex][conditionKey][index] = {
                        action: updatedConditions[conditionIndex][conditionKey][index].action,
                        type: updatedConditions[conditionIndex][conditionKey][index].type,
                        value: []
                    }
                    setSelectedDate(new Date())
                }
                return {
                    ...prevFormData,
                    conditions: updatedConditions
                };
            })
        };
    }, []);

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
            updatedConditions[conditionIndex][conditionKey][index].action = condition?.action || "If found";
            updatedConditions[conditionIndex][conditionKey][index].type = condition?.type || "single";
            if (!condition?.type == 'range' || condition?.type) {
                updatedConditions[conditionIndex][conditionKey][index].value = condition?.value || [];
            }

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

                <DateTypeChoice selected={condition?.type} handleChange={handleChange} />

                <Box paddingBlockStart={400}>
                    {
                        condition?.type == 'range' ?
                            <DateSelectRange handleDateSelection={handleDateSelection} selectedDateRange={selectedDateRange} />
                            :
                            <DateSelectCondition handleDateSelection={handleDateSelection} selectedDate={selectedDate} />
                    }
                </Box>
            </Box>

            <Box padding={"500"}>
                <InlineStack gap="400" blockAlign="center">

                    {
                        condition?.value?.length > 0 && condition?.value?.map((item, i) => (
                            <Box key={i}>
                                <Tag size='large' onRemove={() => {
                                    ShowSaveBar();
                                    const updatedCollections = condition?.value.filter((date) => date !== item);

                                    setFormData((prevFormData) => {
                                        let updatedConditions = [...prevFormData.conditions];
                                        updatedConditions[conditionIndex][conditionKey][index].value = updatedCollections;

                                        return {
                                            ...prevFormData,
                                            conditions: updatedConditions
                                        };
                                    });

                                }}>
                                    {
                                        item
                                    }
                                </Tag>
                            </Box>
                        ))
                    }
                </InlineStack>
            </Box>


            <Box paddingBlockStart="100">
                <Text as="p" variant="bodyMd">
                    *The time is automatically based on the store's timezone: {shopTimeZone}
                </Text>
            </Box>
        </Box>
    );
};

export default SpecificDatesCondition;