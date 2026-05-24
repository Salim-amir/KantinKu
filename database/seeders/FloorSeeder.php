<?php

namespace Database\Seeders;

use App\Models\Floor;
use Illuminate\Database\Seeder;

class FloorSeeder extends Seeder
{
    public function run(): void
    {
        $floors = [
            ['name' => 'Lantai 2', 'description' => 'Kantin utama, dekat lobi'],
            ['name' => 'Lantai 8', 'description' => 'Kantin atas, dekat ruang kuliah'],
        ];

        foreach ($floors as $floor) {
            Floor::create($floor);
        }
    }
}