<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'floor_id'   => ['required', 'exists:floors,id'],
            'product_id' => ['required', 'exists:products,id'],
            'stock'      => ['required', 'integer', 'min:0'],
        ];
    }
}
