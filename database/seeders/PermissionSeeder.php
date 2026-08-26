<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            [
                'name' => 'tickets.view',
                'description' => 'Ver tickets',
            ],
            [
                'name' => 'tickets.create',
                'description' => 'Crear tickets',
            ],
            [
                'name' => 'tickets.update',
                'description' => 'Actualizar tickets',
            ],
            [
                'name' => 'tickets.delete',
                'description' => 'Eliminar tickets',
            ],
            [
                'name' => 'tickets.assign',
                'description' => 'Asignar tickets',
            ],
            [
                'name' => 'tickets.close',
                'description' => 'Cerrar tickets',
            ],
            [
                'name' => 'users.view',
                'description' => 'Ver usuarios',
            ],
            [
                'name' => 'users.create',
                'description' => 'Crear usuarios',
            ],
            [
                'name' => 'users.update',
                'description' => 'Actualizar usuarios',
            ],
            [
                'name' => 'users.delete',
                'description' => 'Eliminar usuarios',
            ],
            [
                'name' => 'workflows.view',
                'description' => 'Ver workflows',
            ],
            [
                'name' => 'workflows.create',
                'description' => 'Crear workflows',
            ],
            [
                'name' => 'workflows.update',
                'description' => 'Actualizar workflows',
            ],
            [
                'name' => 'workflows.delete',
                'description' => 'Eliminar workflows',
            ],
            [
                'name' => 'reports.view',
                'description' => 'Ver reportes',
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
}