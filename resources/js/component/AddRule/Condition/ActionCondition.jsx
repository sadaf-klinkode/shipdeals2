import { useEffect } from "react";


import { Box, Button, Grid, InlineStack, Select, Text } from "@shopify/polaris";
import ConditionCardTitle from "./ConditionCardTitle";
import ConditionFooter from "./ConditionFooter";
import { ShowSaveBar } from "../../../hooks/showSaveBar";


const ActionCondition = ({ conditionKey, conditionIndex, index, setFormData, condition, options }) => {
    const handleLabelChange = (value) => {
        console.log(value)
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

        if (
            conditionKey === "customerIsCompany"
        ) {

            setFormData((prevFormData) => {
                let updatedConditions = [...prevFormData.conditions];
                updatedConditions[conditionIndex][conditionKey][index].action = condition?.action || 'Block if a company';

                return {
                    ...prevFormData,
                    conditions: updatedConditions
                };
            });
        }
        if (
            conditionKey === "subscriptionProducts" ||
            conditionKey === "freeShippingMethod" ||
            conditionKey === "pobox" ||
            conditionKey === 'customerLogin'
        ) {

            setFormData((prevFormData) => {
                let updatedConditions = [...prevFormData.conditions];
                updatedConditions[conditionIndex][conditionKey][index].action = condition?.action || "If found";
                return {
                    ...prevFormData,
                    conditions: updatedConditions
                };
            });
        }

    }, [conditionKey]);



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
                <Grid gap={500}>
                    <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                        <Select
                            options={options}
                            onChange={handleLabelChange}
                            value={condition?.action}
                        />


                    </Grid.Cell>
                </Grid>
            </Box>
            <ConditionFooter conditionKey={conditionKey} />
        </Box>
    );
};


export default ActionCondition;