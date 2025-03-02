import { Card, Layout, List, Page, Button, Text, Box } from "@shopify/polaris";
import AppLayout from "../component/AppLayout";

const Plans = () => {
    return (
        <AppLayout>
            <Page title="Choose your plan">
                <Layout>
                    <Layout.Section variant="oneHalf">
                        <Card>

                            <Box paddingBlockEnd="200">
                                <Text variant="headingMd" as="h5">
                                    All in One Monthly
                                </Text>
                                <Text as="p" variant="headingXs">
                                    $3.49 /month
                                </Text>
                            </Box>

                            <Box paddingBlockEnd="200">
                                <List type="bullet">
                                    <List.Item>Easy monthly plan. No extra charges are applied.</List.Item>
                                    <List.Item>Unlimited orders.</List.Item>
                                    <List.Item>Multiple conditions in a single rule.</List.Item>
                                    <List.Item>Most quick and straightforward settings.</List.Item>
                                    <List.Item>
                                        Block based on cart total, quantity, products, collections, country, postal code.
                                    </List.Item>
                                    <List.Item>
                                        Block based on discount, market names, delivery types, cart currency.
                                    </List.Item>
                                    <List.Item>
                                        Block based on customer tags, company names, and more.
                                    </List.Item>
                                    <List.Item>Daily support, every day of the week.</List.Item>
                                </List>
                            </Box>

                            

                            <Button primary>
                                Try 3 days free
                            </Button>

                        </Card>
                    </Layout.Section>
                    <Layout.Section variant="oneHalf">
                        <Card>

                            <Box paddingBlockEnd="200">
                                <Text variant="headingMd" as="h5">
                                    All in One Yearly
                                </Text>
                                <Text as="p" variant="headingXs">
                                    $2.79 /month (billed annually)
                                </Text>
                            </Box>


                            <Box paddingBlockEnd="200">
                                <List type="bullet">
                                    <List.Item>Save 20% yearly. No extra charges are applied.</List.Item>
                                    <List.Item>Unlimited orders.</List.Item>
                                    <List.Item>Multiple conditions in a single rule.</List.Item>
                                    <List.Item>Most quick and straightforward settings.</List.Item>
                                    <List.Item>
                                        Block based on cart total, quantity, products, collections, country, postal code.
                                    </List.Item>
                                    <List.Item>
                                        Block based on discount, market names, delivery types, cart currency.
                                    </List.Item>
                                    <List.Item>
                                        Block based on customer tags, company names, and more.
                                    </List.Item>
                                    <List.Item>Daily support, every day of the week.</List.Item>
                                </List>
                            </Box>

                            

                            <Button variant="primary" >
                                Try 3 days free
                            </Button>
                        </Card>
                    </Layout.Section>
                </Layout>

            </Page>
        </AppLayout>
    );
};
export default Plans