<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateStockRequest;
use App\Models\Floor;
use Illuminate\Http\JsonResponse;

class StockController extends Controller
{
    /**
     * GET /api/admin/stock
     * Return all floors with their products and current stock.
     */
    public function index(): JsonResponse
    {
        $floors = Floor::with(['products' => function ($query) {
            $query->withPivot('stock');
        }])->get();

        return response()->json(['data' => $floors]);
    }

    /**
     * POST /api/admin/stock
     * Assign a product to a floor with a stock amount.
     * If already assigned, update the stock.
     */
    public function store(UpdateStockRequest $request): JsonResponse
    {
        $floor = Floor::findOrFail($request->floor_id);

        // sync without detaching others: attach or update
        $floor->products()->syncWithoutDetaching([
            $request->product_id => ['stock' => $request->stock],
        ]);

        return response()->json([
            'message' => 'Stok berhasil diset.',
        ]);
    }

    /**
     * PUT /api/admin/stock/{floorId}/{productId}
     * Update stock for a specific floor-product combination.
     */
    public function update(UpdateStockRequest $request, int $floorId, int $productId): JsonResponse
    {
        $floor = Floor::findOrFail($floorId);

        $floor->products()->updateExistingPivot($productId, [
            'stock' => $request->stock,
        ]);

        return response()->json([
            'message' => 'Stok berhasil diperbarui.',
        ]);
    }
}
