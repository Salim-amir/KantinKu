<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * GET /api/admin/orders
     * Return all orders with optional status filter.
     * Usage: /api/admin/orders?status=pending
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['user', 'floor', 'orderItems.product'])
            ->latest();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->paginate(15);

        return response()->json($orders);
    }

    /**
     * GET /api/admin/orders/{id}
     * Return full detail of one order including payment proof.
     */
    public function show(int $id): JsonResponse
    {
        $order = Order::with([
            'user',
            'floor',
            'orderItems.product',
            'orderItems.floor',
        ])->findOrFail($id);

        return response()->json(['data' => $order]);
    }

    /**
     * PUT /api/admin/orders/{id}/status
     * Update the status of an order.
     * Validates that the transition follows the correct flow.
     */
    public function updateStatus(UpdateOrderStatusRequest $request, int $id): JsonResponse
    {
        $order     = Order::findOrFail($id);
        $newStatus = $request->status;

        // Enforce status flow order
        $validNext = $order->nextStatus();

        if ($newStatus !== $validNext) {
            return response()->json([
                'message' => "Status tidak valid. Status berikutnya seharusnya: {$validNext}",
            ], 422);
        }

        $order->update(['status' => $newStatus]);

        return response()->json([
            'message' => "Status pesanan diperbarui ke: {$order->statusLabel()}",
            'data'    => $order,
        ]);
    }
}
