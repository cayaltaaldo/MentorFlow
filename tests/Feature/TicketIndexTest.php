<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\TicketCategory;
use App\Models\TicketPriority;

class TicketIndexTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_authenticated_agent_can_list_tickets(): void
    {
        $user = User::factory()->create();

        $agentRole = Role::where('name', 'agent')->firstOrFail();

        $user->roles()->attach($agentRole);

        $response = $this
            ->actingAs($user)
            ->getJson('/api/tickets');

        $response->assertStatus(200);

        $response->assertJsonStructure([
    'data',
    'links' => [
        'first',
        'last',
        'prev',
        'next',
    ],
    'meta' => [
        'current_page',
        'from',
        'last_page',
        'path',
        'per_page',
        'to',
        'total',
    ],
]);
    }

    public function test_tickets_can_be_searched(): void
    {
        $user = User::factory()->create();

        $agentRole = Role::where('name', 'agent')->firstOrFail();

        $user->roles()->attach($agentRole);

        $response = $this
            ->actingAs($user)
            ->getJson('/api/tickets?search=error');

        $response->assertStatus(200);
    }

    public function test_tickets_can_be_paginated(): void
    {
        $user = User::factory()->create();

        $agentRole = Role::where('name', 'agent')->firstOrFail();

        $user->roles()->attach($agentRole);

        $response = $this
            ->actingAs($user)
            ->getJson('/api/tickets?per_page=5');

        $response->assertStatus(200);

        $response->assertJsonPath('meta.per_page', 5);
    }

    public function test_tickets_can_be_filtered_by_status(): void
{
    $user = User::factory()->create();

    $agentRole = Role::where('name', 'agent')->firstOrFail();

    $user->roles()->attach($agentRole);

    $response = $this
        ->actingAs($user)
        ->getJson('/api/tickets?status=open');

    $response->assertStatus(200);

    $response->assertJsonStructure([
        'data',
        'links',
        'meta',
    ]);
}

public function test_tickets_can_be_filtered_by_priority(): void
{
    $user = User::factory()->create();

    $agentRole = Role::where('name', 'agent')->firstOrFail();

    $user->roles()->attach($agentRole);

    $priority = TicketPriority::firstOrFail();

    $response = $this
        ->actingAs($user)
        ->getJson(
            '/api/tickets?priority=' . $priority->id
        );

    $response->assertStatus(200);

    $response->assertJsonStructure([
        'data',
        'links',
        'meta',
    ]);
}

public function test_tickets_can_be_filtered_by_category(): void
{
    $user = User::factory()->create();

    $agentRole = Role::where('name', 'agent')->firstOrFail();

    $user->roles()->attach($agentRole);

    $category = TicketCategory::firstOrFail();

    $response = $this
        ->actingAs($user)
        ->getJson(
            '/api/tickets?category=' . $category->id
        );

    $response->assertStatus(200);

    $response->assertJsonStructure([
        'data',
        'links',
        'meta',
    ]);
}
}