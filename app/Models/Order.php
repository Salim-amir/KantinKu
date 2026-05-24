<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Order extends Model
{
    use HasFactory;

    // ─── Fillable ──────────────────────────────────────────────────
    protected $fillable = [
        'user_id',
        'floor_id',
        'total_price',
        'status',
        'payment_proof',
        'note',
    ];

    // ─── Casts ─────────────────────────────────────────────────────
    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    // ─── Constants (Status Labels) ─────────────────────────────────
    const STATUS_PENDING         = 'pending';
    const STATUS_PAID            = 'paid';
    const STATUS_PREPARING       = 'preparing';
    const STATUS_READY_PICKUP    = 'ready_for_pickup';
    const STATUS_COMPLETED       = 'completed';

    // ─── Appended Attributes ───────────────────────────────────────
    protected $appends = ['payment_proof_url'];

    // ─── Relationships ─────────────────────────────────────────────

    /**
     * Each order belongs to one student.
     * Usage: $order->user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Each order has one pickup floor.
     * Usage: $order->floor
     */
    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }

    /**
     * One order contains one or more order items.
     * Usage: $order->orderItems
     *        $order->orderItems->count()
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // ─── Accessors ─────────────────────────────────────────────────

    /**
     * Return full public URL for the payment proof image.
     * Usage: $order->payment_proof_url
     */
    public function getPaymentProofUrlAttribute(): ?string
    {
        return $this->payment_proof
            ? asset(Storage::url($this->payment_proof))
            : null;
    }

    // ─── Helper Methods ────────────────────────────────────────────

    /**
     * Check if the order can accept a payment proof upload.
     * Only 'pending' orders should accept uploads.
     * Usage: if ($order->canUploadProof()) { ... }
     */
    public function canUploadProof(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Get the next valid status after the current one.
     * Useful for admin to know what status comes next.
     * Usage: $order->nextStatus()  →  'preparing'
     */
    public function nextStatus(): ?string
    {
        $flow = [
            self::STATUS_PENDING      => self::STATUS_PAID,
            self::STATUS_PAID         => self::STATUS_PREPARING,
            self::STATUS_PREPARING    => self::STATUS_READY_PICKUP,
            self::STATUS_READY_PICKUP => self::STATUS_COMPLETED,
            self::STATUS_COMPLETED    => null,
        ];

        return $flow[$this->status] ?? null;
    }

    /**
     * Human-readable status label (for display in UI).
     * Usage: $order->statusLabel()  →  "Siap Diambil"
     */
    public function statusLabel(): string
    {
        return match ($this->status) {
            self::STATUS_PENDING      => 'Menunggu Pembayaran',
            self::STATUS_PAID         => 'Pembayaran Dikonfirmasi',
            self::STATUS_PREPARING    => 'Sedang Disiapkan',
            self::STATUS_READY_PICKUP => 'Siap Diambil',
            self::STATUS_COMPLETED    => 'Selesai',
            default                   => 'Unknown',
        };
    }
}