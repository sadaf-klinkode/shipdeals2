import { Banner, Text } from "@shopify/polaris";
import { ChatIcon } from "@shopify/polaris-icons";

const HelpAlert = () => {
    return (
        <Banner
            title=" Need help?"
            tone="success"
            icon={ChatIcon}
        >
            <Text>
                We'll set up the rule for you. Contact via the live chat at the bottom right.
            </Text>
        </Banner>
    );
};
export default HelpAlert