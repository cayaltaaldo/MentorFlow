<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'action' => $this->action,

            'field' => $this->field,

            'old_value' => $this->old_value,

            'new_value' => $this->new_value,

            'description' => $this->description,

            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),

            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}