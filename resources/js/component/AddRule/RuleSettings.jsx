import { BlockStack, Box, Card, Checkbox, RadioButton, Text, TextField } from "@shopify/polaris";

const RuleSettings = () => {
    return (
        <Card roundedAbove="sm">
            <Text as="h2" variant="headingSm">
                Rule settings
            </Text>

            <Box paddingBlockStart="200">
                <TextField
                    label="Rule name"
                    // value={value}
                    // onChange={handleChange}
                    autoComplete="off"
                />
                <Text as="p" variant="bodySm" tone="subdued">
                    For internal use only.
                </Text>
            </Box>

            <Box paddingBlockStart="200">
                <Text as="p">Hide, sort or rename payment methods</Text>
                <BlockStack gap="60">
                    <Checkbox
                        label="Hide"
                    // checked={checked}
                    // onChange={handleCheckboxChange}
                    />
                    <Checkbox
                        label="Sort"
                    // checked={checked}
                    // onChange={handleCheckboxChange}
                    />
                    <Checkbox
                        label="Rename"
                    // checked={checked}
                    // onChange={handleCheckboxChange}
                    />
                </BlockStack>
            </Box>

            <Box paddingBlockStart="200">
                <Text as="p">Match conditions</Text>

                <BlockStack gap="60">
                    <RadioButton
                        label="All"
                        helpText="All specified conditions above must be met to change the payment methods."
                        // checked={value === 'disabled'}
                        id="disabled"
                        name="accounts"
                    // onChange={handleChange}
                    />
                    <RadioButton
                        label="Any"
                        helpText="Any of the specified conditions above is sufficient to change the payment methods."
                        id="optional"
                        name="accounts"
                    // checked={value === 'optional'}
                    // onChange={handleChange}
                    />
                </BlockStack>
            </Box>
        </Card>
    );
};
export default RuleSettings