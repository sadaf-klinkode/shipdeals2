import { Box, Card, ChoiceList, Text } from "@shopify/polaris";
import { useCallback, useState } from "react";

const DateTypeChoice = ({ selected = 'single', handleChange }) => {

    return (
        <Box paddingBlockStart={500} paddingBlockEnd="500">
            <ChoiceList
                choices={[
                    { label: 'Single', value: 'single' },
                    { label: 'Range', value: 'range' },
                ]}
                selected={selected}
                onChange={handleChange('type')}
            />
        </Box>
    );
};
export default DateTypeChoice