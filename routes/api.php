<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\Student\CartController;
use App\Http\Controllers\Student\OrderController as StudentOrderController;
use App\Http\Controllers\Student\ProductController;
use App\Http\Controllers\Admin\FloorController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\StockController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use Illuminate\Support\Facades\Route;

/*
|──────────────────────────────────────────────
| PUBLIC ROUTES
|──────────────────────────────────────────────
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Public product browsing (no login required)
Route::get('/floors',                  [ProductController::class, 'floors']);
Route::get('/products',                [ProductController::class, 'index']);
Route::get('/floors/{id}/products',    [ProductController::class, 'byFloor']);

/*
|──────────────────────────────────────────────
| PROTECTED ROUTES (must be logged in)
|──────────────────────────────────────────────
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
    
    // Profile
    Route::put('/profile', [ProfileController::class, 'updateProfile']);
    Route::put('/password', [ProfileController::class, 'updatePassword']);

    /*
    |────────────────────────────────
    | STUDENT ROUTES
    |────────────────────────────────
    */
    Route::middleware('student')->group(function () {

        // Cart
        Route::get('/cart',          [CartController::class, 'index']);
        Route::post('/cart',         [CartController::class, 'store']);
        Route::put('/cart/{id}',     [CartController::class, 'update']);
        Route::delete('/cart/{id}',  [CartController::class, 'destroy']);
        Route::delete('/cart',       [CartController::class, 'clear']);

        // Orders
        Route::get('/orders',                        [StudentOrderController::class, 'index']);
        Route::post('/orders',                       [StudentOrderController::class, 'store']);
        Route::get('/orders/{id}',                   [StudentOrderController::class, 'show']);
        Route::post('/orders/{id}/payment',          [StudentOrderController::class, 'uploadPayment']);
    });

    /*
    |────────────────────────────────
    | ADMIN ROUTES
    |────────────────────────────────
    */
    Route::middleware('admin')->prefix('admin')->group(function () {

        // Floors
        Route::get('/floors',          [FloorController::class, 'index']);
        Route::post('/floors',         [FloorController::class, 'store']);
        Route::put('/floors/{id}',     [FloorController::class, 'update']);
        Route::delete('/floors/{id}',  [FloorController::class, 'destroy']);

        // Products
        Route::get('/products',          [AdminProductController::class, 'index']);
        Route::post('/products',         [AdminProductController::class, 'store']);
        Route::put('/products/{id}',     [AdminProductController::class, 'update']);
        Route::delete('/products/{id}',  [AdminProductController::class, 'destroy']);

        // Stock
        Route::get('/stock',                              [StockController::class, 'index']);
        Route::post('/stock',                             [StockController::class, 'store']);
        Route::put('/stock/{floorId}/{productId}',        [StockController::class, 'update']);

        // Orders
        Route::get('/orders',               [AdminOrderController::class, 'index']);
        Route::get('/orders/{id}',          [AdminOrderController::class, 'show']);
        Route::put('/orders/{id}/status',   [AdminOrderController::class, 'updateStatus']);
    });
});
