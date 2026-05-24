<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Floor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FloorController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Floor::all(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_active'   => ['nullable', 'boolean'],
            'qris_image'  => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('qris_image')) {
            $data['qris_image'] = $request->file('qris_image')->store('qris', 'public');
        }

        $floor = Floor::create($data);

        return response()->json([
            'message' => 'Lantai berhasil ditambahkan.',
            'data'    => $floor,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $floor = Floor::findOrFail($id);

        $data = $request->validate([
            'name'        => ['sometimes', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_active'   => ['nullable', 'boolean'],
            'qris_image'  => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('qris_image')) {
            // Hapus gambar lama jika ada
            if ($floor->qris_image && \Illuminate\Support\Facades\Storage::disk('public')->exists($floor->qris_image)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($floor->qris_image);
            }
            $data['qris_image'] = $request->file('qris_image')->store('qris', 'public');
        }

        $floor->update($data);

        return response()->json([
            'message' => 'Lantai berhasil diperbarui.',
            'data'    => $floor,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $floor = Floor::findOrFail($id);
        $floor->delete();

        return response()->json([
            'message' => 'Lantai berhasil dihapus.',
        ]);
    }
}
