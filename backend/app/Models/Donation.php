<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $fillable = [
        'campaign_id',
        'first_name',
        'last_name',
        'email',
        'amount',
        'payment_method',
        'payment_status',
        'reference_number',
        'proof_of_payment_path',
        'verified_by',
        'verified_at',
    ];

    protected $casts = [
        'amount'      => 'decimal:2',
        'verified_at' => 'datetime',
    ];

    protected $appends = ['full_name'];

    public function campaign()
    {
        return $this->belongsTo(DonationCampaign::class, 'campaign_id');
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}
