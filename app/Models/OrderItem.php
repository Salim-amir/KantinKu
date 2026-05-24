<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    // ─── Fillable ──────────────────────────────────────────────────
    protected $fillable = [
        'order_id',
        'product_id',
        'floor_id',
        'quantity',
        'price',
    ];

    // ─── Casts ─────────────────────────────────────────────────────
    protected $casts = [
        'quantity' => 'integer',
        'price'    => 'decimal:2',
    ];

    // ─── Relationships ─────────────────────────────────────────────

    /**
     * Each order item belongs to one order.
     * Usage: $item->order
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Each order item references one product.
     * Note: the 'price' stored here is a snapshot taken at checkout time,
     * not the current product price. This protects historical order data.
     * Usage: $item->product
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Each order item tracks which floor the stock was deducted from.
     * Usage: $item->floor
     */
    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }

    // ─── Helper Methods ────────────────────────────────────────────

    /**
     * Calculate the subtotal for this line item.
     * Uses the stored price snapshot, not the current product price.
     * Usage: $item->subtotal
     */
    public function getSubtotalAttribute(): float
    {
        return $this->price * $this->quantity;
    }
}