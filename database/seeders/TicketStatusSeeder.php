<?php

namespace Database\Seeders;

use App\Models\TicketStatus;
use Illuminate\Database\Seeder;

class TicketStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            [
                'name' => 'Abierto',
                'slug' => 'open',
                'is_active' => true,
            ],
            [
                'name' => 'Asignado',
                'slug' => 'assigned',
                'is_active' => true,
            ],
            [
                'name' => 'En progreso',
                'slug' => 'in-progress',
                'is_active' => true,
            ],
            [
                'name' => 'En espera',
                'slug' => 'waiting',
                'is_active' => true,
            ],
            [
                'name' => 'Resuelto',
                'slug' => 'resolved',
                'is_active' => true,
            ],
            [
                'name' => 'Cerrado',
                'slug' => 'closed',
                'is_active' => true,
            ],
            [
                'name' => 'Cancelado',
                'slug' => 'cancelled',
                'is_active' => true,
            ],
        ];

        foreach ($statuses as $status) {
            TicketStatus::create($status);
        }
    }
}