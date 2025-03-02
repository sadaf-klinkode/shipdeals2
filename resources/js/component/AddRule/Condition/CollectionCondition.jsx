import React, { useCallback, useState, useEffect } from "react";
import {
    Box, TextField, FormLayout, Grid, InlineStack, Link, Select, Button, Modal, Icon, LegacyCard,
    ResourceList,
    Avatar,
    ResourceItem,
    Text,
    Pagination,
    Tag,
    BlockStack,
    Card,
    Checkbox,
    EmptyState
} from "@shopify/polaris";
import { getRequest } from "../../../api";
import { ShowSaveBar } from "../../../hooks/showSaveBar";
import { PlusIcon } from "@shopify/polaris-icons";


const CollectionCondition = ({ conditionKey, conditionIndex, index, setFormData, title, footerText, condition, options }) => {

    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState(condition?.items || []);
    const [active, setActive] = useState(false);

    const [lastCursor, setLastCursor] = useState(null);
    const [collections, setCollections] = useState([]);
    const [filteredCollections, setFilteredCollections] = useState([]);

    const toggleModal = useCallback(() => setActive((active) => !active), []);

    const resourceName = {
        singular: 'collection',
        plural: 'collections',
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


    const handleOperatorChange = (value) => {
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


    useEffect(() => {

        if (conditionKey === "collections") {
            setFormData((prevFormData) => {
                let updatedConditions = [...prevFormData.conditions];
                updatedConditions[conditionIndex][conditionKey][index].action = condition?.action || "If found";

                return {
                    ...prevFormData,
                    conditions: updatedConditions
                };
            });
        }

        const getCollections = async () => {
            try {
                setLoading(true);
                const data = await getRequest('/api/collections');
                // console.log(data)
                const filteredCollectionData = data?.collectionsData?.map((item) => {
                    return {
                        id: item.id,
                        label: item.title,
                    };
                })
                setLastCursor(data?.lastCollectionCursor);
                setFilteredCollections(filteredCollectionData);
                setCollections(filteredCollectionData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getCollections();

    }, [conditionKey])


    function renderItem(item) {
        const { id, label } = item;
        return (
            <ResourceItem
                id={id}
                key={id}
            >
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                    {label}
                </Text>
            </ResourceItem>
        );
    }


    return (
        <Box paddingInlineStart={400} paddingInlineEnd={400}>


            <Modal
                // activator={activator}
                open={active}
                onClose={toggleModal}
                title="Add Collections"
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
                        <div
                            // ref={productList} 
                            style={{
                                height: "400px",
                                overflowY: "auto",
                                overflowX: "hidden",
                            }}
                        // onScroll={handleScroll}
                        >
                            {/* <Box>
                                <TextField
                                    placeholder="Search Products"
                                    autoComplete="off"
                                    prefix={<Icon source={SearchIcon} color="base" />}
                                    onChange={handleSearch}
                                    value={searchValue}
                                />
                            </Box> */}

                            <ResourceList
                                resourceName={resourceName}
                                items={filteredCollections}
                                renderItem={renderItem}
                                selectedItems={selectedItems}
                                onSelectionChange={setSelectedItems}
                                selectable
                                loading={loading}
                                emptyState={
                                    <EmptyState
                                        heading="No products found"
                                        action={null}
                                    // image="https://cdn.shopify.com/s/files/1/0752/3035/6990/files/empty-state.svg"
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
                    <Text variant="bodyMd" as="label">{title}</Text>
                    <Button variant="plain" onClick={removeCondition}>
                        <Text variant="bodySmall" as="small">remove</Text>
                    </Button>
                </InlineStack>
            </Box>

            <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }}>
                    <Select
                        options={options}
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
                                    const updatedCollections = selectedItems?.filter((collection) => collection !== item);
                                    setSelectedItems(updatedCollections);
                                    ShowSaveBar();

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
                                        collections?.find(p => p.id === item)?.label
                                        || null

                                    }
                                </Tag>
                            </Box>
                        ))
                    }
                </InlineStack>
            </Box>
            <Text variant="bodySmall" as="small" tone="subdued">{footerText}</Text>
        </Box>
    )
};

export default CollectionCondition;