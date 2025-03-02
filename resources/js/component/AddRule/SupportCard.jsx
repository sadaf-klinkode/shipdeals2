import { BlockStack, Box, Button, Card, Text } from "@shopify/polaris";

const SupportCard = () => {
    return (
        <Card roundedAbove="lg">
            <Text as="h2" variant="headingSm">
                Support
            </Text>
            <Box paddingBlockStart="200">
                <BlockStack gap={"200"}>
                    <Text as="p" variant="bodyMd">
                        If you need assistance, please reach out to our support team using the button below.
                    </Text>
                    <Box>
                        <Button>Contact support</Button>
                    </Box>
                </BlockStack>
            </Box>
        </Card>
    );
};
export default SupportCard