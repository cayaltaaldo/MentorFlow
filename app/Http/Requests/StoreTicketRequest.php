<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
                'exists:ticket_categories,id',
            ],

            'priority_id' => [
                'required',
                'integer',
                'exists:ticket_priorities,id',
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