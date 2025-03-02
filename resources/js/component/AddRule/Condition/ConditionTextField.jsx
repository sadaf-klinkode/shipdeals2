import { TextField } from "@shopify/polaris";

const ConditionTextField = ({ placeholder = '', onChange, value }) => {
    return (
        <TextField
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
};
export default ConditionTextField