import { Select } from "@shopify/polaris";

const ConditionSelect = ({ options = [], onChange, value }) => {

    return (
        <Select
            options={options}
            onChange={onChange}
            value={value}


        />
    );
};
export default ConditionSelect;