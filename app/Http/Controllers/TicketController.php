<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use App\Models\TicketStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with([
            'user',
            'category',
            'priority',
            'status',
            'assignedUser',
        ]);

        if ($request->filled('status_id')) {
            $query->where('status_id', $request->integer('status_id'));
        }

        if ($request->filled('priority_id')) {
            $query->where('priority_id', $request->integer('priority_id'));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        if ($request->filled('assigned_to')) {
            $query->where('assigned_to', $request->integer('assigned_to'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $tickets = $query
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return TicketResource::collection($tickets);
    }

    public function store(StoreTicketRequest $request): TicketResource
    {
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

            'due_at' => null,

            'resolved_at' => null,

            'closed_at' => null,
        ]);

        $ticket->load([
            'user',
            'category',
            'priority',
            'status',
            'assignedUser',
        ]);

        return new TicketResource($ticket);
    }

    public function show(Ticket $ticket): TicketResource
    {
        $ticket->load([
            'user',
            'category',
            'priority',
            'status',
            'assignedUser',
        ]);

        return new TicketResource($ticket);
    }

    public function update(
        UpdateTicketRequest $request,
        Ticket $ticket
    ): TicketResource {

        $ticket->update(
            $request->validated()
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

    public function destroy(Ticket $ticket): JsonResponse
    {
        $ticket->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ticket eliminado correctamente.',
        ]);
    }
}