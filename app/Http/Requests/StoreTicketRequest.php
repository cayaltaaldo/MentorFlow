<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'category_id' => [
                'required',
                'integer',
                Rule::exists('ticket_categories', 'id')
                    ->where('is_active', true),
            ],

            'priority_id' => [
                'required',
                'integer',
                Rule::exists('ticket_priorities', 'id')
                    ->where('is_active', true),
            ],

            'title' => [
                'required',
                'string',
                'min:5',
                'max:255',
            ],

            'description' => [
                'required',
                'string',
                'min:10',
            ],
        ];
    }
}
