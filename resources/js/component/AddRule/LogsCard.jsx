import { BlockStack, Box, Button, Card, Text } from "@shopify/polaris";

const LogsCard = () => {
    return (
        <Card roundedAbove="sm">
            <Text as="h2" variant="headingSm">
                Share logs
            </Text>
            <Box paddingBlockStart="200">
                <BlockStack gap={"200"}>
                    <Text as="p" variant="bodyMd">
                        Please watch the video below to learn how to share the PayRules logs.
                    </Text>
                    <Box>
                        <Button>How to share logs</Button>
                    </Box>
                </BlockStack>
            </Box>
        </Card>
    );
};
export default LogsCard