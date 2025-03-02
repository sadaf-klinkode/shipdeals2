<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShopController extends Controller
{
    public function get_ShopTimeZone()
    {
        $shop = Auth::user();


        $query = '
        query ShopTimeZone {
                        shop {
                            ianaTimezone
                        }        
                     }';

        $response = $shop->api()->graph($query);


        return response()->json([
            'shop' => $response

        ]);
    }

    public function get_shipping_countries()
    {
        $shop = Auth::user();

        $query = '
                query ShippingCountries {
                                shop {
                                    shipsToCountries
                                }        
                            }';

        $response = $shop->api()->graph($query);


        return response()->json([
            'shippingCountries' => $response
        ]);
    }
}
