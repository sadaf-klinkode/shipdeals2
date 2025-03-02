import { Box, Text } from "@shopify/polaris";
import { conditionData } from "../../../data";

const ConditionFooter = ({ conditionKey }) => {

    const condition = conditionData[conditionKey] || { description: "No specific condition applied." };

    return (
        <Box paddingBlockStart="100">
            <Text as="p" variant="bodyMd">
                {condition.description}
            </Text>
        </Box>
    );
};
export default ConditionFooter