import { Box, Button, Grid, InlineStack, Text } from "@shopify/polaris";
import ConditionCardTitle from "./ConditionCardTitle";
import ConditionFooter from "./ConditionFooter";
import ConditionSelect from "./ConditionSelect";
import ConditionTextField from "./ConditionTextField";
import { useEffect } from "react";
import { ShowSaveBar } from "../../../hooks/showSaveBar";



const Condition = ({ placeholder = '', conditionKey, conditionIndex, index, setFormData, condition, options, }) => {

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
    const handleValueChange = (value) => {
        // setSelectValue(value)
        ShowSaveBar();
        setFormData((prevFormData) => {
            let updatedConditions = [...prevFormData.conditions];
            updatedConditions[conditionIndex][conditionKey][index].value = value;

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
            conditionKey === 'cartTotal' ||
            conditionKey === 'cartSubtotal' ||
            conditionKey === 'specificItemsTotal' ||
            conditionKey === 'totalOrderWeight' ||
            conditionKey === 'specificItemsWeight' ||
            conditionKey === 'totalQuantity' ||
            conditionKey === 'singleProductQuantity' ||
            conditionKey === 'singleVariantQuantity' ||
            conditionKey === 'specificItemsQuantity' ||
            conditionKey === 'customerTotalSpent' ||
            conditionKey === 'discountAmount'
        ) {
            setFormData((prevFormData) => {
                let updatedConditions = [...prevFormData.conditions];
                updatedConditions[conditionIndex][conditionKey][index].action = condition?.action || "Less than";

                return {
                    ...prevFormData,
                    conditions: updatedConditions
                };
            });
        }
        if (
            conditionKey === 'productTags' ||
            conditionKey === 'cartCurrency' ||
            conditionKey === 'customerTags' ||
            conditionKey === 'companyNames' ||
            conditionKey === 'address' ||
            conditionKey === 'provinceCodes' ||
            conditionKey === 'zipPostalCodes' ||
            conditionKey === 'city'
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
                        <ConditionSelect
                            options={options}
                            onChange={handleLabelChange}
                            value={condition?.action}
                        />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 8, xl: 8 }}>
                        <ConditionTextField
                            onChange={handleValueChange}
                            value={condition?.value}
                            placeholder={placeholder}
                        />
                    </Grid.Cell>
                </Grid>
            </Box>
            <ConditionFooter conditionKey={conditionKey} />

            {renderConditionInfo(conditionKey)}
        </Box>
    );
};



const renderConditionInfo = (conditionKey) => {
    const conditionInfo = {
        shippingCountry: (
            <Box paddingBlockStart={200}>
                <Text as="span" variant="bodyXs">
                    Shopify API validates the shipping country only after adding{' '}
                    <Text as="span" variant="bodyXs" tone="magic-subdued">
                        postal code
                    </Text>{' '}
                    and{' '}
                    <Text as="span" variant="bodyXs" tone="magic-subdued">
                        province name
                    </Text>{' '}
                    on the checkout page.
                </Text>
            </Box>
        ),
        provinceCodes: (
            <Box paddingBlockStart={200}>
                <Text as="span" variant="bodyXs">
                    Add 2 digit province/state code in{' '}
                    <Text as="span" variant="bodyXs" tone="magic-subdued">
                        3166-1 {' '}
                    </Text>
                    <Text as="span" variant="bodyXs" tone="magic-subdued">
                        alpha-2
                    </Text>{' '}
                    format. Example: Add OH for Ohio state.
                </Text>
            </Box>
        ),
    };

    return conditionInfo[conditionKey] || null;
};

export default Condition