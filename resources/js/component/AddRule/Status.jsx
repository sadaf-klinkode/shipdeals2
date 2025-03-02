import { Box, Card, ChoiceList, Text } from "@shopify/polaris";
import { useCallback, useState } from "react";

const Status = ({ status, handleChange }) => {
    // const [selected, setSelected] = useState([1]);

    // const handleChange = useCallback((value) => setSelected(value), []);
    return (
        <Card>
            <Box paddingBlockEnd="200">
                <Text variant="headingMd" as="h4">
                    Status
                </Text>
            </Box>
            <ChoiceList
                choices={[
                    { label: 'Enabled', value: 1 },
                    { label: 'Disabled', value: 0 },
                ]}
                selected={[status]}
                onChange={handleChange('status')}
            />
        </Card>
    );
};
export default Status