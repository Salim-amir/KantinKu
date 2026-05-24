<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // ─── Fillable ──────────────────────────────────────────────────
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    // ─── Hidden (never exposed in JSON responses) ──────────────────
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // ─── Casts ─────────────────────────────────────────────────────
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',   // Auto-hashes on set
        ];
    }

    // ─── Relationships ─────────────────────────────────────────────

    /**
     * A user can place many orders.
     * Usage: $user->orders
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * A user has many items in their cart.
     * Usage: $user->carts
     */
    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    // ─── Helper Methods ────────────────────────────────────────────

    /**
     * Check if the user is an admin.
     * Usage: if ($user->isAdmin()) { ... }
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if the user is a student.
     * Usage: if ($user->isStudent()) { ... }
     */
    public function isStudent(): bool
    {
        return $this->role === 'student';
    }
}