<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');                     // e.g. "Beng Beng"
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);           // e.g. 3500.00
            $table->string('image')->nullable();        // stored file path
            $table->string('category', 100)->nullable(); // e.g. "snack", "minuman"
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};