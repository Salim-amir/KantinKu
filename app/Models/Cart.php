<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    // ─── Fillable ──────────────────────────────────────────────────
    protected $fillable = [
        'user_id',
        'floor_id',
        'product_id',
        'quantity',
    ];

    // ─── Casts ─────────────────────────────────────────────────────
    protected $casts = [
        'quantity' => 'integer',
    ];

    // ─── Relationships ─────────────────────────────────────────────

    /**
     * Each cart item belongs to one user.
     * Usage: $cart->user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Each cart item is associated with a specific floor
     * (the floor where the student wants to pick up from).
     * Usage: $cart->floor
     */
    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }

    /**
     * Each cart item references one product.
     * Usage: $cart->product
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // ─── Helper Methods ────────────────────────────────────────────

    /**
     * Calculate the subtotal for this cart item.
     * Usage: $cart->subtotal
     * Returns: e.g. 7000.00 for 2 × Beng Beng at Rp3.500
     */
    public function getSubtotalAttribute(): float
    {
        return $this->product->price * $this->quantity;
    }
}