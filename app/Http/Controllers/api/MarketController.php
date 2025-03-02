<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MarketController extends Controller
{
    public function get_markets($lastCursor = null)
    {
        $shop = Auth::user();


        $query = '
        query Markets {
            markets(first: 250) {
                nodes {
                name
                webPresence {
                    rootUrls {
                    locale
                    url
                    }
                }
                }
            }
            }';

        $response = $shop->api()->graph($query);

        return response()->json([
            'data' => $response['body']->container['data']['markets']['nodes'] ?? [],
            'shop' => $shop

        ]);
    }
}
