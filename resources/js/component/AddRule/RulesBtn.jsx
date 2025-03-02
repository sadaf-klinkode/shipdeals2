import { Button, ButtonGroup } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

const RulesBtn = ({ submitForm, loading }) => {
    const navigate = useNavigate();
    return (
        <ButtonGroup>
            <Button variant="primary" onClick={submitForm} disabled={loading}>Save</Button>
            <Button disabled={loading} onClick={() => navigate("/")}>Discard</Button>
        </ButtonGroup>

    );
};
export default RulesBtn