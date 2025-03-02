import { Box, Button, InlineStack } from "@shopify/polaris";
import { Text } from "@shopify/polaris";
import React from "react";
import { ShowSaveBar } from "../../../hooks/showSaveBar";


const Always = ({ conditionKey, conditionIndex, index, setFormData }) => {


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

    return (
        <Box paddingInlineStart={400} paddingInlineEnd={400}>
            <Box paddingBlockStart="200" paddingBlockEnd="200">
                <InlineStack align="space-between">
                    <Text variant="bodyMd" as="h3">Always</Text>
                    <Button variant="plain" onClick={removeCondition}>
                        <Text variant="bodySmall" as="small">remove</Text>
                    </Button>
                </InlineStack>
            </Box>

            <Text variant="bodyMd" as="h3">No need to check for condition. Always applicable at checkout.</Text>
        </Box>
    )
};

export default Always