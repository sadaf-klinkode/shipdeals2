<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="shopify-api-key" content="{{ \Osiset\ShopifyApp\Util::getShopifyConfig('api_key', $shopDomain ?? Auth::user()->name ) }}" />
    <!-- <meta name="shopify-api-key" content="{{ env('SHOPIFY_API_KEY') }}" /> -->
    {{-- find out why i put this --}}
    {{-- <meta name="shopify-shop" content="{{ env('SHOPIFY_SHOP') }}" /> --}}
    <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>


    <title>Cart Lock</title>
    @viteReactRefresh
    @vite('resources/js/index.jsx')
</head>

<body>

    {{-- find out what this is --}}
    {{-- @if(\Osiset\ShopifyApp\Util::useNativeAppBridge())
    @include('shopify-app::partials.token_handler')
@endif --}}

</body>

</html>