<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TicketPriority extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sla_minutes',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'sla_minutes' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Tickets que utilizan esta prioridad.
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'priority_id');
    }
}