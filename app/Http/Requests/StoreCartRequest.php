<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'exists:products,id'],
            'floor_id'   => ['required', 'exists:floors,id'],
            'quantity'   => ['required', 'integer', 'min:1', 'max:99'],
        ];
    }
}
