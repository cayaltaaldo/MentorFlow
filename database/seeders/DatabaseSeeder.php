<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            PermissionSeeder::class,
            TicketCategorySeeder::class,
            TicketPrioritySeeder::class,
            TicketStatusSeeder::class,
            RolePermissionSeeder::class,
            UserSeeder::class,
            TicketSeeder::class,
        ]);
    }
}