<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    // ─── Fillable ──────────────────────────────────────────────────
    protected $fillable = [
        'name',
        'description',
        'price',
        'image',
        'category',
        'is_active',
    ];

    // ─── Casts ─────────────────────────────────────────────────────
    protected $casts = [
        'price'     => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // ─── Appended Attributes ───────────────────────────────────────
    protected $appends = ['image_url'];

    // ─── Relationships ─────────────────────────────────────────────

    /**
     * A product can be stocked on many floors (with stock in the pivot).
     * Usage: $product->floors
     *        $product->floors->first()->pivot->stock
     */
    public function floors()
    {
        return $this->belongsToMany(Floor::class, 'floor_product')
                    ->withPivot('stock')
                    ->withTimestamps();
    }

    /**
     * A product can appear in many order items (across different orders).
     * Usage: $product->orderItems
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * A product can be added to many users' carts.
     * Usage: $product->carts
     */
    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    // ─── Accessors ─────────────────────────────────────────────────

    /**
     * Automatically generate the full image URL.
     * Appended as 'image_url' on every product JSON response.
     *
     * Usage: $product->image_url
     * Returns: "http://localhost:8000/storage/products/beng-beng.jpg"
     *          or null if no image is set
     */
    public function getImageUrlAttribute(): ?string
    {
        return $this->image
            ? asset(Storage::url($this->image))
            : null;
    }
}