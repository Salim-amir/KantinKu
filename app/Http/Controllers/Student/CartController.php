<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCartRequest;
use App\Models\Cart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * GET /api/cart
     * Return the authenticated student's current cart.
     */
    public function index(Request $request): JsonResponse
    {
        $carts = Cart::with(['product', 'floor'])
            ->where('user_id', $request->user()->id)
            ->get()
            ->map(function ($cart) {
                return [
                    'id'       => $cart->id,
                    'quantity' => $cart->quantity,
                    'subtotal' => $cart->subtotal,
                    'product'  => [
                        'id'        => $cart->product->id,
                        'name'      => $cart->product->name,
                        'price'     => $cart->product->price,
                        'image_url' => $cart->product->image_url,
                    ],
                    'floor' => [
                        'id'   => $cart->floor->id,
                        'name' => $cart->floor->name,
                    ],
                ];
            });

        $total = $carts->sum('subtotal');

        return response()->json([
            'data'  => $carts,
            'total' => $total,
        ]);
    }

    /**
     * POST /api/cart
     * Add a product to cart, or update quantity if already exists.
     * Also validates that the requested floor actually has enough stock.
     */
    public function store(StoreCartRequest $request): JsonResponse
    {
        $floorId   = $request->floor_id;
        $productId = $request->product_id;
        $quantity  = $request->quantity;

        // Check stock availability on the requested floor
        $floor = \App\Models\Floor::findOrFail($floorId);
        $stock = $floor->stockOf($productId);

        if ($stock < $quantity) {
            return response()->json([
                'message' => "Stok tidak cukup. Tersisa $stock item.",
            ], 422);
        }

        // updateOrCreate: if same user+floor+product exists, update qty
        // Otherwise create a new row
        $cart = Cart::updateOrCreate(
            [
                'user_id'    => $request->user()->id,
                'floor_id'   => $floorId,
                'product_id' => $productId,
            ],
            [
                'quantity' => $quantity,
            ]
        );

        $cart->load(['product', 'floor']);

        return response()->json([
            'message' => 'Produk ditambahkan ke keranjang.',
            'data'    => $cart,
        ], 201);
    }

    /**
     * PUT /api/cart/{id}
     * Update quantity of a specific cart item.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        // findOrFail ensures the cart item belongs to this user
        $cart = Cart::where('user_id', $request->user()->id)
            ->findOrFail($id);

        // Recheck stock for the new quantity
        $floor = \App\Models\Floor::findOrFail($cart->floor_id);
        $stock = $floor->stockOf($cart->product_id);

        if ($stock < $request->quantity) {
            return response()->json([
                'message' => "Stok tidak cukup. Tersisa $stock item.",
            ], 422);
        }

        $cart->update(['quantity' => $request->quantity]);

        return response()->json([
            'message' => 'Keranjang diperbarui.',
            'data'    => $cart,
        ]);
    }

    /**
     * DELETE /api/cart/{id}
     * Remove a single item from the cart.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $cart = Cart::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $cart->delete();

        return response()->json([
            'message' => 'Item dihapus dari keranjang.',
        ]);
    }

    /**
     * DELETE /api/cart
     * Clear all items in the student's cart.
     */
    public function clear(Request $request): JsonResponse
    {
        Cart::where('user_id', $request->user()->id)->delete();

        return response()->json([
            'message' => 'Keranjang dikosongkan.',
        ]);
    }
}
