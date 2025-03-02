<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class RuleController extends Controller
{
    // add rule
    public function add_cart(Request $request)
    {

        // dd($request->all());

        $shop = Auth::user();
        $functionId = config('shipping-discount.function_id');
        $advanceFunctionId = config('shipping-discount.advance_function_id');
        $discountData = $request->all();
        $conditionsSort = $this->conditionsSort($request->input('conditions'));
        $discountData['conditions'] =  $conditionsSort;

        $productTags = [];
        $selectedCollectionIds = [];
        $customerTags = [];

        $conditions = $request->input('conditions');

        // Ensure $conditions is an array before iterating
        if (!empty($conditions) && is_array($conditions)) {
            foreach ($conditions as $conditionGroup) {
                if (!is_array($conditionGroup)) {
                    continue;
                }

                // Extract productTags
                if (!empty($conditionGroup['productTags']) && is_array($conditionGroup['productTags'])) {
                    foreach ($conditionGroup['productTags'] as $tag) {
                        if (!empty($tag['value'])) {
                            $productTags = array_merge($productTags, array_map('trim', explode(',', $tag['value'])));
                        }
                    }
                }

                // Extract collection IDs
                if (!empty($conditionGroup['collections']) && is_array($conditionGroup['collections'])) {
                    foreach ($conditionGroup['collections'] as $collection) {
                        if (!empty($collection['items']) && is_array($collection['items'])) {
                            $selectedCollectionIds = array_merge($selectedCollectionIds, $collection['items']);
                        }
                    }
                }

                // Extract customerTags
                if (!empty($conditionGroup['customerTags']) && is_array($conditionGroup['customerTags'])) {
                    foreach ($conditionGroup['customerTags'] as $tag) {
                        if (!empty($tag['value'])) {
                            $customerTags = array_merge($customerTags, array_map('trim', explode(',', $tag['value'])));
                        }
                    }
                }
            }
        }

        $productTags = array_values(array_unique($productTags));
        $selectedCollectionIds = array_values(array_unique($selectedCollectionIds));
        $customerTags = array_values(array_unique($customerTags));

        $startDate = $request->input('activeDate.startDate');
        $startTime = $request->input('activeDate.startTime');
        $timeZone = $request->input('activeDate.shopTimeZone', 'America/New_York');

        $startsAt = Carbon::createFromFormat('Y-m-d H:i', "$startDate $startTime", $timeZone)
            ->setTimezone($timeZone)
            ->toIso8601String();

        $endDate = $request->input('activeDate.endDate');
        $endTime = $request->input('activeDate.endTime');
        $timeZone = $request->input('activeDate.shopTimeZone', 'America/New_York');

        $endsAt = null;

        if (
            $endDate && $endTime
        ) {
            $endsAt = Carbon::createFromFormat('Y-m-d H:i', "$endDate $endTime", $timeZone)
                ->setTimezone($timeZone)
                ->toIso8601String();
        }


        $metafieldData = [
            "namespace" => $request->input('routeId') === 'discount' ? '$app:shipping-discount' : '$app:advance-shipping-discount',
            'key' => 'function-configuration',
            'value' => json_encode([
                'ruleData' => $discountData,
                'productTags' => $productTags,
                'selectedCollectionIds' => $selectedCollectionIds,
                'customerTags' => $customerTags
            ]),
            'type' => 'json',
        ];

        if ($request->input('discountType') === 'automaticDiscount') {
            $mutation = '
                        mutation discountAutomaticAppCreate($automaticAppDiscount: DiscountAutomaticAppInput!) {
                            discountAutomaticAppCreate(automaticAppDiscount: $automaticAppDiscount) {
                                userErrors {
                                    field
                                    message
                                }
                                automaticAppDiscount {
                                    discountId
                                    title
                                    startsAt
                                    endsAt
                                    status
                                    combinesWith {
                                        orderDiscounts
                                        productDiscounts
                                    }
                                    appDiscountType {
                                    appKey
                                    functionId
                                    }
                                }
                            }
                        }';

            $variables = [
                'automaticAppDiscount' => [
                    "title" => $request->input('discountName'),
                    "functionId" => $functionId,
                    "functionId" => $request->input('routeId') === 'discount' ? $functionId : $advanceFunctionId,
                    "startsAt" => $startsAt,
                    "endsAt" => $endsAt,
                    "combinesWith" => [
                        "orderDiscounts" => $request->input('combinations.orderDiscounts'),
                        "productDiscounts" => $request->input('combinations.productDiscounts'),
                    ],
                    'metafields' => [$metafieldData]
                ]
            ];
        } else {
            $mutation = '
                    mutation discountCodeAppCreate($codeAppDiscount: DiscountCodeAppInput!) {
                        discountCodeAppCreate(codeAppDiscount: $codeAppDiscount) {
                        codeAppDiscount {
                            discountId
                            title
                             combinesWith {
                                        orderDiscounts
                                        productDiscounts
                                    }
                            appDiscountType {
                            description
                            functionId
                            }
                            codes(first: 100) {
                            nodes {
                                code
                            }
                            }
                            status
                            usageLimit
                        }
                        userErrors {
                            field
                            message
                        }
                        }
                    }';

            $variables = [
                'codeAppDiscount' => [
                    "code" => $request->input('discountCode'),
                    "title" => $request->input('discountName'),
                    "functionId" => $request->input('routeId') === 'discount' ? $functionId : $advanceFunctionId,
                    "appliesOncePerCustomer" => $request->input('discountUses.oneUse'),
                    "startsAt" => $startsAt,
                    "endsAt" => $endsAt,
                    "combinesWith" => [
                        "orderDiscounts" => $request->input('combinations.orderDiscounts'),
                        "productDiscounts" => $request->input('combinations.productDiscounts'),
                    ],
                    "usageLimit" => $request->input('discountUses.numberOfTime') ? intval($request->input('discountUses.numberOfTime')) : null,
                    'metafields' => [$metafieldData]
                ]
            ];
        }

        // dd($variables);
        try {
            $response = $shop->api()->graph($mutation, $variables);
            return response()->json([
                'discount' => $response
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // show all rule
    public function get_carts()
    {
        $shop = Auth::user();

        $query = '
            query getDiscounts($first: Int, $after: String) {
                discountNodes(first: $first, after: $after) {
                    edges {
                        node {
                            id
                            discount {
                                __typename
                                ... on DiscountCodeApp {
                                    title
                                    status
                                    startsAt
                                    endsAt
                                    usageLimit
                                     appDiscountType {
                                            title
                                            functionId
                                            
                                     }
                                }
                                ... on DiscountAutomaticApp {
                                    title
                                    status
                                    startsAt
                                    endsAt
                                     appDiscountType {
                                            title
                                            functionId
                                            
                                     }
                                }
                            }
                        }
                    }
                         pageInfo {
                        endCursor
                        hasNextPage
                        hasPreviousPage
                        startCursor
                    }
                }
            }
        ';

        $variables = [
            'first' => 50,
            'after' => null,
        ];

        try {
            $response = $shop->api()->graph($query, $variables);
            // dd($response['body']);
            return response()->json([
                'discounts' => $response['body'],
                'shippingDiscountsFunctionId' =>  config('shipping-discount.function_id'),
                'advanceShippingDiscountsFunctionId' => config('shipping-discount.advance_function_id')

            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // show code rule
    public function getRuleCode($id, $type)
    {
        $shop = Auth::user();
        $discountId = 'gid://shopify/DiscountCodeNode/' . $id;

        if ($type == 'discount') {
            $query = '
                query getDiscountWithMetafield($id: ID!) {
                    discountNode(id: $id) {
                        id
                        discount {
                            __typename
                            ... on DiscountCodeApp {
                                title
                                status
                                startsAt
                                endsAt
                                usageLimit
                                codes(first: 10) {
                                            nodes {
                                                code
                                            }
                                        }
                            }
                        }
                        metafield(namespace: "$app:shipping-discount", key: "function-configuration") {
                            namespace
                            key
                            id
                            value
                            type
                        }
                    }
                }
            ';
        } else {
            $query = '
                query getDiscountWithMetafield($id: ID!) {
                    discountNode(id: $id) {
                        id
                        discount {
                            __typename
                            ... on DiscountCodeApp {
                                title
                                status
                                startsAt
                                endsAt
                                usageLimit
                                codes(first: 10) {
                                            nodes {
                                                code
                                            }
                                        }
                            }
                        }
                        metafield(namespace: "$app:advance-shipping-discount", key: "function-configuration") {
                            namespace
                            key
                            id
                            value
                            type
                        }
                    }
                }
            ';
        }




        $variables = [
            'id' => $discountId,
        ];
        try {
            $response = $shop->api()->graph($query, $variables);
            return response()->json([
                'discount' => $response['body']['data']['discountNode']
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // update code rule
    public function postRuleCode(Request $request, $id)
    {
        $shop = Auth::user();
        $discountId = 'gid://shopify/DiscountCodeNode/' . $id;
        $metafieldId = $request->input('metaFieldId');
        $functionId = config('shipping-discount.function_id');
        $advanceFunctionId = config('shipping-discount.advance_function_id');
        $discountData = $request->all();
        $conditionsSort = $this->conditionsSort($request->input('conditions'));
        $discountData['conditions'] =  $conditionsSort;

        $productTags = [];
        $selectedCollectionIds = [];
        $customerTags = [];

        $conditions = $request->input('conditions');

        // Ensure $conditions is an array before iterating
        if (!empty($conditions) && is_array($conditions)) {
            foreach ($conditions as $conditionGroup) {
                if (!is_array($conditionGroup)) {
                    continue;
                }

                // Extract productTags
                if (!empty($conditionGroup['productTags']) && is_array($conditionGroup['productTags'])) {
                    foreach ($conditionGroup['productTags'] as $tag) {
                        if (!empty($tag['value'])) {
                            $productTags = array_merge($productTags, array_map('trim', explode(',', $tag['value'])));
                        }
                    }
                }

                // Extract collection IDs
                if (!empty($conditionGroup['collections']) && is_array($conditionGroup['collections'])) {
                    foreach ($conditionGroup['collections'] as $collection) {
                        if (!empty($collection['items']) && is_array($collection['items'])) {
                            $selectedCollectionIds = array_merge($selectedCollectionIds, $collection['items']);
                        }
                    }
                }

                // Extract customerTags
                if (!empty($conditionGroup['customerTags']) && is_array($conditionGroup['customerTags'])) {
                    foreach ($conditionGroup['customerTags'] as $tag) {
                        if (!empty($tag['value'])) {
                            $customerTags = array_merge($customerTags, array_map('trim', explode(',', $tag['value'])));
                        }
                    }
                }
            }
        }

        $productTags = array_values(array_unique($productTags));
        $selectedCollectionIds = array_values(array_unique($selectedCollectionIds));
        $customerTags = array_values(array_unique($customerTags));

        $startDate = $request->input('activeDate.startDate');
        $startTime = $request->input('activeDate.startTime');
        $timeZone = $request->input('activeDate.shopTimeZone', 'America/New_York');

        $startsAt = Carbon::createFromFormat('Y-m-d H:i', "$startDate $startTime", $timeZone)
            ->setTimezone($timeZone)
            ->toIso8601String();

        $endDate = $request->input('activeDate.endDate');
        $endTime = $request->input('activeDate.endTime');
        $timeZone = $request->input('activeDate.shopTimeZone', 'America/New_York');

        $endsAt = null;

        if (
            $endDate && $endTime
        ) {
            $endsAt = Carbon::createFromFormat('Y-m-d H:i', "$endDate $endTime", $timeZone)
                ->setTimezone($timeZone)
                ->toIso8601String();
        }

        $mutation = '
                mutation discountCodeAppUpdate($codeAppDiscount: DiscountCodeAppInput!, $id: ID!) {
                    discountCodeAppUpdate(codeAppDiscount: $codeAppDiscount, id: $id) {
                            codeAppDiscount {
                                discountId
                                title
                                endsAt
                                 combinesWith {
                                        orderDiscounts
                                        productDiscounts
                                    }
                                appDiscountType {
                                        functionId
                                }
                            }
                            userErrors {
                                field
                                message
                            }
                    }
            }';

        $metafieldData = [
            'id' => $metafieldId,
            'value' => json_encode([
                'ruleData' => $discountData,
                'productTags' => $productTags,
                'selectedCollectionIds' => $selectedCollectionIds,
                'customerTags' => $customerTags
            ]),
            'type' => 'json',
        ];

        $variables = [
            "id" =>  $discountId,
            'codeAppDiscount' => [
                "code" => $request->input('discountCode'),
                "title" => $request->input('discountName'),
                "functionId" => $request->input('routeId') === 'discount' ? $functionId : $advanceFunctionId,
                "appliesOncePerCustomer" => $request->input('discountUses.oneUse'),
                "startsAt" => $startsAt,
                "endsAt" => $endsAt,
                "combinesWith" => [
                    "orderDiscounts" => $request->input('combinations.orderDiscounts'),
                    "productDiscounts" => $request->input('combinations.productDiscounts'),
                ],
                "usageLimit" => $request->input('discountUses.numberOfTime') ? intval($request->input('discountUses.numberOfTime')) : null,
                'metafields' => [$metafieldData]
            ]
        ];

        try {
            $response = $shop->api()->graph($mutation, $variables);
            return response()->json([
                'discount' => $response['body']
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    // show automatic rule
    public function getRuleAutomatic($id, $type)
    {
        $shop = Auth::user();
        $discountId = 'gid://shopify/DiscountAutomaticNode/' . $id;

        if ($type == 'discount') {
            $query = '
                query getDiscountWithMetafield($id: ID!) {
                    discountNode(id: $id) {
                        id
                        discount {
                            __typename
                            ... on DiscountAutomaticApp {
                                title
                                status
                                startsAt
                                endsAt
                            }
                        }
                        metafield(namespace: "$app:shipping-discount", key: "function-configuration") {
                            namespace
                            key
                            id
                            value
                            type
                        }
                    }
                }
            ';
        } else {
            $query = '
                query getDiscountWithMetafield($id: ID!) {
                    discountNode(id: $id) {
                        id
                        discount {
                            __typename
                            ... on DiscountAutomaticApp {
                                title
                                status
                                startsAt
                                endsAt
                            }
                        }
                        metafield(namespace: "$app:advance-shipping-discount", key: "function-configuration") {
                            namespace
                            key
                            id
                            value
                            type
                        }
                    }
                }
            ';
        }




        $variables = [
            'id' => $discountId,
        ];
        try {
            $response = $shop->api()->graph($query, $variables);
            return response()->json([
                'discount' => $response['body']['data']['discountNode']
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    // update automatic rule
    public function postRuleAutomatic(Request $request, $id)
    {
        $shop = Auth::user();
        $discountId = 'gid://shopify/DiscountAutomaticNode/' . $id;
        $metafieldId = $request->input('metaFieldId');
        $functionId = config('shipping-discount.function_id');
        $advanceFunctionId = config('shipping-discount.advance_function_id');
        $discountData = $request->all();
        $conditionsSort = $this->conditionsSort($request->input('conditions'));
        $discountData['conditions'] =  $conditionsSort;

        $productTags = [];
        $selectedCollectionIds = [];
        $customerTags = [];

        $conditions = $request->input('conditions');

        // Ensure $conditions is an array before iterating
        if (!empty($conditions) && is_array($conditions)) {
            foreach ($conditions as $conditionGroup) {
                if (!is_array($conditionGroup)) {
                    continue;
                }

                // Extract productTags
                if (!empty($conditionGroup['productTags']) && is_array($conditionGroup['productTags'])) {
                    foreach ($conditionGroup['productTags'] as $tag) {
                        if (!empty($tag['value'])) {
                            $productTags = array_merge($productTags, array_map('trim', explode(',', $tag['value'])));
                        }
                    }
                }

                // Extract collection IDs
                if (!empty($conditionGroup['collections']) && is_array($conditionGroup['collections'])) {
                    foreach ($conditionGroup['collections'] as $collection) {
                        if (!empty($collection['items']) && is_array($collection['items'])) {
                            $selectedCollectionIds = array_merge($selectedCollectionIds, $collection['items']);
                        }
                    }
                }

                // Extract customerTags
                if (!empty($conditionGroup['customerTags']) && is_array($conditionGroup['customerTags'])) {
                    foreach ($conditionGroup['customerTags'] as $tag) {
                        if (!empty($tag['value'])) {
                            $customerTags = array_merge($customerTags, array_map('trim', explode(',', $tag['value'])));
                        }
                    }
                }
            }
        }

        $productTags = array_values(array_unique($productTags));
        $selectedCollectionIds = array_values(array_unique($selectedCollectionIds));
        $customerTags = array_values(array_unique($customerTags));


        $startDate = $request->input('activeDate.startDate');
        $startTime = $request->input('activeDate.startTime');
        $timeZone = $request->input('activeDate.shopTimeZone', 'America/New_York');

        $startsAt = Carbon::createFromFormat('Y-m-d H:i', "$startDate $startTime", $timeZone)
            ->setTimezone($timeZone)
            ->toIso8601String();

        $endDate = $request->input('activeDate.endDate');
        $endTime = $request->input('activeDate.endTime');
        $timeZone = $request->input('activeDate.shopTimeZone', 'America/New_York');

        $endsAt = null;

        if (
            $endDate && $endTime
        ) {
            $endsAt = Carbon::createFromFormat('Y-m-d H:i', "$endDate $endTime", $timeZone)
                ->setTimezone($timeZone)
                ->toIso8601String();
        }

        $mutation = '
                mutation discountAutomaticAppUpdate($automaticAppDiscount: DiscountAutomaticAppInput!, $id: ID!) {
                    discountAutomaticAppUpdate(automaticAppDiscount: $automaticAppDiscount, id: $id) {
                        automaticAppDiscount {
                            title
                            status
                             combinesWith {
                                        orderDiscounts
                                        productDiscounts
                                    }
                            appDiscountType {
                            appKey
                            functionId
                            }
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }';


        $metafieldData = [
            'id' => $metafieldId,
            'value' => json_encode([
                'ruleData' => $discountData,
                'productTags' => $productTags,
                'selectedCollectionIds' => $selectedCollectionIds,
                'customerTags' => $customerTags
            ]),
            'type' => 'json',
        ];

        $variables = [
            "id" =>  $discountId,
            'automaticAppDiscount' => [
                "title" => $request->input('discountName'),
                "functionId" => $request->input('routeId') === 'discount' ? $functionId : $advanceFunctionId,
                "startsAt" => $startsAt,
                "endsAt" => $endsAt,
                "combinesWith" => [
                    "orderDiscounts" => $request->input('combinations.orderDiscounts'),
                    "productDiscounts" => $request->input('combinations.productDiscounts'),
                ],
                'metafields' => [$metafieldData]
            ]
        ];

        try {
            $response = $shop->api()->graph($mutation, $variables);
            return response()->json([
                'discount' => $response['body']
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    //activate code rule
    public function updateRuleStatusActivateCode($id)
    {
        $shop = Auth::user();
        $globalId = 'gid://shopify/DiscountCodeNode/' . $id;

        $mutation = '
                mutation discountCodeActivate($id: ID!) {
                    discountCodeActivate(id: $id) {
                        codeDiscountNode {
                                 id
                            codeDiscount {
                            ... on DiscountCodeApp {
                                        title
                                        status
                                        startsAt
                                        endsAt
                                        usageLimit
                                    }
                            }
                        }
                        userErrors {
                            field
                            code
                            message
                        }
                    }
            }';

        $variables = [
            'id' => $globalId
        ];

        try {
            // Execute the GraphQL mutation
            $response = $shop->api()->graph($mutation, $variables);

            return response()->json([
                'activated' => $response['body']
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // deactivate code rule
    public function updateRuleStatusDeactivateCode($id)
    {
        $shop = Auth::user();
        $globalId = 'gid://shopify/DiscountCodeNode/' . $id;

        $mutation = '
                mutation discountCodeDeactivate($id: ID!) {
                    discountCodeDeactivate(id: $id) {
                        codeDiscountNode {
                                 id
                            codeDiscount {
                            ... on DiscountCodeApp {
                                        title
                                        status
                                        startsAt
                                        endsAt
                                        usageLimit
                                    }
                            }
                        }
                        userErrors {
                            field
                            code
                            message
                        }
                    }
            }';

        $variables = [
            'id' => $globalId
        ];

        try {
            // Execute the GraphQL mutation
            $response = $shop->api()->graph($mutation, $variables);

            return response()->json([
                'activated' => $response['body']
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // delete code rule
    public function deleteRuleCode($id)
    {
        $shop = Auth::user();
        $globalId = 'gid://shopify/DiscountCodeNode/' . $id;
        // Correctly declaring the variable in the mutation
        $mutation = '
        mutation deleteDiscount($id: ID!) {
            discountCodeDelete(id: $id) {
                deletedCodeDiscountId
                userErrors {
                    field
                    code
                    message
                }
            }
        }';

        // Variables for the mutation
        $variables = [
            'id' => $globalId
        ];

        try {
            // Execute the GraphQL mutation
            $response = $shop->api()->graph($mutation, $variables);

            return response()->json([
                'deletedId' => $response['body']
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // activate automatic rule
    public function updateRuleStatusActivateAutomatic($id)
    {
        $shop = Auth::user();
        $globalId = 'gid://shopify/DiscountAutomaticNode/' . $id;

        $mutation = '
                mutation discountAutomaticActivate($id: ID!) {
                    discountAutomaticActivate(id: $id) {
                        automaticDiscountNode {
                                 id
                            automaticDiscount {
                            ... on DiscountAutomaticApp {
                                        title
                                        status
                                        startsAt
                                        endsAt
                                    }
                            }
                        }
                        userErrors {
                            field
                            message
                        }
                    }
            }';

        $variables = [
            'id' => $globalId
        ];

        try {
            // Execute the GraphQL mutation
            $response = $shop->api()->graph($mutation, $variables);

            return response()->json([
                'activated' => $response['body']
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // deactivate automatic rule
    public function updateRuleStatusDeactivateAutomatic($id)
    {
        $shop = Auth::user();
        $globalId = 'gid://shopify/DiscountAutomaticNode/' . $id;

        $mutation = '
                mutation discountAutomaticDeactivate($id: ID!) {
                    discountAutomaticDeactivate(id: $id) {
                        automaticDiscountNode {
                                 id
                            automaticDiscount {
                            ... on DiscountAutomaticApp {
                                        title
                                        status
                                        startsAt
                                        endsAt
                                    }
                            }
                        }
                        userErrors {
                            field
                            message
                        }
                    }
            }';

        $variables = [
            'id' => $globalId
        ];

        try {
            // Execute the GraphQL mutation
            $response = $shop->api()->graph($mutation, $variables);

            return response()->json([
                'activated' => $response['body']
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // delete automatic rule
    public function deleteRuleAutomatic($id)
    {
        $shop = Auth::user();
        $globalId = 'gid://shopify/DiscountAutomaticNode/' . $id;
        // Correctly declaring the variable in the mutation
        $mutation = '
        mutation discountAutomaticDelete($id: ID!) {
            discountAutomaticDelete(id: $id) {
                deletedAutomaticDiscountId
                userErrors {
                    field
                    code
                    message
                }
            }
        }';

        // Variables for the mutation
        $variables = [
            'id' => $globalId
        ];

        try {
            // Execute the GraphQL mutation
            $response = $shop->api()->graph($mutation, $variables);

            return response()->json([
                'deletedId' => $response['body']
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    protected function conditionsSort($conditions)
    {
        $filteredConditions = [];

        foreach ($conditions as $index => $conditionGroup) {

            $validGroup = [];

            foreach ($conditionGroup as $conditionKey => $conditionsArray) {
                if (empty($conditionsArray)) {
                    continue;
                }
                if (in_array($conditionKey, ['always', 'customerIsCompany', 'hours', 'weekday', 'subscriptionProducts', 'customerLogin', 'pobox', 'freeShippingMethod','specificDates'])) {
                    $validGroup[$conditionKey] = $conditionsArray;
                    continue;
                }

                $validConditions = [];

                foreach ($conditionsArray as $condition) {
                    if (!empty($condition['value']) || !empty($condition['items']) || !empty($condition['start'])) {
                        $validCondition = ['action' => $condition['action'] ?? ''];

                        if (!empty($condition['value'])) {
                            $validCondition['value'] = $condition['value'];
                        }

                        if (!empty($condition['items'])) {
                            $validCondition['items'] = $condition['items'];
                        }

                        if (!empty($condition['start'])) {
                            $validCondition['start'] = $condition['start'];
                        }

                        if (!empty($condition['end'])) {
                            $validCondition['end'] = $condition['end'];
                        }

                        if (!empty($condition['type'])) {
                            $validCondition['type'] = $condition['type'];
                        }

                        $validConditions[] = $validCondition;
                    }
                }
                if (!empty($validConditions)) {
                    $validGroup[$conditionKey] = $validConditions;
                }
            }
            if (!empty($validGroup)) {
                $filteredConditions[$index] = $validGroup;
            }
        }
        return $filteredConditions;
    }
}
