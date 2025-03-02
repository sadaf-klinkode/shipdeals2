<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['verify.shopify'])->group(function () {
    Route::view('/', 'app')->name('home');
});



Route::fallback(function () {
    return view('app');
});
