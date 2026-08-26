<?php

namespace Database\Seeders;

use App\Models\TicketCategory;
use Illuminate\Database\Seeder;

class TicketCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Soporte técnico',
                'description' => 'Problemas relacionados con plataformas y sistemas.',
                'is_active' => true,
            ],
            [
                'name' => 'Académico',
                'description' => 'Consultas y problemas relacionados con cursos.',
                'is_active' => true,
            ],
            [
                'name' => 'Matrícula',
                'description' => 'Solicitudes relacionadas con matrícula.',
                'is_active' => true,
            ],
            [
                'name' => 'Certificados',
                'description' => 'Solicitudes de certificados y constancias.',
                'is_active' => true,
            ],
            [
                'name' => 'Pagos',
                'description' => 'Consultas relacionadas con pagos.',
                'is_active' => true,
            ],
            [
                'name' => 'Acceso',
                'description' => 'Problemas de acceso y autenticación.',
                'is_active' => true,
            ],
            [
                'name' => 'Otros',
                'description' => 'Solicitudes que no pertenecen a otra categoría.',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            TicketCategory::create($category);
        }
    }
}