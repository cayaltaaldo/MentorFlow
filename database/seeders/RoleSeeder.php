<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'description' => 'Administrador del sistema',
            ],
            [
                'name' => 'coordinator',
                'description' => 'Coordinador de atención y operaciones',
            ],
            [
                'name' => 'agent',
                'description' => 'Agente encargado de resolver tickets',
            ],
            [
                'name' => 'user',
                'description' => 'Usuario que registra solicitudes',
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}