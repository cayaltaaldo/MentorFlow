<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    /**
     * Determina si el usuario puede ver un ticket.
     */
    public function view(User $user, Ticket $ticket): bool
    {
        // Debe tener el permiso general para visualizar tickets.
        if (!$user->hasPermission('tickets.view')) {
            return false;
        }

        // Puede ver cualquier ticket si tiene el permiso especial.
        if ($user->hasPermission('tickets.view_all')) {
            return true;
        }

        // Un agente solamente puede ver tickets asignados a él.
        if ($user->hasRole('agent')) {
            return $ticket->assigned_to === $user->id;
        }

        // Un usuario solamente puede ver sus propios tickets.
        if ($user->hasRole('user')) {
            return $ticket->user_id === $user->id;
        }

        return false;
    }

    /**
     * Determina si el usuario puede actualizar un ticket.
     */
    public function update(User $user, Ticket $ticket): bool
    {
        // Debe tener el permiso general.
        if (!$user->hasPermission('tickets.update')) {
            return false;
        }

        // Puede actualizar cualquier ticket si tiene el permiso especial.
        if ($user->hasPermission('tickets.update_all')) {
            return true;
        }

        // Un agente solamente puede actualizar tickets asignados a él.
        if ($user->hasRole('agent')) {
            return $ticket->assigned_to === $user->id;
        }

        // Un usuario solamente puede actualizar sus propios tickets.
        if ($user->hasRole('user')) {
            return $ticket->user_id === $user->id;
        }

        return false;
    }

    /**
     * Determina si el usuario puede eliminar un ticket.
     */
    public function delete(User $user, Ticket $ticket): bool
    {
        // Debe tener el permiso general.
        if (!$user->hasPermission('tickets.delete')) {
            return false;
        }

        // Puede eliminar cualquier ticket si tiene el permiso especial.
        if ($user->hasPermission('tickets.delete_all')) {
            return true;
        }

        // Si no tiene delete_all, solamente puede eliminar su propio ticket.
        return $ticket->user_id === $user->id;
    }
}