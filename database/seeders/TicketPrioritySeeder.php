<?php

namespace Database\Seeders;

use App\Models\TicketPriority;
use Illuminate\Database\Seeder;

class TicketPrioritySeeder extends Seeder
{
    public function run(): void
    {
        $priorities = [
            [
                'name' => 'Baja',
                'sla_minutes' => 2880,
                'is_active' => true,
            ],
            [
                'name' => 'Media',
                'sla_minutes' => 1440,
                'is_active' => true,
            ],
            [
                'name' => 'Alta',
                'sla_minutes' => 480,
                'is_active' => true,
            ],
            [
                'name' => 'Urgente',
                'sla_minutes' => 120,
                'is_active' => true,
            ],
        ];

        foreach ($priorities as $priority) {
            TicketPriority::create($priority);
        }
    }
}