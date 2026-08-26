<?php

namespace App\Services;

use App\Models\Ticket;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TicketQueryService
{
    public function search(array $filters): LengthAwarePaginator
    {
        $query = Ticket::query()
            ->with([
                'user',
                'category',
                'priority',
                'status',
                'assignedUser',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Búsqueda
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['search'])) {

            $search = $filters['search'];

            $query->where(function ($q) use ($search) {

                $q->where('ticket_number', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")

                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Estado
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['status'])) {

            $query->whereHas('status', function ($statusQuery) use ($filters) {

                $statusQuery->where(
                    'slug',
                    $filters['status']
                );
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Prioridad
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['priority'])) {

        $query->where(
            'priority_id',
            $filters['priority']
        );
    }

        /*
        |--------------------------------------------------------------------------
        | Categoría
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['category'])) {

            $query->where(
                'category_id',
                $filters['category']
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Responsable
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['assigned_to'])) {

            $query->where(
                'assigned_to',
                $filters['assigned_to']
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Ordenamiento
        |--------------------------------------------------------------------------
        */

        $sort = $filters['sort'] ?? '-created_at';

        $direction = str_starts_with($sort, '-')
            ? 'desc'
            : 'asc';

        $column = ltrim($sort, '-');

        $query->orderBy(
            $column,
            $direction
        );

        /*
        |--------------------------------------------------------------------------
        | Paginación
        |--------------------------------------------------------------------------
        */

        $perPage = $filters['per_page'] ?? 15;

        return $query->paginate($perPage);
    }
}