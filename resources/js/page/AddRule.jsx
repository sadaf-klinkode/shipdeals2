import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../component/AppLayout";
import { Button, Card, Layout, Page, Text, BlockStack, Box, Checkbox, TextField, Popover, ActionList, Icon, InlineStack, ButtonGroup, KeyboardKey, Grid, Select, Tag, Form, FormLayout, Banner, RadioButton, Divider } from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import LogsCard from "../component/AddRule/LogsCard";
import SupportCard from "../component/AddRule/SupportCard";
import PlanAlert from "../component/AddRule/PlanAlert";
import HelpAlert from "../component/AddRule/HelpAlert";
import RulesBtn from "../component/AddRule/RulesBtn";
import { actionItems, advanceActionItems, customerIsCompanyOptions, selectOptionsLocalTime, selectOptionsNumber, selectOptionsString } from "../data";
import { getRequest, postRequest } from "../api";
import ProductCondition from "../component/AddRule/Condition/ProductCondition";
import Condition from "../component/AddRule/Condition/Condition";
import CollectionCondition from "../component/AddRule/Condition/CollectionCondition";
import DateSelect from "../component/AddRule/DateSelect";
import TimeSelect from "../component/AddRule/TimeSelect";
import { SaveBar } from "@shopify/app-bridge-react";
import { toast } from "sonner";
import Country from "../component/AddRule/Condition/Country";
import HoursCondition from "../component/AddRule/Condition/HoursCondition";
import WeekdayCondition from "../component/AddRule/Condition/WeekdayCondition";
import CartAttributeCondition from "../component/AddRule/Condition/CartAttributeCondition";
import SKU from "../component/AddRule/Condition/SKU";
import Always from "../component/AddRule/Condition/Always";
import ActionCondition from "../component/AddRule/Condition/ActionCondition";
import SpecificDatesCondition from "../component/AddRule/Condition/SpecificDatesCondition";

const AddRule = () => {
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState({});
    const errorRef = useRef(null);
    const [numberOfTime, setNumberOfTime] = useState(false);
    const [endDateSelected, setEndDateSelected] = useState(false);
    const [selectedDiscountTitle, setSelectedDiscountTitle] = useState('discountCode');
    const [showShippingMethods, setShowShippingMethods] = useState('All shipping methods');
    const [shippingMethodValue, setShippingMethodValue] = useState('');
    const [postResponse, setPostResponse] = useState({});
    const [errorMessage, setErrorMessage] = useState({});
    const [storeTimeZone, setStoreTimeZone] = useState({});
    const [formData, setFormData] = useState({});

    const conditionsList = routeId === 'discount' ? actionItems : advanceActionItems;
    // add condition
    const AddAndCondition = (key, index) => {
        ShowSaveBar();
        setFormData((prevFormData) => {
            const updatedConditions = [...prevFormData.conditions];
            // validation not duplication always
            if (updatedConditions[index]['always'] && key === 'always') {
                return {
                    ...prevFormData,
                    conditions: updatedConditions,
                };
            }
            if (updatedConditions[index][key]) {
                updatedConditions[index][key].push({
                    action: '',
                });
            } else {
                updatedConditions[index][key] = [{ action: '' }];
            }

            return {
                ...prevFormData,
                conditions: updatedConditions,
            };
        });

        setActive({})
    };

    const AddOrCondition = () => {
        ShowSaveBar();
        setFormData((prevFormData) => ({
            ...prevFormData,
            conditions: [
                ...prevFormData.conditions,
                {

                },
            ],
        }));
    };

    const removeOrCondition = (conditionIndex) => {
        ShowSaveBar();
        setFormData((prevFormData) => {
            let updatedConditions = [...prevFormData.conditions];
            updatedConditions.splice(conditionIndex, 1);
            return {
                ...prevFormData,
                conditions: updatedConditions
            };
        });
    }

    // handle discount title
    const handleDiscountTitle = (type) => {
        setSelectedDiscountTitle(type);
        ShowSaveBar();
        if (type === 'automaticDiscount') {
            setFormData((prevFormData) => {
                return {
                    ...prevFormData,
                    discountCode: '',
                    discountType: 'automaticDiscount',
                };
            })
        } else {
            setFormData((prevFormData) => {
                return {
                    ...prevFormData,
                    discountCode: '',
                    discountType: 'discountCode',
                };
            })
        }
    };

    // Generate a random discount code
    const generateRandomCode = () => {
        const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        ShowSaveBar();
        setFormData((formData) => {
            return {
                ...formData,
                discountCode: randomCode,
            };
        });
    };

    // shipping methods change
    const handleShippingMethods = (value) => {
        setShowShippingMethods(value);
        ShowSaveBar();
        setFormData((prevFormData) => {
            const updatedShippingMethods = {
                label: value
            }
            return {
                ...prevFormData,
                shippingMethods: updatedShippingMethods

            };
        });
    };

    // handle data changes in form
    const handleChange = useCallback((key) => {
        return (value) => {
            ShowSaveBar();
            setFormData((prevFormData) => {
                if (key === 'numberOfTime') {
                    const updatedDiscountUses = {
                        ...prevFormData.discountUses,
                        numberOfTime: value
                    }

                    return {
                        ...prevFormData,
                        discountUses: updatedDiscountUses,
                    };
                }
                if (key === 'oneUse') {
                    const updatedDiscountUses = {
                        ...prevFormData.discountUses,
                        oneUse: value
                    }

                    return {
                        ...prevFormData,
                        discountUses: updatedDiscountUses,
                    };
                }
                if (key === 'productDiscounts' ||
                    key === 'orderDiscounts' ||
                    key === 'shippingDiscounts'
                ) {
                    const updatedCombinations = {
                        ...prevFormData.combinations,
                        [key]: value
                    }

                    return {
                        ...prevFormData,
                        combinations: updatedCombinations,
                    };
                }
                if (
                    key === 'discountName' ||
                    key === 'discountMessage'
                ) {
                    return {
                        ...prevFormData,
                        [key]: value,
                    };
                }
                if (key === 'discountCode') {
                    return {
                        ...prevFormData,
                        [key]: value.toUpperCase(),
                    };
                }
            });
        };
    }, []);

    // shipping methods add
    const handleShippingMethodValue = useCallback(() => {
        if (shippingMethodValue.trim() !== '') {
            ShowSaveBar();
            setFormData((prevFormData) => {
                const previousValues = Array.isArray(prevFormData?.shippingMethods?.values)
                    ? prevFormData.shippingMethods.values
                    : [];

                const updatedShippingMethods = {
                    ...prevFormData.shippingMethods,
                    values: [...previousValues, shippingMethodValue.trim()],
                };
                return {
                    ...prevFormData,
                    shippingMethods: updatedShippingMethods,
                };
            });
            setShippingMethodValue('');
        }
    }, [shippingMethodValue]);

    const scrollToError = () => {
        setTimeout(() => {
            errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
    };

    // form submit
    const submitForm = async () => {
        setLoading(true);
        setErrorMessage({});



        if ((!formData?.discountCode && formData?.discountType === 'discountCode') || !formData?.discountName) {
            if (!formData?.discountName) {
                setErrorMessage({ discountName: 'Discount name is required' });

                scrollToError();
            }
            if (!formData?.discountCode && formData?.discountType === 'discountCode') {
                setErrorMessage((prevErrorMessage) => {
                    return {
                        ...prevErrorMessage,
                        discountCode: 'Discount code is required'
                    }
                })
                scrollToError();
            }
            setLoading(false);
            return
        }
        const toastId = toast.loading("Saving...");
        try {
            setPostResponse({})
            const data = await postRequest('/api/add-rules/cart', formData);
            // console.log(data);
            const postResponseCode = data?.discount?.body?.data?.discountCodeAppCreate
            const postResponseAutomatic = data?.discount?.body?.data?.discountAutomaticAppCreate;
            if (postResponseCode?.userErrors?.length > 0) {
                setPostResponse({ message: `${postResponseCode?.userErrors[0]?.field[1]} : ${postResponseCode?.userErrors[0]?.message}` });
                scrollToError();
                toast.dismiss(toastId);
            }
            if (postResponseAutomatic?.userErrors?.length > 0) {
                setPostResponse({ message: `${postResponseAutomatic?.userErrors[0]?.field[1]} : ${postResponseAutomatic?.userErrors[0]?.message}` });
                scrollToError();
                toast.dismiss(toastId);
            }
            if (postResponseAutomatic?.automaticAppDiscount?.discountId) {


                toast.success("Saved", {
                    style: {
                        color: 'green',
                    },
                    id: toastId
                });
                handleDiscard();
            }
            if (postResponseCode?.codeAppDiscount?.appDiscountType?.functionId) {

                toast.success("Saved", {
                    style: {
                        color: 'green',
                    },
                    id: toastId
                });
                handleDiscard();
            }

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong", {
                style: {
                    color: 'red',
                },
                id: toastId
            });
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    // initial form data
    useEffect(() => {
        const initialStartDate = formatDate(new Date());


        setFormData({
            routeId,
            discountName: '',
            discountType: 'discountCode',
            discountCode: '',
            shopTimeZone: storeTimeZone?.timeZone,
            shippingMethods: {
                label: 'All shipping methods'
            },
            discountUses: {
                numberOfTime: null,
                oneUse: false
            },
            combinations: {
                productDiscounts: false,
                orderDiscounts: false
            },
            activeDate: {
                startDate: initialStartDate,
                startTime: "12:00"
            },
            discountMessage: '',
            conditions: [{}],
            discount_type: 'percentage',
            discountAmount: 0,
        });


        setSelectedDiscountTitle('discountCode')
    }, [storeTimeZone]);

    const ShowSaveBar = () => {
        shopify.saveBar.show('my-save-bar');
    }
    const handleDiscard = () => {
        shopify.saveBar.hide('my-save-bar');
        navigate('/');
    };

    useEffect(() => {
        const getShopTimeZone = async () => {
            try {
                const data = await getRequest('/api/get-shop-timezone');

                const formatter = new Intl.DateTimeFormat('en-US', {
                    timeZone: data?.shop?.body?.data?.shop?.ianaTimezone,
                    timeZoneName: "short"
                });
                const estTimezone = formatter.formatToParts(new Date()).find(part => part.type === "timeZoneName")?.value;
                setStoreTimeZone(
                    {
                        timeZoneFormat: estTimezone,
                        timeZone: data?.shop?.body?.data?.shop?.ianaTimezone
                    }
                );
            } catch (error) {
                console.error(error);
            }
        }
        getShopTimeZone();
    }, []);


    console.log(formData?.conditions);

    return (
        <AppLayout>
            <Page
                title="Add rule"
                backAction={{
                    content: 'Back',
                    onAction: () => handleDiscard(),
                }}
            >
                <SaveBar id="my-save-bar">
                    <button variant="primary" onClick={submitForm}></button>
                    <button onClick={handleDiscard}></button>
                </SaveBar>
                <Layout>
                    <Layout.Section>
                        <BlockStack gap={500}>

                            {
                                postResponse?.message &&
                                <Box ref={errorRef}>
                                    <Banner
                                        title={postResponse?.message}
                                        onDismiss={() => setPostResponse({})}
                                        tone="critical"
                                    >
                                    </Banner>
                                </Box>

                            }


                            <Button onClick={AddOrCondition} icon={PlusIcon}>
                                Add Or condition change
                            </Button>

                            {
                                formData?.conditions?.map((conditions, conditionIndex) => (
                                    <Card key={conditionIndex} roundedAbove="sm" padding={'0'}>
                                        <Box paddingBlockStart="500" paddingBlockEnd="500">
                                            <Box paddingInlineStart={400} paddingInlineEnd={400}>
                                                <InlineStack gap="2" align="space-between">
                                                    <Text as="h2" variant="headingSm">
                                                        Conditions {conditionIndex + 1}
                                                    </Text>
                                                    <Button variant="plain" onClick={() => removeOrCondition(conditionIndex)}>
                                                        <Text variant="bodySmall" as="small">remove</Text>
                                                    </Button>
                                                </InlineStack>
                                            </Box>
                                            <Box paddingInlineStart={400} paddingInlineEnd={400} paddingBlockStart={200}>
                                                <Popover
                                                    active={active?.['active' + conditionIndex]}
                                                    activator={
                                                        <Box width="100%">
                                                            <Button onClick={() => setActive((previous) => {
                                                                return {
                                                                    ['active' + conditionIndex]: true
                                                                }
                                                            })} icon={PlusIcon}>Add And condition</Button>
                                                        </Box>
                                                    }
                                                    autofocusTarget={'first-node'}
                                                    onClose={() => setActive({})}
                                                    preferredAlignment="left"
                                                    fullWidth
                                                >
                                                    <ActionList
                                                        actionRole="menuitem"
                                                        sections={
                                                            conditionsList?.map((item, index) => ({
                                                                title: item.title,
                                                                items: [
                                                                    ...item.items.map(({ icon, key, title, description }) => ({
                                                                        content: (
                                                                            <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                                                <Box paddingInlineEnd={200} >
                                                                                    <Icon source={icon} />
                                                                                </Box>
                                                                                <Box>
                                                                                    <Text variant="bodyMd" as="div">
                                                                                        {title}
                                                                                    </Text>
                                                                                    <Text variant="bodySm" as="span" color="subdued">
                                                                                        {description}
                                                                                    </Text>
                                                                                </Box>
                                                                            </Box>
                                                                        ),
                                                                        role: 'menuitem',
                                                                        onAction: () => {
                                                                            AddAndCondition(key, conditionIndex);
                                                                        }
                                                                    }))
                                                                ]
                                                            }))
                                                        }
                                                    />
                                                </Popover>
                                            </Box>

                                            {
                                                conditions?.always?.map((condition, index) => (
                                                    <Box key={index}>
                                                        <Box paddingBlockStart="400" paddingBlockEnd={400}>
                                                            <Divider width="full" />
                                                        </Box>
                                                        <Always conditionIndex={conditionIndex} condition={condition} conditionKey={'always'} index={index} setFormData={setFormData}
                                                        />
                                                    </Box>
                                                ))
                                            }

                                            {
                                                conditions?.specificDates?.map((condition, index) => (
                                                    <Box key={index}>
                                                        <Box paddingBlockStart="400" paddingBlockEnd={400}>
                                                            <Divider width="full" />
                                                        </Box>
                                                        <SpecificDatesCondition conditionIndex={conditionIndex} condition={condition} conditionKey={'specificDates'} index={index} setFormData={setFormData} options={selectOptionsString} shopTimeZone={storeTimeZone?.timeZone}
                                                        />
                                                    </Box>
                                                ))
                                            }

                                            {
                                                conditions?.cartAttribute?.map((condition, index) => (
                                                    <Box key={index}>
                                                        <Box paddingBlockStart="400" paddingBlockEnd={400}>
                                                            <Divider width="full" />
                                                        </Box>
                                                        <CartAttributeCondition conditionIndex={conditionIndex} condition={condition} conditionKey={'cartAttribute'} index={index} setFormData={setFormData}
                                                            options={selectOptionsString}
                                                        />
                                                    </Box>

                                                ))
                                            }

                                            {
                                                [
                                                    { key: 'sku', options: selectOptionsString },
                                                    { key: 'shippingMethod', options: selectOptionsString },
                                                    { key: 'selectedShippingMethod', options: selectOptionsString },
                                                ].map(({ key, options, placeholder }) => (
                                                    conditions?.[key]?.map((condition, index) => (
                                                        <Box key={`${key}-${index}`}>
                                                            <Box paddingBlockStart="200" paddingBlockEnd="200">
                                                                <Divider width="full" />
                                                            </Box>

                                                            <SKU
                                                                conditionIndex={conditionIndex}
                                                                condition={condition}
                                                                conditionKey={key}
                                                                index={index}
                                                                setFormData={setFormData}
                                                                options={options}
                                                                placeholder={placeholder || undefined}
                                                            />
                                                        </Box>
                                                    ))
                                                ))
                                            }

                                            {
                                                conditions?.products?.map((condition, index) => (
                                                    <Box key={index}>
                                                        <Box paddingBlockStart="400" paddingBlockEnd={400}>
                                                            <Divider width="full" />
                                                        </Box>
                                                        <ProductCondition conditionIndex={conditionIndex} condition={condition} conditionKey={'products'} index={index} setFormData={setFormData}
                                                        />
                                                    </Box>

                                                ))
                                            }

                                            {
                                                conditions?.collections?.map((condition, index) => (
                                                    <Box key={index}>
                                                        <Box paddingBlockStart="400" paddingBlockEnd={400}>
                                                            <Divider width="full" />
                                                        </Box>
                                                        <CollectionCondition conditionIndex={conditionIndex} condition={condition} conditionKey={'collections'} index={index} formData={formData} setFormData={setFormData} title={'Collections'} footerText={'Change payment options based on products from any of the selected collections above.'}
                                                            options={selectOptionsString}
                                                        />
                                                    </Box>

                                                ))
                                            }

                                            {
                                                [
                                                    { key: 'customerIsCompany', options: customerIsCompanyOptions },
                                                    { key: 'subscriptionProducts', options: selectOptionsString },
                                                    { key: 'customerLogin', options: selectOptionsString },
                                                    { key: 'freeShippingMethod', options: selectOptionsString },
                                                    { key: 'pobox', options: selectOptionsString },
                                                ].map(({ key, options, placeholder }) => (
                                                    conditions?.[key]?.map((condition, index) => (
                                                        <Box key={`${key}-${index}`}>
                                                            <Box paddingBlockStart="200" paddingBlockEnd="200">
                                                                <Divider width="full" />
                                                            </Box>

                                                            <ActionCondition
                                                                conditionIndex={conditionIndex}
                                                                condition={condition}
                                                                conditionKey={key}
                                                                index={index}
                                                                setFormData={setFormData}
                                                                options={options}
                                                                placeholder={placeholder || undefined}
                                                            />
                                                        </Box>
                                                    ))
                                                ))
                                            }

                                            {[
                                                'shippingCountry', 'markets',
                                                'deliveryTypes'
                                            ].map((conditionKey) => (
                                                conditions?.[conditionKey]?.map((condition, index) => (
                                                    <Box key={`${conditionKey}-${index}`}>
                                                        <Box paddingBlockStart="400" paddingBlockEnd={400}>
                                                            <Divider width="full" />
                                                        </Box>
                                                        <Country conditionIndex={conditionIndex} condition={condition} conditionKey={conditionKey} index={index} setFormData={setFormData} options={selectOptionsString} />
                                                    </Box>
                                                ))
                                            ))}
                                            {
                                                [
                                                    { key: 'cartTotal', options: selectOptionsNumber },
                                                    { key: 'cartSubtotal', options: selectOptionsNumber },
                                                    { key: 'specificItemsTotal', options: selectOptionsNumber },
                                                    { key: 'totalOrderWeight', options: selectOptionsNumber },
                                                    { key: 'specificItemsWeight', options: selectOptionsNumber },
                                                    { key: 'totalQuantity', options: selectOptionsNumber },
                                                    { key: 'singleProductQuantity', options: selectOptionsNumber },
                                                    { key: 'singleVariantQuantity', options: selectOptionsNumber },
                                                    { key: 'specificItemsQuantity', options: selectOptionsNumber },
                                                    { key: 'productTags', options: selectOptionsString, placeholder: 'Separate by commas (limit 10)' },
                                                    { key: 'cartCurrency', options: selectOptionsString, placeholder: 'Separate by commas (limit 10)' },
                                                    { key: 'discountAmount', options: selectOptionsNumber },
                                                    { key: 'customerTags', options: selectOptionsString, placeholder: 'Separate by commas (limit 10)' },
                                                    { key: 'customerTotalSpent', options: selectOptionsNumber },
                                                    { key: 'companyNames', options: selectOptionsString, placeholder: 'Separate by commas (limit 10)' },
                                                    { key: 'address', options: selectOptionsString, placeholder: 'Enter the phrase / part of the address' },
                                                    { key: 'provinceCodes', options: selectOptionsString },
                                                    { key: 'city', options: selectOptionsString },
                                                    { key: 'zipPostalCodes', options: selectOptionsString, placeholder: 'Separate by commas (limit 30)' }
                                                ].map(({ key, options, placeholder }) => (
                                                    conditions?.[key]?.map((condition, index) => (
                                                        <Box key={`${key}-${index}`}>
                                                            <Box paddingBlockStart="200" paddingBlockEnd="200">
                                                                <Divider width="full" />
                                                            </Box>

                                                            <Condition
                                                                conditionIndex={conditionIndex}
                                                                condition={condition}
                                                                conditionKey={key}
                                                                index={index}
                                                                setFormData={setFormData}
                                                                options={options}
                                                                placeholder={placeholder || undefined}
                                                            />
                                                        </Box>
                                                    ))
                                                ))
                                            }
                                            {
                                                conditions?.hours?.map((condition, index) => (
                                                    <Box key={index}>
                                                        <Box paddingBlockStart="400" paddingBlockEnd={400}>
                                                            <Divider width="full" />
                                                        </Box>
                                                        <HoursCondition conditionIndex={conditionIndex} condition={condition} conditionKey={'hours'} index={index} setFormData={setFormData} options={selectOptionsLocalTime} shopTimeZone={storeTimeZone?.timeZone}
                                                        />
                                                    </Box>

                                                ))
                                            }
                                            {
                                                conditions?.weekday?.map((condition, index) => (
                                                    <Box key={index}>
                                                        <Box paddingBlockStart="400" paddingBlockEnd={400}>
                                                            <Divider width="full" />
                                                        </Box>
                                                        <WeekdayCondition conditionIndex={conditionIndex} condition={condition} conditionKey={'weekday'} index={index} setFormData={setFormData} options={selectOptionsLocalTime} shopTimeZone={storeTimeZone?.timeZone}
                                                        />
                                                    </Box>

                                                ))
                                            }
                                        </Box>

                                    </Card>
                                ))
                            }


                            {/* Shipping discount name */}
                            <Card roundedAbove="sm">
                                <Box paddingBlockStart="200">
                                    <TextField
                                        label="Shipping discount name"
                                        requiredIndicator
                                        maxLength={64}
                                        showCharacterCount
                                        value={formData?.discountName}
                                        autoComplete="off"
                                        placeholder="New shipping discount"
                                        onChange={handleChange('discountName')}
                                    />
                                    {
                                        errorMessage?.discountName &&
                                        <Box paddingBlockStart="200" ref={errorRef}>
                                            <Text as="p" variant="bodySm" tone="critical">
                                                {errorMessage?.discountName}
                                            </Text>
                                        </Box>
                                    }

                                    <Box paddingBlockStart="200">
                                        <Text as="p" variant="bodySm" tone="subdued">
                                            Used only for configuration purposes as a reference and not visible to customers.
                                        </Text>
                                    </Box>
                                </Box>
                            </Card>

                            {/* Shipping Method */}
                            <Card roundedAbove="sm">
                                <Text as="h2" variant="headingSm">
                                    Shipping Method
                                </Text>
                                <Box paddingBlockStart="500" paddingBlockEnd={'500'}>
                                    <ButtonGroup variant="segmented">
                                        <Button
                                            pressed={selectedDiscountTitle === 'discountCode'}
                                            onClick={() => handleDiscountTitle('discountCode')}
                                        >
                                            Discount code
                                        </Button>
                                        <Button
                                            pressed={selectedDiscountTitle === 'automaticDiscount'}
                                            onClick={() => handleDiscountTitle('automaticDiscount')}
                                        >
                                            Automatic discount
                                        </Button>
                                    </ButtonGroup>
                                </Box>

                                {
                                    selectedDiscountTitle === 'discountCode' ?
                                        <Box>
                                            <Box paddingBlockStart="200">
                                                <InlineStack gap="2" align="space-between">
                                                    <Text variant="bodyMd" as="label">
                                                        Discount code
                                                    </Text>
                                                    <Button variant="plain" onClick={generateRandomCode}>
                                                        <Text variant="bodySm" as="span">Generate random code</Text>
                                                    </Button>
                                                </InlineStack>
                                            </Box>

                                            <Box paddingBlockStart="100">
                                                <TextField
                                                    value={formData?.discountCode}
                                                    autoComplete="off"
                                                    onChange={handleChange('discountCode')}
                                                />

                                                {
                                                    errorMessage?.discountCode &&
                                                    <Box paddingBlockStart="200" ref={errorRef}>
                                                        <Text as="p" variant="bodySm" tone="critical">
                                                            {errorMessage?.discountCode}
                                                        </Text>
                                                    </Box>
                                                }


                                                <Text as="p" variant="bodySm" tone="subdued">
                                                    Customers must enter this code at checkout.
                                                </Text>
                                            </Box>
                                        </Box>
                                        : null
                                }

                            </Card>


                            {/* Discount Type */}
                            <Card roundedAbove="sm">
                                <Box paddingBlockEnd={200}>
                                    <Text variant="headingMd" as="h6">
                                        Discount Type
                                    </Text>
                                </Box>
                                <Grid gap={500}>
                                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }}>
                                        <Select
                                            options={[
                                                { label: 'Percentage', value: 'percentage' },
                                                { label: 'Fixed Amount', value: 'fixedAmount' },
                                                { label: 'Flat rate', value: 'customShippingRate' },
                                            ]}
                                            selected={formData?.discount_type}
                                            onChange={(value) => {
                                                setFormData({ ...formData, discount_type: value });
                                            }}
                                            value={formData?.discount_type}
                                        />
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 8, xl: 8 }}>
                                        <TextField
                                            type="number"
                                            value={formData?.discountAmount}
                                            onChange={(value) => {
                                                setFormData({ ...formData, discountAmount: value });
                                            }}
                                        // suffix={formData?.discount_type === 'percentage' ? '%' : 'USD'}
                                        />


                                        {
                                            formData?.discount_type === 'customShippingRate' && (
                                                <Box paddingBlockStart="200">
                                                    <Text as="p" variant="bodySm" tone="subdued">
                                                        Always lower than the actual shipping cost.
                                                    </Text>
                                                </Box>
                                            )
                                        }

                                    </Grid.Cell>
                                </Grid>
                            </Card>

                            {/* Applied discount message */}
                            <Card roundedAbove="sm">
                                <Box paddingBlockStart="200">
                                    <TextField
                                        label="Applied discount message"
                                        value={formData?.discountMessage}
                                        autoComplete="off"
                                        onChange={handleChange('discountMessage')}
                                    />
                                    <Text as="p" variant="bodySm" tone="subdued">
                                        Enter the informational text which will be displayed at the checkout once the discount is successfully applied.
                                    </Text>
                                </Box>
                            </Card>

                            {/* Applies discount to Shipping methods */}
                            <Card roundedAbove="sm">
                                <Text as="h2" variant="headingSm">
                                    Applies discount to Shipping methods
                                </Text>
                                <Box paddingBlockStart="500">

                                    <Box paddingBlockEnd="500" paddingBlockStart="500">
                                        <Select
                                            options={[
                                                { label: 'All shipping methods', value: 'All shipping methods', },
                                                { label: 'Contains', value: 'Contains' },
                                                { label: 'Is exactly', value: 'Is exactly' },
                                                { label: 'Does not contain', value: 'Does not contain' }
                                            ]}
                                            onChange={handleShippingMethods}
                                            value={formData?.shippingMethods?.label}
                                        />
                                    </Box>
                                    {
                                        !(showShippingMethods === 'All shipping methods') &&
                                        <Box>
                                            <Form onSubmit={handleShippingMethodValue}>
                                                <FormLayout>
                                                    <TextField
                                                        value={shippingMethodValue}
                                                        autoComplete="off"
                                                        placeholder="Example: International Shipping"
                                                        onChange={(value) => setShippingMethodValue(value)}

                                                    />
                                                </FormLayout>
                                            </Form>
                                            <Box paddingBlockStart={500}>
                                                <InlineStack gap="400" blockAlign="center">
                                                    {
                                                        formData?.shippingMethods?.values?.length > 0 && formData?.shippingMethods?.values?.map((item, i) => (
                                                            <Box key={i}>
                                                                <Tag size='large' onRemove={() => {
                                                                    setFormData((prevFormData) => {
                                                                        const updatedValues = formData?.shippingMethods?.values?.filter((value) => value !== item);
                                                                        return {
                                                                            ...prevFormData,
                                                                            shippingMethods: {
                                                                                ...prevFormData.shippingMethods,
                                                                                values: updatedValues
                                                                            },
                                                                        };
                                                                    })
                                                                }}>{item}</Tag>
                                                            </Box>
                                                        ))
                                                    }
                                                </InlineStack>
                                            </Box>

                                            <Box paddingBlockStart="100">
                                                <Text as="p" variant="bodySm" tone="subdued">
                                                    Shipping method name. Press  <KeyboardKey size="small">Enter</KeyboardKey> to add, allow multiple values.
                                                </Text>
                                            </Box>
                                        </Box>
                                    }


                                </Box>
                            </Card>

                            {/* Maximum discount uses */}
                            {
                                selectedDiscountTitle === 'discountCode' &&

                                <Card roundedAbove="sm">
                                    <Text as="h2" variant="headingSm">
                                        Maximum discount uses
                                    </Text>
                                    <Box paddingBlockStart="500">
                                        <BlockStack gap="200">
                                            <Checkbox
                                                label="Limit number of times this discount can be used in total"
                                                checked={numberOfTime}
                                                onChange={() => {
                                                    setNumberOfTime(!numberOfTime)
                                                    setFormData((prevFormData) => {
                                                        const updatedDiscountUses = {
                                                            ...prevFormData.discountUses,
                                                            numberOfTime: null
                                                        }

                                                        return {
                                                            ...prevFormData,
                                                            discountUses: updatedDiscountUses,
                                                        };
                                                    })
                                                }}
                                            />
                                            {
                                                numberOfTime &&
                                                <Box paddingInlineStart={"800"}>
                                                    <Grid gap={500}>
                                                        <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}>
                                                            <TextField
                                                                value={formData?.discountUses?.numberOfTime ?? ""}
                                                                autoComplete="off"
                                                                type="number"
                                                                onChange={handleChange('numberOfTime')}
                                                            />
                                                        </Grid.Cell>
                                                    </Grid>

                                                </Box>
                                            }


                                            <Checkbox
                                                label="Limit to one use per customer"
                                                checked={formData?.discountUses?.oneUse}
                                                onChange={handleChange('oneUse')}
                                            />
                                        </BlockStack>
                                    </Box>
                                </Card>
                            }

                            {/* Combinations*/}
                            <Card roundedAbove="sm">
                                <Text as="h2" variant="headingSm">
                                    Combinations
                                </Text>
                                <Box paddingBlockStart="500">
                                    <Box paddingBlockEnd="100" paddingBlockStart="100">
                                        <Text variant="bodyMd" as="label">
                                            This discount discount can be combined with:
                                        </Text>
                                    </Box>
                                    <BlockStack gap="200">
                                        <Checkbox
                                            label="Product discounts"
                                            checked={formData?.combinations?.productDiscounts}
                                            onChange={handleChange('productDiscounts')}
                                        />
                                        <Checkbox
                                            label="Order discounts"
                                            checked={formData?.combinations?.orderDiscounts}
                                            onChange={handleChange('orderDiscounts')}
                                        />
                                    </BlockStack>
                                </Box>
                            </Card>

                            {/* Active dates*/}
                            <Card roundedAbove="sm">
                                <Text as="h2" variant="headingSm">
                                    Active dates
                                </Text>
                                <Box paddingBlockStart="500">
                                    <BlockStack gap="200">
                                        <Grid gap={500}>
                                            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                                <DateSelect setFormData={setFormData} updateField={'startDate'} formDate={formData?.activeDate?.startDate} label={'Start date'} />
                                            </Grid.Cell>
                                            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                                <TimeSelect setFormData={setFormData} updateField={'startTime'} formTime={formData?.activeDate?.startTime} label={'Start time ' + storeTimeZone?.timeZoneFormat} />
                                            </Grid.Cell>
                                        </Grid>
                                    </BlockStack>
                                </Box>
                                <Box paddingBlockStart="500">
                                    <Checkbox
                                        label="Set end date"
                                        checked={endDateSelected}
                                        onChange={() => {
                                            setEndDateSelected(!endDateSelected)
                                            setFormData((prevFormData) => {
                                                const updatedActiveDate = {
                                                    startDate: prevFormData?.activeDate?.startDate,
                                                    startTime: prevFormData?.activeDate?.startTime,
                                                }

                                                return {
                                                    ...prevFormData,
                                                    activeDate: updatedActiveDate,
                                                };
                                            })
                                        }}
                                    />
                                </Box>
                                {
                                    endDateSelected &&
                                    <Box paddingBlockStart="500">
                                        <BlockStack gap="200">
                                            <Grid gap={500}>
                                                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                                    <DateSelect setFormData={setFormData} updateField={'endDate'} formDate={formData?.activeDate?.endDate} label={'End date'} />
                                                </Grid.Cell>
                                                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                                    <TimeSelect setFormData={setFormData} updateField={'endTime'} formTime={formData?.activeDate?.endTime} label={'End time ' + storeTimeZone?.timeZoneFormat} />
                                                </Grid.Cell>
                                            </Grid>
                                        </BlockStack>
                                    </Box>
                                }

                            </Card>

                            <RulesBtn submitForm={submitForm} loading={loading} />
                            <HelpAlert />

                        </BlockStack >
                    </Layout.Section>

                    {/* Right side */}
                    <Layout.Section variant="oneThird">
                        <BlockStack gap={500}>

                            <PlanAlert />
                            <SupportCard />
                            <LogsCard />

                        </BlockStack>
                    </Layout.Section>
                </Layout>
            </Page>
        </AppLayout>
    );
};
export default AddRule