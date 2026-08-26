<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\TicketPriority;

class TicketSlaService
{
    public function calculateDueAt(TicketPriority $priority)
    {
        return now()->addMinutes(
            $priority->sla_minutes
        );
    }

    public function getStatus(Ticket $ticket): string
    {
        if (!$ticket->due_at) {
            return 'unknown';
        }

        if (
            $ticket->resolved_at &&
            $ticket->resolved_at->lessThanOrEqualTo($ticket->due_at)
        ) {
            return 'met';
        }

        if (
            $ticket->resolved_at &&
            $ticket->resolved_at->greaterThan($ticket->due_at)
        ) {
            return 'breached';
        }

        if ($ticket->due_at->isPast()) {
            return 'breached';
        }

        if (
            now()->diffInHours(
                $ticket->due_at,
                false
            ) <= 4
        ) {
            return 'at_risk';
        }

        return 'on_track';
    }
}