import { Avatar, BlockStack, Box, Icon, InlineStack, Modal, Pagination, ResourceItem, ResourceList, Text, TextField } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { useState } from "react";


const ConditionModal = ({ activeModal = false, handleChangeModal }) => {

    const [selectedItems, setSelectedItems] = useState([]);

    const resourceName = {
        singular: 'customer',
        plural: 'customers',
    };

    const items = [
        {
            id: '101',
            url: '#',
            name: 'Mae Jemison',
            location: 'Decatur, USA',
        },
        {
            id: '201',
            url: '#',
            name: 'Ellen Ochoa',
            location: 'Los Angeles, USA',
        },
    ];
    return (
        <Modal
            open={activeModal}
            onClose={handleChangeModal}
            title="Add product"
            primaryAction={{
                content: 'Add',
                onAction: handleChangeModal,
            }}
            secondaryActions={[
                {
                    content: 'Close',
                    onAction: handleChangeModal,
                },
            ]}
        >
            <Modal.Section>

                <Box minHeight='400px'>
                    <BlockStack align="space-between" >
                        <Box>
                            <TextField
                                // label="Shipping zone name"
                                // value={textFieldValue}
                                // onChange={handleTextFieldChange}
                                placeholder="Search Products"
                                autoComplete="off"
                                // requiredIndicator
                                prefix={<Icon source={SearchIcon} color="base" />}
                            />

                            <ResourceList
                                resourceName={resourceName}
                                items={items}
                                renderItem={renderItem}
                                selectedItems={selectedItems}
                                onSelectionChange={setSelectedItems}
                                selectable
                            />
                        </Box>
                        <Pagination
                            onPrevious={() => {
                                console.log('Previous');
                            }}
                            hasPrevious
                            onNext={() => {
                                console.log('Next');
                            }}
                            type="table"
                            hasNext
                            label="1-50 of 8,450 orders"
                        />
                    </BlockStack >
                </Box>
            </Modal.Section>
        </Modal>
    );
};

function renderItem(item) {
    const { id, url, name, location } = item;
    const media = <Avatar customer size="md" name={name} />;

    return (
        <ResourceItem
            id={id}
            url={url}
            media={media}
            accessibilityLabel={`View details for ${name}`}
        >
            <Text variant="bodyMd" fontWeight="bold" as="h3">
                {name}
            </Text>
            <div>{location}</div>
        </ResourceItem>
    );
}

export default ConditionModal
