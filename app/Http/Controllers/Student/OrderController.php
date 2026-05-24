<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Http\Requests\UploadPaymentRequest;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    /**
     * GET /api/orders
     * Return all orders belonging to the authenticated student.
     */
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with(['floor', 'orderItems.product'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    /**
     * GET /api/orders/{id}
     * Return detail of a single order (must belong to this student).
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $order = Order::with(['floor', 'orderItems.product', 'orderItems.floor'])
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json([
            'data' => $order,
        ]);
    }

    /**
     * POST /api/orders
     * CHECKOUT — convert cart items into a real order.
     *
     * This is the most critical endpoint. It:
     * 1. Validates cart is not empty
     * 2. Validates stock for every item
     * 3. Wraps everything in a DB transaction
     * 4. Deducts stock from floor_product
     * 5. Creates the order + order_items
     * 6. Clears the cart
     */
    public function store(CheckoutRequest $request): JsonResponse
    {
        $userId  = $request->user()->id;
        $floorId = $request->floor_id;

        // Load cart items with related product + floor
        $cartItems = Cart::with(['product', 'floor'])
            ->where('user_id', $userId)
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Keranjang kosong. Tambahkan produk terlebih dahulu.',
            ], 422);
        }

        // Pre-validate all stock before touching the DB
        foreach ($cartItems as $item) {
            $stock = $item->floor->stockOf($item->product_id);
            if ($stock < $item->quantity) {
                return response()->json([
                    'message' => "Stok {$item->product->name} di {$item->floor->name} tidak cukup. Tersisa $stock.",
                ], 422);
            }
        }

        // DB::transaction ensures all-or-nothing:
        // if anything fails midway, all changes are rolled back
        $order = DB::transaction(function () use ($userId, $floorId, $cartItems, $request) {

            // Calculate total
            $total = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);

            // Create the order
            $order = Order::create([
                'user_id'     => $userId,
                'floor_id'    => $floorId,
                'total_price' => $total,
                'status'      => 'pending',
                'note'        => $request->note,
            ]);

            // Create order items + deduct stock
            foreach ($cartItems as $item) {
                // Save item snapshot
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item->product_id,
                    'floor_id'   => $item->floor_id,
                    'quantity'   => $item->quantity,
                    'price'      => $item->product->price, // price snapshot
                ]);

                // Deduct stock from floor_product pivot
                $item->floor->products()->updateExistingPivot(
                    $item->product_id,
                    ['stock' => DB::raw('stock - ' . $item->quantity)]
                );
            }

            // Clear cart after successful order
            Cart::where('user_id', $userId)->delete();

            return $order;
        });

        $order->load(['floor', 'orderItems.product']);

        return response()->json([
            'message' => 'Pesanan berhasil dibuat. Silakan upload bukti pembayaran.',
            'data'    => $order,
        ], 201);
    }

    /**
     * POST /api/orders/{id}/payment
     * Upload payment proof image for a pending order.
     */
    public function uploadPayment(UploadPaymentRequest $request, int $id): JsonResponse
    {
        $order = Order::where('user_id', $request->user()->id)
            ->findOrFail($id);

        if (!$order->canUploadProof()) {
            return response()->json([
                'message' => 'Upload bukti pembayaran hanya bisa untuk pesanan berstatus Pending.',
            ], 422);
        }

        // Delete old proof if re-uploading
        if ($order->payment_proof) {
            Storage::disk('public')->delete($order->payment_proof);
        }

        // Store new image
        $path = $request->file('payment_proof')
            ->store('payment_proofs', 'public');

        $order->update([
            'payment_proof' => $path,
            'status'        => 'paid',
        ]);

        return response()->json([
            'message'           => 'Bukti pembayaran berhasil diupload.',
            'payment_proof_url' => $order->payment_proof_url,
        ]);
    }
}
