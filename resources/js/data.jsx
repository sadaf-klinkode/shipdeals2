import { AppsFilledIcon, CalculatorIcon, CartIcon, CashDollarIcon, CreditCardPercentIcon, DeliveryFilledIcon, GlobeIcon, HomeFilledIcon, ListBulletedIcon, LocationFilledIcon, MarketsFilledIcon, PersonIcon, ProductFilledIcon, ProductIcon, ProductListIcon, ReferralCodeIcon, SandboxIcon, WorkIcon, CheckCircleIcon, ClockIcon, CalendarIcon, MeasurementWeightIcon, EditIcon, MeasurementVolumeIcon, ArrowsOutHorizontalIcon, TextGrammarIcon, InfoIcon, MoneyIcon, ListNumberedIcon, LocationIcon, DeliveryIcon } from "@shopify/polaris-icons";

export const recommendationsData = [
    {
        image: 'asset/images/rules/PayRulesAppBanner.webp',
        heading: 'PayRules: Hide payment methods',
        paragraph: 'Hide Cash on Delivery, PayPal Express, Stripe, Bank Deposit or any payment methods at checkout.',
        url: 'https://apps.shopify.com/payrules-conditional-payment-methods',
        url_text: 'Learn about PayRules'
    },
    {
        image: 'asset/images/rules/ShipRightAppBanner.webp',
        heading: 'ShipRight: Hide shipping rates',
        paragraph: 'Hide shipping rates conditionally by customer tags, collections, products, total etc at checkout.',
        url: 'https://apps.shopify.com/shipright-conditional-shipping-methods',
        url_text: 'Learn about ShipRight'
    },
]

export const videos = [
    {
        url: 'https://www.youtube.com/embed/UPSqvS2t5eU?si=PrAA00dGCWUmdO2V',
        title: 'How to Block or Blacklist Fraud Customers Using Customer Tags'
    },
    {
        url: 'https://www.youtube.com/embed/KkL1RPiVmjw?si=u7hPy2VT507fqdm_',
        title: 'How to Enforce a Minimum Order Amount'
    },
    {
        url: 'https://www.youtube.com/embed/nMMFVPe-wy0?si=iGAM5HPA5eWPgyOC',
        title: 'How to Block Specific Product Variants for Selected Countries'
    },

    {
        url: 'https://www.youtube.com/embed/l8HQ2hmMPXE?si=SacTrviC1gX1_62B',
        title: 'How to Block Customers Orders by Zip or Postal Codes'
    },
    {
        url: 'https://www.youtube.com/embed/NvTmelw7j2I?si=SP8_pyJtGyhbl5pp',
        title: 'How to Restrict Collections or Products to Selected Countries'
    },
    {
        url: 'https://www.youtube.com/embed/KYhaDTqDZwM?si=rHDF2UF0WWgb7bph',
        title: 'How to Restrict Shipping for Specific Products'
    },

    {
        url: 'https://www.youtube.com/embed/A0dtdNvVDuo?si=on38_at6Fn9yzjnQ',
        title: 'How to Set a Maximum Order Amount Limit'
    },
    {
        url: 'https://www.youtube.com/embed/3Le1tpPJTCE?si=N7XyIBtDC7sGblik',
        title: 'How to Disable Orders Temporarily but Keep the Store Browsable'
    },
    {
        url: 'https://www.youtube.com/embed/5g4FIP9_5U0?si=9kzjjn-6u4XUup_3',
        title: 'How to Block Discounts for Specific Collections or Products'
    },

    {
        url: 'https://www.youtube.com/embed/otbUVXbwF3I?si=oTwoH0fns5wBhBOw',
        title: 'How to Set a Maximum Quantity Limit'
    },
    {
        url: 'https://www.youtube.com/embed/EVhwlXxKiFU?si=lqGPH3sBdLRFvU7m',
        title: 'How to Set a Minimum Quantity Condition'
    },
]

export const actionItems = [
    {
        title: 'General',
        items: [
            {
                icon: CheckCircleIcon,
                key: 'always',
                title: 'Always',
                description: 'Dont check any rules/conditions, discounts are always available at checkout.',
            }
        ]
    },
    {
        title: 'Cart',
        items: [
            {
                icon: CartIcon,
                key: 'cartTotal',
                title: 'Cart total',
                description: 'Total amount including tax & shipping',
            },
            {
                icon: CalculatorIcon,
                key: 'cartSubtotal',
                title: 'Cart subtotal',
                description: 'Subtotal excluding tax & shipping',
            },
            {
                icon: CalculatorIcon,
                key: 'specificItemsTotal',
                title: 'Specific items total',
                description: 'Total amount from specific collections, product tags, products, or variants',
            },
            {
                icon: AppsFilledIcon,
                key: 'totalQuantity',
                title: 'Total quantity',
                description: 'Total quantity of items in the cart',
            },
            {
                icon: MeasurementVolumeIcon,
                key: 'singleVariantQuantity',
                title: 'Single variant quantity',
                description: 'Quantity of a single variant in the cart',
            },
            {
                icon: ProductIcon,
                key: 'specificItemsQuantity',
                title: 'Specific items quantity',
                description: 'Quantity of selected items in the cart',
            },
            {
                icon: SandboxIcon,
                key: 'singleProductQuantity',
                title: 'Single product quantity',
                description: 'Quantity of a single product in the cart',
            },
            {
                icon: ProductIcon,
                key: 'products',
                title: 'Products',
                description: 'Specific products in the cart',
            },
            {
                icon: ListBulletedIcon,
                key: 'collections',
                title: 'Collections',
                description: 'Products from specific collections in the cart',
            },
            {
                icon: ProductFilledIcon,
                key: 'productTags',
                title: 'Product tags',
                description: 'Products tagged with specific product tags',
            },
            /* {
                icon: CashDollarIcon,
                key: 'cartCurrency',
                title: 'Cart currency',
                description: 'Currency used in the customer’s order',
            }, */
        ]
    },
    {
        title: 'Discount',
        items: [
            {
                icon: CreditCardPercentIcon,
                key: 'discountAmount',
                title: 'Discount amount',
                description: 'Total discount applied to the order',
            },
        ]
    },
    {
        title: 'Customer',
        items: [
            {
                icon: PersonIcon,
                key: 'customerTags',
                title: 'Customer tags',
                description: 'Customers associated with specific tags',
            },
            /* {
                icon: HomeFilledIcon,
                key: 'customerIsCompany',
                title: 'Customer is company',
                description: 'B2B customers linked to a company',
            }, */
            /* {
                icon: WorkIcon,
                key: 'companyNames',
                title: 'Company names',
                description: 'Customers from specific companies',
            }, */
        ]
    },
    {
        title: 'Shipping and delivery',
        items: [
            {
                icon: GlobeIcon,
                key: 'shippingCountry',
                title: 'Shipping country',
                description: 'Selected shipping country by the customer',
            },
            {
                icon: LocationIcon,
                key: 'city',
                title: 'City',
                description: 'Applied based on the entered shipping destination city',
            },
            {
                icon: ReferralCodeIcon,
                key: 'provinceCodes',
                title: 'Province/state code',
                description: 'Shipping province codes',
            },
            {
                icon: LocationFilledIcon,
                key: 'zipPostalCodes',
                title: 'Zip or postal codes',
                description: 'Shipping zip or postal codes',
            },
            {
                icon: MarketsFilledIcon,
                key: 'markets',
                title: 'Markets',
                description: 'Choose available markets',
            },
            {
                icon: DeliveryFilledIcon,
                key: 'deliveryTypes',
                title: 'Delivery types',
                description: 'Selected delivery type like pickup, shipping etc by customer',
            },
            {
                icon: LocationFilledIcon,
                key: 'address',
                title: 'Address',
                description: 'Shipping address',
            },
            {
                icon: LocationIcon,
                key: 'pobox',
                title: 'P.O. Box',
                description: 'Shipping p.o. box',
            },
            {
                icon: DeliveryIcon,
                key: 'shippingMethod',
                title: 'Shipping method',
                description: 'Applied based on the specific shipping methods available to pick',
            },
            {
                icon: DeliveryFilledIcon,
                key: 'freeShippingMethod',
                title: 'Free shipping method',
                description: 'Applied based on the free shipping method available to pick',
            },
        ]
    },
    {
        title: 'Local time',
        items: [
            {
                icon: ClockIcon,
                key: 'hours',
                title: 'Hours',
                description: 'Based on the time of the day',
            },
            {
                icon: CalendarIcon,
                key: 'weekday',
                title: 'Weekday',
                description: 'Based on the day of the week',
            }
        ]
    },
];

export const advanceActionItems = [
    {
        title: 'General',
        items: [
            {
                icon: CheckCircleIcon,
                key: 'always',
                title: 'Always',
                description: 'Dont check any rules/conditions, discounts are always available at checkout.',
            }
        ]
    },
    {
        title: 'Cart',
        items: [
            {
                icon: CartIcon,
                key: 'cartTotal',
                title: 'Cart total',
                description: 'Total amount including tax & shipping',
            },
            {
                icon: CalculatorIcon,
                key: 'cartSubtotal',
                title: 'Cart subtotal',
                description: 'Subtotal excluding tax & shipping',
            },
            {
                icon: CalculatorIcon,
                key: 'specificItemsTotal',
                title: 'Specific items total',
                description: 'Total amount from specific collections, product tags, products, or variants',
            },
            {
                icon: MeasurementWeightIcon,
                key: 'totalOrderWeight',
                title: 'Total order weight',
                description: 'Total weight of items in the cart',
            },
            {
                icon: CashDollarIcon,
                key: 'cartCurrency',
                title: 'Cart currency',
                description: 'Currency used in the customer’s order',
            },
            {
                icon: AppsFilledIcon,
                key: 'specificItemsWeight',
                title: 'Specific items weight',
                description: 'Total weight of selected items',
            },
            {
                icon: EditIcon,
                key: 'cartAttribute',
                title: 'Cart attribute',
                description: 'Based on the cart attribute: cart note, attributes to collect, etc',
            },
            {
                icon: MeasurementVolumeIcon,
                key: 'totalQuantity',
                title: 'Total quantity',
                description: 'Total quantity of items in the cart',
            },
            {
                icon: SandboxIcon,
                key: 'singleProductQuantity',
                title: 'Single product quantity',
                description: 'Quantity of a single product in the cart',
            },
            {
                icon: MeasurementVolumeIcon,
                key: 'singleVariantQuantity',
                title: 'Single variant quantity',
                description: 'Quantity of a single variant in the cart',
            },
            {
                icon: ProductIcon,
                key: 'specificItemsQuantity',
                title: 'Specific items quantity',
                description: 'Quantity of selected items in the cart',
            },
            {
                icon: CartIcon,
                key: 'products',
                title: 'Products',
                description: 'Specific products in the cart',
            },
            {
                icon: ArrowsOutHorizontalIcon,
                key: 'subscriptionProducts',
                title: 'Subscription Products',
                description: 'Based on the cart has subscription products',
            },
            {
                icon: ProductFilledIcon,
                key: 'productTags',
                title: 'Product tags',
                description: 'Products tagged with specific product tags',
            },
            {
                icon: TextGrammarIcon,
                key: 'sku',
                title: 'SKU',
                description: 'Based on the product/variant SKU identifier',
            },
        ]
    },
    {
        title: 'Discount',
        items: [
            {
                icon: CreditCardPercentIcon,
                key: 'discountAmount',
                title: 'Discount amount',
                description: 'Total discount applied to the order',
            },
        ]
    },
    {
        title: 'Customer',
        items: [
            {
                icon: PersonIcon,
                key: 'customerTags',
                title: 'Customer tags',
                description: 'Customers associated with specific tags',
            },
            {
                icon: MoneyIcon,
                key: 'customerTotalSpent',
                title: 'Customer total spent',
                description: 'Based on the total amount spent by the customer',
            },
            {
                icon: InfoIcon,
                key: 'customerLogin',
                title: 'Customer login',
                description: 'Based on the customer login',
            },
            {
                icon: HomeFilledIcon,
                key: 'customerIsCompany',
                title: 'Customer is company',
                description: 'B2B customers linked to a company',
            },
            {
                icon: WorkIcon,
                key: 'companyNames',
                title: 'Company names',
                description: 'Customers from specific companies',
            },
        ]
    },
    {
        title: 'Shipping and delivery',
        items: [
            {
                icon: GlobeIcon,
                key: 'shippingCountry',
                title: 'Shipping country',
                description: 'Selected shipping country by the customer',
            },

            {
                icon: ReferralCodeIcon,
                key: 'provinceCodes',
                title: 'Province/state code',
                description: 'Shipping province codes',
            },
            {
                icon: LocationFilledIcon,
                key: 'zipPostalCodes',
                title: 'Zip or postal codes',
                description: 'Shipping zip or postal codes',
            },
            {
                icon: DeliveryIcon,
                key: 'selectedShippingMethod',
                title: 'Selected shipping method',
                description: 'Selected shipping method by the customer',
            },
            {
                icon: DeliveryFilledIcon,
                key: 'deliveryTypes',
                title: 'Delivery types',
                description: 'Selected delivery type like pickup, shipping etc by customer',
            },
        ]
    },
    {
        title: 'Local time',
        items: [
            {
                icon: ClockIcon,
                key: 'hours',
                title: 'Hours',
                description: 'Based on the time of the day',
            },
            {
                icon: CalendarIcon,
                key: 'weekday',
                title: 'Weekday',
                description: 'Based on the day of the week',
            },
            {
                icon: CalendarIcon,
                key: 'specificDates',
                title: 'Specific dates',
                description: 'Based on specific dates',
            }
        ]
    },
]

export const selectOptionsNumber = [
    { label: 'Less than', value: 'Less than' },
    { label: 'More than', value: 'More than' },
];
export const selectOptionsString = [
    { label: 'If found', value: 'If found' },
    { label: 'If not found', value: 'If not found' },
];
export const selectOptionsLocalTime = [
    { label: 'is in between', value: 'is in between' },
    { label: 'is not in between', value: 'is not in between' },
];
export const selectOptionsProduct = [
    { label: 'Any', value: 'Any' },
    { label: 'Not any', value: 'Not any' },
];
export const collectionOptions = [
    { label: 'Home page', value: 'Home' },
    { label: 'About page', value: 'About' }
]
export const customerIsCompanyOptions = [
    { label: 'Block if a company', value: 'Block if a company' },
    { label: 'Block if not a company', value: 'Block if not a company' }
];

export const conditionData = {
    specificDates: {
        title: 'Specific dates',
        description: 'Based on specific dates',
    },
    address: {
        title: 'Address',
        description: 'Shipping address',
    },
    pobox: {
        title: 'P.O. Box',
        description: 'Shipping p.o. box',
    },
    shippingMethod: {
        title: 'Shipping method',
        description: 'Applied based on the specific shipping methods available to pick',
    },
    freeShippingMethod: {
        title: 'Free shipping method',
        description: 'Applied based on the free shipping method available to pick',
    },
    always: {
        title: "Always",
        description: "Don't check any rules/conditions, discounts are always available at checkout."
    },
    cartTotal: {
        title: "Cart total",
        description: "Total amount including tax & shipping."
    },
    cartSubtotal: {
        title: "Cart subtotal",
        description: "Subtotal excluding tax & shipping."
    },
    specificItemsTotal: {
        title: "Specific items total",
        description: "Total amount from specific collections, product tags, products, or variants."
    },
    totalQuantity: {
        title: "Total quantity",
        description: "Total quantity of items in the cart."
    },
    totalOrderWeight: {
        title: "Total order weight",
        description: "Total weight of items in the cart."
    },
    singleVariantQuantity: {
        title: "Single variant quantity",
        description: "Quantity of a single variant in the cart."
    },
    singleProductQuantity: {
        title: "Single product quantity",
        description: "Quantity of a single product in the cart."
    },
    specificItemsQuantity: {
        title: "Specific items quantity",
        description: "Quantity of selected items in the cart."
    },
    products: {
        title: "Products",
        description: "Block orders containing specific products in the cart."
    },
    collections: {
        title: "Collections",
        description: "Block orders containing products from specific collections."
    },
    productTags: {
        title: "Product tags",
        description: "Block orders containing products with specific tags."
    },
    cartCurrency: {
        title: "Cart currency",
        description: "Block orders based on the currency used in the customer’s order."
    },
    discountAmount: {
        title: "Discount amount",
        description: "Block orders based on the total discount applied to the order."
    },
    customerTags: {
        title: "Customer tags",
        description: "Block orders based on customers associated with specific tags."
    },
    customerTotalSpent: {
        title: "Customer total spent",
        description: "Block orders based on the total amount spent by the customer."
    },
    customerLogin: {
        title: "Customer login",
        description: "Block orders based on the customer login status."
    },
    customerIsCompany: {
        title: "Customer is company",
        description: "Block orders based on B2B customers linked to a company."
    },
    companyNames: {
        title: "Company names",
        description: "Block orders from customers from specific companies."
    },
    shippingCountry: {
        title: "Shipping country",
        description: "Block orders based on the selected shipping country by the customer."
    },
    city: {
        title: "City",
        description: "Block orders based on the entered shipping destination city."
    },
    provinceCodes: {
        title: "Province/state code",
        description: "Block orders based on shipping province codes."
    },
    zipPostalCodes: {
        title: "Zip or postal codes",
        description: "Block orders based on shipping zip or postal codes."
    },
    markets: {
        title: "Markets",
        description: "Block orders based on available markets."
    },
    deliveryTypes: {
        title: "Delivery types",
        description: "Block orders based on selected delivery types like pickup, shipping, etc."
    },
    selectedShippingMethod: {
        title: "Selected shipping method",
        description: "Block orders based on the shipping method selected by the customer."
    },
    hours: {
        title: "Hours",
        description: "Block orders based on the time of the day."
    },
    weekday: {
        title: "Weekday",
        description: "Block orders based on the day of the week."
    },
    hourAndWeekday: {
        title: "Hour and weekday",
        description: "Block orders based on both hour and weekday."
    },
    cartAttribute: {
        title: "Cart attribute",
        description: "Block orders based on cart attributes like cart notes, custom attributes, etc."
    },
    subscriptionProducts: {
        title: "Subscription Products",
        description: "Block orders based on whether the cart contains subscription products."
    },
    sku: {
        title: "SKU",
        description: "Block orders based on the product/variant SKU identifier."
    },
    specificItemsWeight: {
        title: "Specific items weight",
        description: "Block orders based on the total weight of selected items."
    }
};

