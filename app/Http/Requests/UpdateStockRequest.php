<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        if ($this->route('floorId') && $this->route('productId')) {
            $this->merge([
                'floor_id'   => $this->route('floorId'),
                'product_id' => $this->route('productId'),
            ]);
        }
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
