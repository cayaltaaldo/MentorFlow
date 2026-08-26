<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Administrador MentorFlow',
            'email' => 'admin@mentorflow.test',
            'password' => Hash::make('Password123!'),
        ]);

        $coordinator = User::create([
            'name' => 'Coordinador MentorFlow',
            'email' => 'coordinator@mentorflow.test',
            'password' => Hash::make('Password123!'),
        ]);

        $agent = User::create([
            'name' => 'Agente MentorFlow',
            'email' => 'agent@mentorflow.test',
            'password' => Hash::make('Password123!'),
        ]);

        $user = User::create([
            'name' => 'Usuario MentorFlow',
            'email' => 'user@mentorflow.test',
            'password' => Hash::make('Password123!'),
        ]);

        $admin->roles()->attach(
            Role::where('name', 'admin')->first()
        );

        $coordinator->roles()->attach(
            Role::where('name', 'coordinator')->first()
        );

        $agent->roles()->attach(
            Role::where('name', 'agent')->first()
        );

        $user->roles()->attach(
            Role::where('name', 'user')->first()
        );
    }
}