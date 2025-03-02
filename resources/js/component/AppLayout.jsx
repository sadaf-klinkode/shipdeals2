import { Box, FooterHelp, Link, Text } from "@shopify/polaris";
import { getDateDifference } from "../hooks/footerDate";

const AppLayout = ({ children }) => {
    return (
        <div>
            {children}
            <Box paddingBlockStart="500" paddingBlockEnd={500}>
                <FooterHelp>
                    <Link url="https://klinkode.com/contact-us/">
                        KlinKode Help Center
                    </Link>
                    <br />
                    <small>
                        Last updated {getDateDifference('2025-02-27')}.
                    </small>
                </FooterHelp>

            </Box>
        </div>
    );
};
export default AppLayout