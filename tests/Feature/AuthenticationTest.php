<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_guest_cannot_access_tickets(): void
    {
        $response = $this
            ->getJson('/api/tickets');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_access_tickets(): void
    {
        $user = User::factory()->create();

        $agentRole = Role::where('name', 'agent')->firstOrFail();

        $user->roles()->attach($agentRole);

        $response = $this
            ->actingAs($user)
            ->getJson('/api/tickets');

        $response->assertStatus(200);
    }
}