import { Autocomplete, Box, Button, Grid, InlineStack, LegacyStack, Tag, Text } from "@shopify/polaris";
import ConditionCardTitle from "./ConditionCardTitle";
import ConditionFooter from "./ConditionFooter";
import ConditionSelect from "./ConditionSelect";
import ConditionTextField from "./ConditionTextField";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ShowSaveBar } from "../../../hooks/showSaveBar";
import { getRequest } from "../../../api";
import { data } from "react-router-dom";



const Country = ({ conditionKey, conditionIndex, index, setFormData, condition, options, }) => {
    const [selectedOptions, setSelectedOptions] = useState(condition?.items || []);
    const [inputValue, setInputValue] = useState('');
    const [countries, setCountries] = useState([])
    const [countryOptions, setCountryOptions] = useState([]);

    const handleLabelChange = (value) => {
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


    const handleValueChange = (options) => {
        ShowSaveBar();
        setSelectedOptions(options)

        setFormData((prevFormData) => {
            let updatedConditions = [...prevFormData.conditions];
            updatedConditions[conditionIndex][conditionKey][index].items = options;

            return {
                ...prevFormData,
                conditions: updatedConditions
            };
        });


    };



    const updateText = useCallback(
        (value) => {
            setInputValue(value);

            if (value === '') {
                setCountryOptions(countries);
                return;
            }
            const filterRegex = new RegExp(value, 'i');
            const resultOptions = countries.filter((option) =>
                option.label.match(filterRegex),
            );

            setCountryOptions(resultOptions);
        },
        [countries],
    );

    const removeTag = useCallback(
        (tag) => () => {
            ShowSaveBar();
            const options = [...selectedOptions];
            options.splice(options.indexOf(tag), 1);

            setSelectedOptions(options);

            setFormData((prevFormData) => {
                const updatedConditions = [...prevFormData.conditions[conditionKey]];
                updatedConditions[index] = {
                    ...updatedConditions[index],
                    items: options,
                };
                return {
                    ...prevFormData,
                    conditions: {
                        ...prevFormData.conditions,
                        [conditionKey]: updatedConditions,
                    }
                }
            })

        },
        [selectedOptions],
    );


    const verticalContentMarkup =
        selectedOptions.length > 0 ? (
            <InlineStack gap="100" blockAlign="center">
                {selectedOptions.map((option) => {
                    let tagLabel = '';
                    tagLabel = option.replace('_', ' ');
                    tagLabel = tagLabel;
                    return (
                        <Tag key={`option${option}`} onRemove={removeTag(option)}>
                            {
                                countries?.find((country) => country.value === option)?.label
                            }
                        </Tag>
                    );
                })}
            </InlineStack>
        ) : null;

    const textField = (
        <Autocomplete.TextField
            onChange={updateText}
            value={inputValue}
            placeholder="Search countries"
            verticalContent={verticalContentMarkup}
            autoComplete="off"
        />
    );


    useEffect(() => {

        if (
            conditionKey === 'shippingCountry'
        ) {
            setFormData((prevFormData) => {
                let updatedConditions = [...prevFormData.conditions];
                updatedConditions[conditionIndex][conditionKey][index].action = condition?.action || "If found";

                return {
                    ...prevFormData,
                    conditions: updatedConditions
                };
            });

            const getShippingCountries = async () => {
                try {
                    const data = await getRequest('/api/get-shipping-countries');
                    const shippingCountries = data?.shippingCountries?.body?.data?.shop?.shipsToCountries

                    const allCountry = await getRequest('https://restcountries.com/v3.1/all');
                    const countries = allCountry.map((country) => ({
                        value: country.cca2.toUpperCase(), // Country Code (US, CA)
                        label: country.name.common, // Country Name
                    }));
                    const availableCountries = countries?.filter((country) => shippingCountries.includes(country.value)).sort((a, b) => a.label.localeCompare(b.label));
                    setCountries(availableCountries);
                    setCountryOptions(availableCountries);
                } catch (error) {
                    console.error('Error fetching ShippingCountries:', error);
                }
            }
            getShippingCountries();
        }
        if (
            conditionKey === 'markets'
        ) {
            setFormData((prevFormData) => {
                let updatedConditions = [...prevFormData.conditions];
                updatedConditions[conditionIndex][conditionKey][index].action = condition?.action || "If found";

                return {
                    ...prevFormData,
                    conditions: updatedConditions
                };
            });
            const getMarketplaces = async () => {
                try {
                    const data = await getRequest('/api/markets');
                    const marketplaceOptions = data?.data?.map((market) => ({
                        value: market?.name,
                        label: market?.name
                    })) || [];
                    setCountries(marketplaceOptions);
                    setCountryOptions(marketplaceOptions);
                } catch (error) {
                    console.error('Error fetching marketplaces:', error);
                }
            }
            getMarketplaces();
        }
        if (
            conditionKey === 'deliveryTypes'
        ) {
            setFormData((prevFormData) => {
                let updatedConditions = [...prevFormData.conditions];
                updatedConditions[conditionIndex][conditionKey][index].action = condition?.action || "If found";

                return {
                    ...prevFormData,
                    conditions: updatedConditions
                };
            });
            const data = [
                {
                    value: "Shipping",
                    label: "Shipping"
                },
                {
                    value: "Local Pickup",
                    label: "Local Pickup"
                },
                {
                    value: "Local Delivery",
                    label: "Local Delivery"
                },
                {
                    value: "Shipping to a Pickup Point",
                    label: "Shipping to a Pickup Point"
                },
            ]
            setCountries(data);
            setCountryOptions(data);
        }

    }, [conditionKey])

    return (
        <Box paddingInlineStart={400} paddingInlineEnd={400}>
            <Box paddingBlockStart="200">
                <InlineStack gap="2" align="space-between">
                    <ConditionCardTitle conditionKey={conditionKey} />
                    <Button variant="plain" onClick={removeCondition}>
                        <Text variant="bodySmall" as="small">remove</Text>
                    </Button>
                </InlineStack>
            </Box>

            <Box paddingBlockStart="200">
                <Grid gap={500}>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }}>
                        <ConditionSelect
                            options={options}
                            onChange={handleLabelChange}
                            value={condition?.action}
                        />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 8, xl: 8 }}>
                        <Autocomplete
                            allowMultiple
                            options={countryOptions}
                            selected={selectedOptions}
                            textField={textField}
                            onSelect={handleValueChange}
                        />
                    </Grid.Cell>
                </Grid>
            </Box>
            <ConditionFooter conditionKey={conditionKey} />

            {renderConditionInfo(conditionKey)}
        </Box>
    );
};


const renderConditionInfo = (conditionKey) => {
    const conditionInfo = {
        productVariants: (
            <Box paddingBlockStart={200}>
                <InlineStack gap="200" wrap={false} align="start">
                    <Text as="span" variant="bodyXs">
                        Add the product variant ids like{' '}
                    </Text>
                    <Text as="span" variant="bodyXs" tone="magic-subdued">
                        4691853589,4691853590
                    </Text>
                </InlineStack>
            </Box>
        ),
        shippingCountry: (
            <Box paddingBlockStart={200}>
                <Text as="span" variant="bodyXs">
                    Shopify API validates the shipping country only after adding{' '}
                    <Text as="span" variant="bodyXs" tone="magic-subdued">
                        postal code
                    </Text>{' '}
                    and{' '}
                    <Text as="span" variant="bodyXs" tone="magic-subdued">
                        province name
                    </Text>{' '}
                    on the checkout page.
                </Text>
            </Box>
        ),
        provinceCodes: (
            <Box paddingBlockStart={200}>
                <Text as="span" variant="bodyXs">
                    Add 2 digit province/state code in{' '}
                    <Text as="span" variant="bodyXs" tone="magic-subdued">
                        3166-1 {' '}
                    </Text>
                    <Text as="span" variant="bodyXs" tone="magic-subdued">
                        alpha-2
                    </Text>{' '}
                    format. Example: Add OH for Ohio state.
                </Text>
            </Box>
        ),
    };

    return conditionInfo[conditionKey] || null;
};

export default Country;