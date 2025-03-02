<?php

use App\Http\Controllers\api\MarketController;
use App\Http\Controllers\api\ProductController;
use App\Http\Controllers\api\RuleController;
use App\Http\Controllers\api\ShopController;
use Illuminate\Support\Facades\Route;


Route::post('/add-rules/cart', [RuleController::class, 'add_cart'])->middleware(['verify.shopify']);
Route::get('/get-rules/cart', [RuleController::class, 'get_carts'])->middleware(['verify.shopify']);

Route::get('/get-rule/code/{id}/{type}', [RuleController::class, 'getRuleCode'])->middleware(['verify.shopify']);
Route::post('/post-rule/code/{id}', [RuleController::class, 'postRuleCode'])->middleware(['verify.shopify']);
Route::post('/update-rule/code/status/activate/{id}', [RuleController::class, 'updateRuleStatusActivateCode'])->middleware(['verify.shopify']);
Route::post('/update-rule/code/status/deactivate/{id}', [RuleController::class, 'updateRuleStatusDeactivateCode'])->middleware(['verify.shopify']);
Route::delete('/delete-rule/code/{id}', [RuleController::class, 'deleteRuleCode'])->middleware(['verify.shopify']);

Route::get('/get-rule/automatic/{id}/{type}', [RuleController::class, 'getRuleAutomatic'])->middleware(['verify.shopify']);
Route::post('/post-rule/automatic/{id}', [RuleController::class, 'postRuleAutomatic'])->middleware(['verify.shopify']);
Route::post('/update-rule/automatic/status/activate/{id}', [RuleController::class, 'updateRuleStatusActivateAutomatic'])->middleware(['verify.shopify']);
Route::post('/update-rule/automatic/status/deactivate/{id}', [RuleController::class, 'updateRuleStatusDeactivateAutomatic'])->middleware(['verify.shopify']);
Route::delete('/delete-rule/automatic/{id}', [RuleController::class, 'deleteRuleAutomatic'])->middleware(['verify.shopify']);

Route::get('/get-products', [ProductController::class, 'get_products'])->middleware(['verify.shopify']);
Route::get('/collections', [ProductController::class, 'get_collections'])->middleware(['verify.shopify']);
Route::get('/markets', [MarketController::class, 'get_markets'])->middleware(['verify.shopify']);
Route::get('/get-shop-timezone', [ShopController::class, 'get_ShopTimeZone'])->middleware(['verify.shopify']);
Route::get('/get-shipping-countries', [ShopController::class, 'get_shipping_countries'])->middleware(['verify.shopify']);

Route::get('/search/products/{query}/{limit?}', [ProductController::class, 'search_products'])
    ->where('limit', '[0-9]+') // Ensure limit is a number if provided
    ->middleware(['verify.shopify']);
