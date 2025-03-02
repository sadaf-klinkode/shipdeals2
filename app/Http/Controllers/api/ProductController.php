<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{

    public function get_products(Request $request)
    {
        $shop = Auth::user();
        // Define the GraphQL query with variables
        $query = '
        query ($first: Int!, $after: String) {
            products(first: $first, after: $after) {
               edges {
                        cursor
                            node {
                                id
                                title
                                variants(first: 250) {
                                    edges {
                                        node {
                                            id
                                            title
                                        }
                                    }
                            }
                        }
                    }
                pageInfo {
                    hasNextPage
                     endCursor
                }
            }
        }';

        // Define the variables
        $variables = [
            'first' => $request->input('first') ?? 250,
            'after' => $request->input('after') ?? null,
        ];

        // Execute the query with variables
        $response = $shop->api()->graph($query, $variables);

        return response()->json([
            'data' => [
                'products' => $response,
            ]
        ]);
    }

    public function get_collections()
    {
        $shop = Auth::user();
        $allCollections = [];
        $lastCollectionCursor = null;
        $hasNextCollectionPage = true;
        $collectionIterationCount = 0; // To track the number of iterations and limit them

        while ($hasNextCollectionPage && $collectionIterationCount < 10) {
            // Adjust the query to include cursor-based pagination
            $collectionQuery = '
                    {
                        collections(first: 250' . ($lastCollectionCursor ? ', after: "' . addslashes($lastCollectionCursor) . '"' : '') . ') {
                            edges {
                                cursor
                                node {
                                    id
                                    title
                                }
                            }
                            pageInfo {
                                hasNextPage
                                endCursor
                            }
                        }
                    }';

            $collectionsResponse = $shop->api()->graph($collectionQuery);
            $collections = $collectionsResponse['body']->container['data']['collections']['edges'] ?? [];
            $collectionPageInfo = $collectionsResponse['body']->container['data']['collections']['pageInfo'] ?? [];

            foreach ($collections as $collection) {
                $allCollections[] = $collection['node']; // Accumulate the fetched collections
                $lastCollectionCursor = $collection['cursor']; // Update lastCollectionCursor with the current collection's cursor
            }

            $hasNextCollectionPage = $collectionPageInfo['hasNextPage'] ?? false;
            $lastCollectionCursor = $collectionPageInfo['endCursor'] ?? null; // Update lastCollectionCursor for the next iteration
            $collectionIterationCount++; // Increment the iteration count
        }

        return response()->json([
            'collectionsData' => $allCollections,
            'lastCollectionCursor' => $lastCollectionCursor
        ]);
    }


    public function search_products($title, $limit = 2500)
    {
        $shop = Auth::user();
        $query = "title:*$title*"; // Searches for products with the given title

        $max_per_request = 250; // Shopify's limit per request
        $total_limit = min((int) $limit, 2500); // Ensure we don't exceed 2,500 products
        $all_products = [];
        $cursor = null; // Start without a cursor

        do {
            // GraphQL query with cursor support
            $search_query = 'query searchProducts($query: String!, $first: Int!, $after: String) {
                products(first: $first, after: $after, query: $query) {
                    edges {
                        node {
                            id
                            title
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }';

            // Variables for the request
            $variables = [
                'query' => $query,
                'first' => min($max_per_request, $total_limit - count($all_products)), // Prevent exceeding $limit
                'after' => $cursor
            ];

            // Execute the GraphQL query
            $response = $shop->api()->graph($search_query, $variables);

            // Check if the response contains valid data
            if (!isset($response['body']->container['data']['products']['edges'])) {
                return response()->json([
                    'error' => 'Invalid response from Shopify API',
                    'details' => $response['body']->container
                ], 400);
            }

            $products = $response['body']->container['data']['products'];

            // Extract product data (remove cursor)
            foreach ($products['edges'] as $edge) {
                $all_products[] = $edge['node'];
            }

            // Update cursor and check if more products exist
            $cursor = $products['pageInfo']['endCursor'];
            $has_next_page = $products['pageInfo']['hasNextPage'];
        } while ($has_next_page && count($all_products) < $total_limit);

        // dd($cursor);

        return response()->json([
            'data' => $all_products,
            'pagination' => [
                'retrieved_count' => count($all_products),
                'has_more_products' => $has_next_page,
                'next_cursor' => $has_next_page ? $cursor : null // Only return cursor if there are more pages
            ]
        ]);
    }
}
