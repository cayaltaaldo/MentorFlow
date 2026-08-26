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

        $total = $tickets->count();

        $open = $tickets->filter(
            fn ($ticket) =>
                in_array(
                    $ticket->status?->slug,
                    ['open', 'assigned', 'in_progress', 'waiting']
                )
        )->count();

        $resolved = $tickets->filter(
            fn ($ticket) =>
                in_array(
                    $ticket->status?->slug,
                    ['resolved', 'closed']
                )
        )->count();

        $breached = $tickets->filter(
            fn ($ticket) =>
                $slaService->getStatus($ticket) === 'breached'
        )->count();

        $onTrack = $tickets->filter(
            fn ($ticket) =>
                $slaService->getStatus($ticket) === 'on_track'
        )->count();

        $atRisk = $tickets->filter(
            fn ($ticket) =>
                $slaService->getStatus($ticket) === 'at_risk'
        )->count();

        return response()->json([
            'data' => [
                'total_tickets' => $total,

                'open_tickets' => $open,

                'resolved_tickets' => $resolved,

                'sla' => [
                    'on_track' => $onTrack,
                    'at_risk' => $atRisk,
                    'breached' => $breached,
                ],
            ],
        ]);
    }
}