import { Box, Button, Form, FormLayout, Grid, InlineStack, KeyboardKey, Select, Tag, Text, TextField } from "@shopify/polaris";
import ConditionCardTitle from "./ConditionCardTitle";
import ConditionFooter from "./ConditionFooter";
import ConditionSelect from "./ConditionSelect";
import ConditionTextField from "./ConditionTextField";
import { useCallback, useEffect, useState } from "react";
import { ShowSaveBar } from "../../../hooks/showSaveBar";



const CartAttributeCondition = ({ placeholder = '', conditionKey, conditionIndex, index, setFormData, condition, options, }) => {

    const [cartAttributeValue, setCartAttributeValue] = useState('');
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
    const handleKeyChange = (value) => {
        // setSelectValue(value)
        ShowSaveBar();
        setFormData((prevFormData) => {
            let updatedConditions = [...prevFormData.conditions];
            updatedConditions[conditionIndex][conditionKey][index].key = value;

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

    const handleCartAttributeValue = useCallback(() => {
        if (cartAttributeValue.trim() !== '') {
            ShowSaveBar();
            ShowSaveBar();
            setFormData((prevFormData) => {
                let updatedConditions = [...prevFormData.conditions];
                if (updatedConditions[conditionIndex][conditionKey][index].value) {
                    updatedConditions[conditionIndex][conditionKey][index].value = [cartAttributeValue, ...updatedConditions[conditionIndex][conditionKey][index].value];
                } else {
                    updatedConditions[conditionIndex][conditionKey][index].value = [cartAttributeValue];
                }

                return {
                    ...prevFormData,
                    conditions: updatedConditions
                };
            });
            setCartAttributeValue('');
        }
    }, [cartAttributeValue]);

    useEffect(() => {

        if (
            conditionKey === 'cartAttribute'
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
                <Grid gap={500}>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }}>
                        <Select
                            label="Operator"
                            options={options}
                            onChange={handleLabelChange}
                            value={condition?.action}
                        />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 8, xl: 8 }}>
                        <TextField
                            label="Key"
                            type="text"
                            placeholder={'Add attribute key'}
                            value={condition?.key}
                            onChange={handleKeyChange}
                        />
                    </Grid.Cell>
                </Grid>

                <Box paddingBlockStart="400">
                    <Form onSubmit={handleCartAttributeValue}>
                        <FormLayout>
                            <TextField
                                label="Value"
                                value={cartAttributeValue}
                                autoComplete="off"
                                placeholder="Add attribute value"
                                onChange={(value) => setCartAttributeValue(value)}

                            />
                        </FormLayout>
                    </Form>
                    <Box paddingBlockStart={500}>
                        <InlineStack gap="400" blockAlign="center">
                            {
                                condition?.value?.length > 0 && condition?.value?.map((item, i) => (
                                    <Box key={i}>
                                        <Tag size='large' onRemove={() => {
                                            setFormData((prevFormData) => {
                                                let updatedConditions = [...prevFormData.conditions];
                                                const updatedValues = prevFormData?.conditions[conditionIndex][conditionKey][index].value?.filter((v) => v !== item);
                                                updatedConditions[conditionIndex][conditionKey][index].value = updatedValues;
                                                return {
                                                    ...prevFormData,
                                                    conditions: updatedConditions
                                                };
                                            })
                                        }}>{item}</Tag>
                                    </Box>
                                ))
                            }
                        </InlineStack>
                    </Box>

                    <Box>
                        <Text as="p" variant="bodySm" tone="subdued">
                            Press  <KeyboardKey size="small">Enter</KeyboardKey> to add, allow multiple values.
                        </Text>
                    </Box>
                </Box>
            </Box>
            <ConditionFooter conditionKey={conditionKey} />
        </Box>
    );
};


export default CartAttributeCondition