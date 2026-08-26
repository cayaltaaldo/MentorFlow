<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\User;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    public function definition(): array
    {
        $priority = TicketPriority::inRandomOrder()->first();

        $createdAt = fake()->dateTimeBetween(
            '-30 days',
            'now'
        );

        return [
            'ticket_number' => 'MF-' . fake()->unique()->numerify('######'),

            'user_id' => User::whereHas('roles', function ($query) {
                $query->where('name', 'user');
            })->inRandomOrder()->value('id'),

            'category_id' => TicketCategory::inRandomOrder()->value('id'),

            'priority_id' => $priority?->id,

            'status_id' => TicketStatus::inRandomOrder()->value('id'),

            'assigned_to' => User::whereHas('roles', function ($query) {
                $query->whereIn('name', ['agent', 'coordinator']);
            })->inRandomOrder()->value('id'),

            'title' => fake()->sentence(6),

            'description' => fake()->paragraph(3),

            'due_at' => $createdAt,

            'resolved_at' => null,

            'closed_at' => null,

            'created_at' => $createdAt,

            'updated_at' => $createdAt,
        ];
    }
}