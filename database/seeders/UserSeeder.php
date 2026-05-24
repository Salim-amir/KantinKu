<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'Admin KantinKu',
            'email'    => 'admin@kantinku.id',
            'password' => Hash::make('password123'),
            'role'     => 'admin',
        ]);

        User::create([
            'name'     => 'Budi Mahasiswa',
            'email'    => 'budi@student.id',
            'password' => Hash::make('password123'),
            'role'     => 'student',
        ]);
    }
}