<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangeTicketStatusRequest;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\TicketIndexRequest;
use App\Http\Requests\UpdateTicketRequest;

use App\Http\Resources\TicketHistoryResource;
use App\Http\Resources\TicketResource;

use App\Models\Ticket;
use App\Models\TicketPriority;
use App\Models\TicketStatus;

use App\Services\TicketHistoryService;
use App\Services\TicketQueryService;
use App\Services\TicketSlaService;
use App\Services\TicketStatusService;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class TicketController extends Controller
{
    /**
     * Listar y filtrar tickets.
     */
    public function index(
        TicketIndexRequest $request,
        TicketQueryService $queryService
    ) {
        $tickets = $queryService->search(
            $request->validated()
        );

        return TicketResource::collection($tickets);
    }

    /**
     * Crear un nuevo ticket.
     */
    public function store(
        StoreTicketRequest $request,
        TicketHistoryService $historyService,
        TicketSlaService $slaService
    ): TicketResource {

        $priority = TicketPriority::findOrFail(
            $request->priority_id
        );

        /*
        |--------------------------------------------------------------------------
        | Calcular SLA
        |--------------------------------------------------------------------------
        */

        $dueAt = $slaService->calculateDueAt(
            $priority
        );

        /*
        |--------------------------------------------------------------------------
        | Crear ticket
        |--------------------------------------------------------------------------
        */

        $ticket = Ticket::create([

            'ticket_number' => 'MF-' . strtoupper(
                fake()->unique()->numerify('######')
            ),

            'user_id' => $request->user()->id,

            'category_id' => $request->category_id,

            'priority_id' => $request->priority_id,

            'status_id' => TicketStatus::where(
                'slug',
                'open'
            )->value('id'),

            'assigned_to' => null,

            'title' => $request->title,

            'description' => $request->description,

            'due_at' => $dueAt,

            'resolved_at' => null,

            'closed_at' => null,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Cargar relaciones
        |--------------------------------------------------------------------------
        */

        $ticket->load([
            'user',
            'category',
            'priority',
            'status',
            'assignedUser',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Registrar historial
        |--------------------------------------------------------------------------
        */

        $historyService->log(
            $ticket,
            $request->user(),
            'created',
            null,
            null,
            null,
            'Ticket creado.'
        );

        return new TicketResource($ticket);
    }

    /**
     * Mostrar un ticket específico.
     */
    public function show(
        Ticket $ticket
    ): TicketResource {

        Gate::authorize(
            'view',
            $ticket
        );

        $ticket->load([
            'user',
            'category',
            'priority',
            'status',
            'assignedUser',
        ]);

        return new TicketResource($ticket);
    }

    /**
     * Actualizar un ticket.
     */
    public function update(
        UpdateTicketRequest $request,
        Ticket $ticket,
        TicketHistoryService $historyService
    ): TicketResource {

        Gate::authorize(
            'update',
            $ticket
        );

        $changes = $request->validated();

        /*
        |--------------------------------------------------------------------------
        | Registrar cambios
        |--------------------------------------------------------------------------
        */

        foreach ($changes as $field => $newValue) {

            $oldValue = $ticket->getAttribute(
                $field
            );

            if ((string) $oldValue === (string) $newValue) {
                continue;
            }

            $ticket->setAttribute(
                $field,
                $newValue
            );

            $historyService->log(
                $ticket,
                $request->user(),
                'updated',
                $field,
                $oldValue,
                $newValue,
                "Se actualizó el campo {$field}."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Guardar cambios
        |--------------------------------------------------------------------------
        */

        $ticket->save();

        /*
        |--------------------------------------------------------------------------
        | Recargar relaciones
        |--------------------------------------------------------------------------
        */

        $ticket->load([
            'user',
            'category',
            'priority',
            'status',
            'assignedUser',
        ]);

        return new TicketResource($ticket);
    }

    /**
     * Eliminar un ticket.
     */
    public function destroy(
        Ticket $ticket,
        TicketHistoryService $historyService,
        Request $request
    ): JsonResponse {

        Gate::authorize(
            'delete',
            $ticket
        );

        /*
        |--------------------------------------------------------------------------
        | Registrar eliminación
        |--------------------------------------------------------------------------
        */

        $historyService->log(
            $ticket,
            $request->user(),
            'deleted',
            null,
            null,
            null,
            'Ticket eliminado.'
        );

        /*
        |--------------------------------------------------------------------------
        | Soft Delete
        |--------------------------------------------------------------------------
        */

        $ticket->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ticket eliminado correctamente.',
        ]);
    }

    /**
     * Cambiar estado de un ticket.
     */
    public function changeStatus(
        ChangeTicketStatusRequest $request,
        Ticket $ticket,
        TicketStatusService $statusService,
        TicketHistoryService $historyService
    ): TicketResource {

        Gate::authorize(
            'update',
            $ticket
        );

        $ticket = $statusService->changeStatus(
            $ticket,
            $request->status,
            $request->user(),
            $historyService
        );

        return new TicketResource($ticket);
    }

    /**
     * Mostrar historial de un ticket.
     */
    public function history(
        Ticket $ticket
    ): AnonymousResourceCollection {

        Gate::authorize(
            'view',
            $ticket
        );

        $history = $ticket->history()
            ->with('user')
            ->latest()
            ->get();

        return TicketHistoryResource::collection(
            $history
        );
    }
}