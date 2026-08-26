<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $admin = Role::where('name', 'admin')->first();
        $coordinator = Role::where('name', 'coordinator')->first();
        $agent = Role::where('name', 'agent')->first();
        $user = Role::where('name', 'user')->first();

        $admin->permissions()->sync(
            Permission::all()->pluck('id')
        );

        $coordinator->permissions()->sync(
    Permission::whereIn('name', [
        'tickets.view',
        'tickets.view_all',
        'tickets.create',
        'tickets.update',
        'tickets.update_all',
        'tickets.assign',
        'tickets.close',
        'users.view',
        'workflows.view',
        'workflows.create',
        'workflows.update',
        'reports.view',
    ])->pluck('id')
);
        $agent->permissions()->sync(
            Permission::whereIn('name', [
                'tickets.view',
                'tickets.create',
                'tickets.update',
                'tickets.close',
            ])->pluck('id')
        );

        $user->permissions()->sync(
            Permission::whereIn('name', [
                'tickets.view',
                'tickets.create',
            ])->pluck('id')
        );
    }
}