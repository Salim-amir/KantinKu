<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->foreignId('floor_id')
                  ->constrained('floors')
                  ->onDelete('cascade');   // Pickup floor

            $table->decimal('total_price', 10, 2);

            $table->enum('status', [
                'pending',
                'paid',
                'preparing',
                'ready_for_pickup',
                'completed',
            ])->default('pending');

            $table->string('payment_proof')->nullable();  // File path of proof image
            $table->text('note')->nullable();              // Optional student note

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};