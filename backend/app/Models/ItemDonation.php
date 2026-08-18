<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemDonation extends Model
{
    protected $fillable = [
        'donor_first_name',
        'donor_last_name',
        'donor_email',
        'donor_phone',
        'item_name',
        'category',
        'description',
        'quantity',
        'condition',
        'delivery_method',
        'pickup_address',
        'photo_path',
        'status',
        'admin_notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    protected $appends = ['donor_full_name'];

    public function getDonorFullNameAttribute(): string
    {
        return trim($this->donor_first_name . ' ' . $this->donor_last_name);
    }
}
