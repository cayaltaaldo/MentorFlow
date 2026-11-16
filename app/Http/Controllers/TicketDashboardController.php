<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Services\TicketSlaService;
use Illuminate\Http\JsonResponse;

class TicketDashboardController extends Controller
{
    public function index(
        TicketSlaService $slaService
    ): JsonResponse {
        $tickets = Ticket::with([
            'status',
            'priority',
        ])->get();

        $activeStatuses = [
            'open',
            'waiting',
            'assigned',
            'in-progress',
        ];

        $resolvedStatuses = [
            'resolved',
            'closed',
        ];

        $activeTickets = $tickets->filter(
            fn ($ticket) => in_array(
                $ticket->status?->slug,
                $activeStatuses,
                true
            )
        );

        $resolvedTickets = $tickets->filter(
            fn ($ticket) => in_array(
                $ticket->status?->slug,
                $resolvedStatuses,
                true
            )
        );

        $cancelledTickets = $tickets->filter(
            fn ($ticket) =>
                $ticket->status?->slug === 'cancelled'
        );

        // SLA operativo: únicamente tickets activos.
        $activeSla = $activeTickets->countBy(
            fn ($ticket) => $slaService->getStatus($ticket)
        );

        // SLA histórico: tickets resueltos o cerrados.
        // El servicio utiliza resolved_at para comprobar
        // si la resolución ocurrió dentro del plazo.
        $resolvedSla = $resolvedTickets->countBy(
            fn ($ticket) => $slaService->getStatus($ticket)
        );

        return response()->json([
            'data' => [
                'total_tickets' => $tickets->count(),
                'open_tickets' => $activeTickets->count(),
                'resolved_tickets' => $resolvedTickets->count(),
                'cancelled_tickets' => $cancelledTickets->count(),

                'sla' => [
                    'on_track' => $activeSla->get('on_track', 0),
                    'at_risk' => $activeSla->get('at_risk', 0),
                    'breached' => $activeSla->get('breached', 0),
                    'unknown' => $activeSla->get('unknown', 0),
                ],

                'historical_sla' => [
                    'met' => $resolvedSla->get('met', 0),
                    'breached' => $resolvedSla->get('breached', 0),
                    'unknown' => $resolvedSla->get('unknown', 0),
                ],
            ],
        ]);
    }
}
