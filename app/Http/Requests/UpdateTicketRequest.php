<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'category_id' => [
                'sometimes',
                'integer',
                'exists:ticket_categories,id',
            ],

            'priority_id' => [
                'sometimes',
                'integer',
                'exists:ticket_priorities,id',
            ],

            'status_id' => [
                'sometimes',
                'integer',
                'exists:ticket_statuses,id',
            ],

            'assigned_to' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:users,id',
            ],

            'title' => [
                'sometimes',
                'string',
                'min:5',
                'max:255',
            ],

            'description' => [
                'sometimes',
                'string',
                'min:10',
            ],
        ];
    }
}