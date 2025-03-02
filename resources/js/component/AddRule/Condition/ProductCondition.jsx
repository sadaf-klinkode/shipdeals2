import React, { useCallback, useEffect, useState, useRef } from "react";
import {
    Box, TextField, Grid, InlineStack, Button, Modal, Icon,
    ResourceList,
    ResourceItem,
    Text,
    Tag,
    EmptyState
} from "@shopify/polaris";
import { PlusIcon, SearchIcon } from '@shopify/polaris-icons';
import ConditionFooter from "./ConditionFooter";
import ConditionCardTitle from "./ConditionCardTitle";
import { selectOptionsString } from "../../../data";
import ConditionSelect from "./ConditionSelect";
import { getRequest } from "../../../api";
import { ShowSaveBar } from "../../../hooks/showSaveBar";
import { searchProducts } from "../../../api";

const ProductCondition = ({ conditionKey, conditionIndex, index, setFormData, condition }) => {
    const productList = useRef(null);
    const [active, setActive] = useState(false);
    const [selectedItems, setSelectedItems] = useState(condition?.items || []);
    const [loading, setLoading] = useState(false);
    const [lastCursor, setLastCursor] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const handleOperatorChange = (value) => {
        // setSelectValue(value)
        ShowSaveBar();
        setFormData((prevFormData) => {
            let updatedConditions = [...prevFormData.conditions];
            updatedConditions[conditionIndex][conditionKey][index].action = value;

            return {
                ...prevFormData,
                conditions: updatedConditions
            };
        });
    };

    // Handles value change
    const handleValueChange = () => {
        ShowSaveBar();

        setFormData((prevFormData) => {
            let updatedConditions = [...prevFormData.conditions];
            updatedConditions[conditionIndex][conditionKey][index].items = selectedItems;

            return {
                ...prevFormData,
                conditions: updatedConditions
            };
        });

        toggleModal();
    };

    const removeCondition = () => {
        ShowSaveBar();
        setFormData((prevFormData) => {
            let updatedConditions = [...prevFormData.conditions];

            updatedConditions[conditionIndex] = {
                ...updatedConditions[conditionIndex],
                [conditionKey]: updatedConditions[conditionIndex][conditionKey].filter((_, i) => i !== index)
            };

            return {
                ...prevFormData,
                conditions: updatedConditions
            };
        });
    };


    const toggleModal = useCallback(() => setActive((active) => !active), []);

    useEffect(() => {

        if (conditionKey === "products") {
            setFormData((prevFormData) => {
                let updatedConditions = [...prevFormData.conditions];
                updatedConditions[conditionIndex][conditionKey][index].action = condition?.action || "If found";

                return {
                    ...prevFormData,
                    conditions: updatedConditions
                };
            });
        }

    }, [conditionKey])

    const loadMoreProducts = async () => {
        if (!lastCursor || loading) return; // Stop if there's no more data to load or already loading

        setLoading(true);

        try {
            const data = await getRequest(`/api/get-products?after=${lastCursor}`);

            const formattedProducts = data?.data?.products?.body?.data?.products?.edges.map(product => ({
                id: product.node.id,
                title: product.node.title,
                variants: product.node.variants
            }));

            if (data?.data?.products?.body?.data?.products?.pageInfo?.hasNextPage) {
                setLastCursor(data?.data?.products?.body?.data?.products?.pageInfo?.endCursor);
            } else {
                console.log("No more pages, setting lastCursor to null");
                setLastCursor(() => null);
            }

            const filterProducts = formattedProducts.map(product => ({
                ...product,
                variants: product.variants.edges.filter(variant => variant.node.title !== "Default Title")
            }));

            setFilteredProducts((prevProducts) => [...prevProducts, ...filterProducts]);

        } catch (error) {
            console.error("Error loading more products:", error);
        } finally {
            setTimeout(() => setLoading(false), 500); // Small delay to prevent rapid calls
        }
    };

    const handleSearch = async (value) => {
        setSearchValue(value);

        if (value === '') {
            try {
                setLoading(true);
                const data = await getRequest('/api/get-products')

                const formattedProducts = data?.data?.products?.body?.data?.products?.edges.map(product => ({
                    id: product.node.id,
                    title: product.node.title,
                    variants: product.node.variants
                }));

                if (data?.data?.products?.body?.data?.products?.pageInfo?.hasNextPage) {
                    setLastCursor(data?.data?.products?.body?.data?.products?.pageInfo?.endCursor);
                } else {
                    setLastCursor(null);
                }

                const filterProducts = formattedProducts.map(product => ({
                    ...product,
                    variants: product.variants.edges.filter(variant => variant.node.title !== "Default Title")
                }))

                setFilteredProducts(filterProducts);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }

        } else {
            try {
                const response = await searchProducts(value, 2500);
                console.log('Fetched products:', response);


                const productsData = response?.data || [];
                const temp = productsData.map(product => ({
                    id: product?.id,
                    title: product?.title
                }));

                setFilteredProducts(temp);
                setLastCursor(response?.data?.lastCursor || null);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }
    };

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                const data = await getRequest('/api/get-products')

                const formattedProducts = data?.data?.products?.body?.data?.products?.edges.map(product => ({
                    id: product.node.id,
                    title: product.node.title,
                    variants: product.node.variants
                }));


                if (data?.data?.products?.body?.data?.products?.pageInfo?.hasNextPage) {
                    setLastCursor(data?.data?.products?.body?.data?.products?.pageInfo?.endCursor);
                } else {
                    setLastCursor(null);
                }
                const filterProducts = formattedProducts.map(product => ({
                    ...product,
                    variants: product.variants.edges.filter(variant => variant.node.title !== "Default Title")
                }))
                setFilteredProducts(filterProducts);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getProducts();
    }, []);

    function renderItem(item) {
        const { id, title } = item;
        // console.log(item?.variants)
        return (
            <>
                {
                    item?.variants?.length > 0 ? item?.variants?.map((variant, i) =>
                        <Box
                            key={i}
                            borderColor="border"
                            borderBlockEndWidth="0165"
                        >
                            {
                                i === 0 &&
                                <Box
                                    borderColor="border"
                                    borderBlockEndWidth="0165"
                                >
                                    <ResourceItem
                                        id={id}
                                    >
                                        <Text variant="bodyMd" fontWeight="bold" as="h3">
                                            {title}
                                        </Text>
                                    </ResourceItem>
                                </Box>
                            }
                            <Box
                                paddingInlineStart={1000}
                            >
                                <ResourceItem
                                    id={variant?.node?.id}
                                >
                                    <Text variant="bodyMd" fontWeight="bold" as="h3">
                                        {variant?.node?.title}
                                    </Text>
                                </ResourceItem>
                            </Box>
                        </Box>
                    )
                        :
                        <ResourceItem
                            id={id}
                            key={id}
                        >
                            <Text variant="bodyMd" fontWeight="bold" as="h3">
                                {title}
                            </Text>
                        </ResourceItem>
                }

            </>

        );
    }

    const handleScroll = () => {
        if (lastCursor) {
            if (productList.current) {
                const { scrollTop, scrollHeight, clientHeight } = productList.current;

                if (scrollTop + clientHeight >= scrollHeight - 1) {
                    loadMoreProducts();
                }
            }
        }
    };

    return (
        <Box paddingInlineStart={400} paddingInlineEnd={400}>
            <Modal
                // activator={activator}
                open={active}
                onClose={toggleModal}
                title="Add Products"
                primaryAction={{
                    content: 'Add',
                    onAction: handleValueChange,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: toggleModal,
                    },
                ]}
            >
                <Modal.Section>
                    <Box >
                        <div ref={productList} style={{
                            height: "400px",
                            overflowY: "auto",
                            overflowX: "hidden",
                        }} onScroll={handleScroll} >
                            <Box>
                                <TextField
                                    placeholder="Search Products"
                                    autoComplete="off"
                                    prefix={<Icon source={SearchIcon} color="base" />}
                                    onChange={handleSearch}
                                    value={searchValue}
                                />
                            </Box>

                            <ResourceList
                                resourceName={resourceName}
                                items={filteredProducts || []}
                                renderItem={renderItem}
                                selectedItems={selectedItems}
                                onSelectionChange={(items) => {
                                    setSelectedItems(items);
                                }}
                                selectable
                                loading={loading}
                                emptyState={
                                    <EmptyState
                                        heading="No products found"
                                        action={null}
                                    >
                                        <p>Try changing your search term.</p>
                                    </EmptyState>
                                }
                            />

                        </div>
                    </Box>
                </Modal.Section>
            </Modal>
            <Box paddingBlockStart="200" paddingBlockEnd="200">
                <InlineStack align="space-between">
                    <ConditionCardTitle conditionKey={conditionKey} />
                    <Button variant="plain" onClick={removeCondition}>
                        <Text variant="bodySmall" as="small">remove</Text>
                    </Button>
                </InlineStack>
            </Box>

            <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }}>
                    <ConditionSelect
                        options={selectOptionsString}
                        onChange={handleOperatorChange}
                        value={condition?.action}
                    />
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 8, xl: 8 }}>
                    <Button fullWidth variant="primary" icon={PlusIcon} onClick={toggleModal}>Set Values</Button>
                </Grid.Cell>
            </Grid>

            <Box padding={"100"}>
                <InlineStack gap="400" blockAlign="center">

                    {
                        condition?.items?.length > 0 && condition?.items?.map((item, i) => (
                            <Box key={i}>
                                <Tag size='large' onRemove={() => {
                                    ShowSaveBar();
                                    const updatedCollections = selectedItems.filter((collection) => collection !== item);
                                    setSelectedItems(updatedCollections);

                                    setFormData((prevFormData) => {
                                        let updatedConditions = [...prevFormData.conditions];
                                        updatedConditions[conditionIndex][conditionKey][index].items = updatedCollections;

                                        return {
                                            ...prevFormData,
                                            conditions: updatedConditions
                                        };
                                    });

                                }}>
                                    {
                                        filteredProducts.find(p => p.id === item)?.title
                                        || filteredProducts.find(p => p?.variants?.find(v => v?.node?.id === item))?.variants?.find(v => v?.node?.id === item)?.node?.title

                                    }
                                </Tag>
                            </Box>
                        ))
                    }
                </InlineStack>
            </Box>
            <ConditionFooter conditionKey={conditionKey} />
        </Box>
    );
};

export default ProductCondition;
