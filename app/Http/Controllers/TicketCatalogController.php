<?php

namespace App\Http\Controllers;

use App\Models\TicketCategory;
use App\Models\TicketPriority;
use Illuminate\Http\JsonResponse;

class TicketCatalogController extends Controller
{
    /**
     * Listar las categorías activas de tickets.
     */
    public function categories(): JsonResponse
    {
        $categories = TicketCategory::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'description',
            ]);

        return response()->json([
            'data' => $categories,
        ]);
    }

    /**
     * Listar las prioridades activas de tickets.
     */
    public function priorities(): JsonResponse
    {
        $priorities = TicketPriority::query()
            ->where('is_active', true)
            ->orderBy('sla_minutes')
            ->get([
                'id',
                'name',
                'sla_minutes',
            ]);

        return response()->json([
            'data' => $priorities,
        ]);
    }
}
