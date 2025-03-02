import { Text } from "@shopify/polaris";
import { conditionData } from "../../../data";

const ConditionCardTitle = ({ conditionKey }) => {

    const condition = conditionData[conditionKey] || { title: "Condition" };

    return (
        <Text variant="bodyMd" as="label">
            {condition.title}
        </Text>
    );
};
export default ConditionCardTitle