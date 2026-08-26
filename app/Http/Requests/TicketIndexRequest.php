<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TicketIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'search' => [
                'nullable',
                'string',
                'max:100',
            ],

            'status' => [
                'nullable',
                'string',
                Rule::exists('ticket_statuses', 'slug'),
            ],

            'priority' => [
                'nullable',
                'string',
                Rule::exists('ticket_priorities', 'id'),
            ],

            'category' => [
                'nullable',
                'integer',
                Rule::exists('ticket_categories', 'id'),
            ],

            'assigned_to' => [
                'nullable',
                'integer',
                Rule::exists('users', 'id'),
            ],

            'sla' => [
                'nullable',
                Rule::in([
                    'on_track',
                    'at_risk',
                    'breached',
                    'met',
                ]),
            ],

            'sort' => [
                'nullable',
                'string',
                Rule::in([
                    'created_at',
                    '-created_at',
                    'updated_at',
                    '-updated_at',
                    'due_at',
                    '-due_at',
                ]),
            ],

            'per_page' => [
                'nullable',
                'integer',
                'min:5',
                'max:100',
            ],
        ];
    }
}