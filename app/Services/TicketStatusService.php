<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\TicketHistory;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class TicketStatusService
{
    private array $transitions = [
        'open' => [
            'assigned',
        ],

        'assigned' => [
            'in-progress',
        ],

        'in-progress' => [
            'waiting',
            'resolved',
        ],

        'waiting' => [
            'in-progress',
        ],

        'resolved' => [
            'closed',
        ],

        'closed' => [],
    ];

    public function changeStatus(
        Ticket $ticket,
        string $newStatus,
        User $user,
        TicketHistoryService $historyService
    ): Ticket {

        $currentStatus = $ticket->status?->slug;

        if (!$currentStatus) {
            throw ValidationException::withMessages([
                'status' => 'El ticket no tiene un estado válido.',
            ]);
        }

        if (!array_key_exists($newStatus, $this->transitions)) {
            throw ValidationException::withMessages([
                'status' => 'El estado solicitado no existe.',
            ]);
        }

        $allowedTransitions =
            $this->transitions[$currentStatus] ?? [];

        if (!in_array($newStatus, $allowedTransitions, true)) {
            throw ValidationException::withMessages([
                'status' => "No se puede cambiar de {$currentStatus} a {$newStatus}.",
            ]);
        }

        $statusId = \App\Models\TicketStatus::where(
            'slug',
            $newStatus
        )->value('id');

        if (!$statusId) {
            throw ValidationException::withMessages([
                'status' => 'El estado solicitado no está configurado.',
            ]);
        }

        $oldStatus = $ticket->status->slug;

        $ticket->update([
            'status_id' => $statusId,
        ]);

        $historyService->log(
            $ticket,
            $user,
            'status_changed',
            'status',
            $oldStatus,
            $newStatus,
            "Estado cambiado de {$oldStatus} a {$newStatus}."
        );

        return $ticket->fresh([
            'user',
            'category',
            'priority',
            'status',
            'assignedUser',
        ]);
    }
}