<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ticket_number',
        'user_id',
        'category_id',
        'priority_id',
        'status_id',
        'assigned_to',
        'title',
        'description',
        'due_at',
        'resolved_at',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'due_at' => 'datetime',
            'resolved_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    /**
     * Usuario que creó el ticket.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Categoría del ticket.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(
            TicketCategory::class,
            'category_id'
        );
    }

    /**
     * Prioridad del ticket.
     */
    public function priority(): BelongsTo
    {
        return $this->belongsTo(
            TicketPriority::class,
            'priority_id'
        );
    }

    /**
     * Estado del ticket.
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(
            TicketStatus::class,
            'status_id'
        );
    }

    /**
     * Usuario asignado al ticket.
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'assigned_to'
        );
    }

    /**
     * Comentarios del ticket.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(TicketComment::class);
    }

    /**
     * Historial del ticket.
     */
    public function history(): HasMany
    {
        return $this->hasMany(TicketHistory::class);
    }
}