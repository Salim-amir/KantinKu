<?php

namespace Database\Seeders;

use App\Models\Floor;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $lantai2 = Floor::where('name', 'Lantai 2')->first();
        $lantai8 = Floor::where('name', 'Lantai 8')->first();

        // Create products
        $bengBeng  = Product::create(['name' => 'Beng Beng',   'price' => 3500,  'category' => 'snack']);
        $tehPucuk  = Product::create(['name' => 'Teh Pucuk',   'price' => 4000,  'category' => 'minuman']);
        $aqua      = Product::create(['name' => 'Aqua 600ml',  'price' => 5000,  'category' => 'minuman']);
        $kopi      = Product::create(['name' => 'Kopi Sachet', 'price' => 2500,  'category' => 'minuman']);
        $chitato   = Product::create(['name' => 'Chitato',     'price' => 7000,  'category' => 'snack']);
        $indomie   = Product::create(['name' => 'Indomie Cup', 'price' => 10000, 'category' => 'makanan']);

        // Assign stock to floors
        $lantai2->products()->attach([
            $bengBeng->id => ['stock' => 10],
            $tehPucuk->id => ['stock' => 5],
            $chitato->id  => ['stock' => 8],
        ]);

        $lantai8->products()->attach([
            $aqua->id   => ['stock' => 8],
            $kopi->id   => ['stock' => 3],
            $indomie->id => ['stock' => 12],
        ]);
    }
}