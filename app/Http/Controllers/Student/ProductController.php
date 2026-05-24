<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Floor;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * GET /api/products
     * List all active products across all floors.
     * Each product includes which floors carry it and the stock per floor.
     */
    public function index(): JsonResponse
    {
        $products = Product::with(['floors' => function ($query) {
            $query->where('is_active', true)
                ->select('floors.id', 'floors.name');
        }])
            ->where('is_active', true)
            ->get();

        return response()->json([
            'data' => $products,
        ]);
    }

    /**
     * GET /api/floors
     * List all active floors.
     */
    public function floors(): JsonResponse
    {
        $floors = Floor::all();

        return response()->json([
            'data' => $floors,
        ]);
    }

    /**
     * GET /api/floors/{id}/products
     * List all active products on a specific floor, with stock.
     * This is the main page students see when browsing by floor.
     */
    public function byFloor(Request $request, int $floorId): JsonResponse
    {
        $floor = Floor::findOrFail($floorId);

        $query = $floor->products()
            ->where('products.is_active', true)
            ->withPivot('stock');

        if ($request->has('search') && $request->search != '') {
            $query->where('products.name', 'like', '%' . $request->search . '%');
        }

        $paginator = $query->paginate(12);

        $paginator->getCollection()->transform(function ($product) {
            return [
                'id'        => $product->id,
                'name'      => $product->name,
                'price'     => $product->price,
                'category'  => $product->category,
                'image_url' => $product->image_url,
                'stock'     => $product->pivot->stock,
                'in_stock'  => $product->pivot->stock > 0,
            ];
        });

        return response()->json([
            'floor'    => $floor,
            'products' => $paginator,
        ]);
    }
}
