import { Banner, Box, Button, Card, EmptyState, Grid, InlineStack, List, MediaCard, Page, } from "@shopify/polaris";
import { AlertTriangleIcon } from "@shopify/polaris-icons";
import AppLayout from "../component/AppLayout";
import { recommendationsData } from "../data";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../component/Loading";
import { getRequest } from "../api";
import RulesTable from "../component/RulesTable";


const Rules = () => {
    const navigate = useNavigate();

    const [discountRules, setDiscountRules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [storeTimeZone, setStoreTimeZone] = useState();

    useEffect(() => {
        const getDiscountRule = async () => {
            try {
                setLoading(true);
                const data = await getRequest('/api/get-rules/cart');
                const updatedData = data?.discounts?.data?.discountNodes?.edges?.filter((item) => (data?.shippingDiscountsFunctionId == item?.node?.discount?.appDiscountType?.functionId || data?.advanceShippingDiscountsFunctionId == item?.node?.discount?.appDiscountType?.functionId) && item)
                setDiscountRules(updatedData)
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getDiscountRule();

        const getShopTimeZone = async () => {
            try {
                const data = await getRequest('/api/get-shop-timezone');
                setStoreTimeZone(
                    data?.shop?.body?.data?.shop?.ianaTimezone
                );
            } catch (error) {
                console.error(error);
            }
        }
        getShopTimeZone();
    }, []);


    if (loading) {
        return <Loading />
    }
    return (
        <AppLayout>
            <Page title="All rules">
                {
                    (discountRules?.length > 0) ?
                        <>
                            <RulesTable discountRules={discountRules} setLoading={setLoading} setDiscountRules={setDiscountRules} loading={loading} storeTimeZone={storeTimeZone} />
                            <Box paddingBlockStart="500">
                                <InlineStack gap="500" align="start">
                                    <Button onClick={() => navigate('/add-rule/discount')} >Add a Shipping discount</Button>
                                    <Button variant="primary" onClick={() => navigate('/add-rule/advanced-discount')} >Add a advanced shipping discount</Button>
                                </InlineStack>
                            </Box>
                        </>
                        :
                        <Card sectioned>
                            <EmptyState
                                heading="No Rules. Create one!"
                                action={{
                                    content: 'Add a Shipping discount',
                                    onAction: () => navigate('/add-rule/discount')
                                }}
                                secondaryAction={{
                                    content: 'Add a advanced shipping discount',
                                    onAction: () => navigate('/add-rule/advanced-discount')
                                }}
                                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                                fullWidth
                            >
                                <p>
                                    There are no existing Cart Lock rules.
                                </p>
                            </EmptyState>
                        </Card>
                }
            </Page>
            <Page title="Recommended apps for this store">

                <Grid>
                    {
                        recommendationsData?.map((data, index) =>
                            <Grid.Cell key={index} columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                <MediaCard
                                    title={data?.heading}
                                    primaryAction={{
                                        content: data?.url_text,
                                        onAction: () => { window.open(data?.url, '_blank') },
                                    }}
                                    description={data?.paragraph}
                                    size='small'
                                >
                                    <img
                                        alt=""
                                        width="100%"
                                        height="100%"
                                        style={{
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                        }}
                                        src={
                                            data?.image
                                        }
                                        className='w-full h-full'
                                    />
                                </MediaCard>
                            </Grid.Cell>
                        )
                    }
                </Grid>
                <Box paddingBlockStart="1000">
                    <Banner
                        title="Shopify API limitations"
                        tone="info"
                        icon={AlertTriangleIcon}
                    >
                        <List type="bullet">
                            <List.Item>You can create up to 5 validation rules.</List.Item>
                        </List>
                    </Banner>
                </Box>
            </Page>
        </AppLayout>
    );
};
export default Rules




