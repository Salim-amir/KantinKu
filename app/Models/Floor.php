<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Floor extends Model
{
    use HasFactory;

    // ─── Fillable ──────────────────────────────────────────────────
    protected $fillable = [
        'name',
        'description',
        'is_active',
        'qris_image',
    ];

    // ─── Appends ───────────────────────────────────────────────────
    protected $appends = [
        'qris_image_url',
    ];

    // ─── Casts ─────────────────────────────────────────────────────
    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getQrisImageUrlAttribute(): ?string
    {
        if ($this->qris_image) {
            return asset('storage/' . $this->qris_image);
        }
        return null;
    }

    // ─── Relationships ─────────────────────────────────────────────

    /**
     * A floor stocks many products (with stock quantity in the pivot).
     *
     * This is a many-to-many through the 'floor_product' pivot table.
     * withPivot('stock') makes the stock column accessible as:
     *   $floor->products->first()->pivot->stock
     *
     * Usage: $floor->products
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'floor_product')
            ->withPivot('stock')
            ->withTimestamps();
    }

    /**
     * A floor can be the pickup location for many orders.
     * Usage: $floor->orders
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * A floor can have many cart items pointing to it.
     * Usage: $floor->carts
     */
    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    /**
     * A floor can be the source for many order items.
     * Usage: $floor->orderItems
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // ─── Helper Methods ────────────────────────────────────────────

    /**
     * Get stock of a specific product on this floor.
     * Usage: $floor->stockOf($productId)
     */
    public function stockOf(int $productId): int
    {
        $product = $this->products()->where('product_id', $productId)->first();
        return $product ? $product->pivot->stock : 0;
    }
}
