<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\JsonResponse;

class TicketController extends Controller
{
    public function index(): JsonResponse
    {
        $tickets = Ticket::with([
            'user',
            'category',
            'priority',
            'status',
            'assignedUser',
        ])->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $tickets,
        ]);
    }

    public function destroy(Ticket $ticket): JsonResponse
    {
    $ticket->delete();

    return response()->json([
        'success' => true,
        'message' => 'Ticket eliminado correctamente.',
    ]);
    }
}