<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommunityEngagementRegistration extends Model
{
    protected $fillable = [
        'activity_id',
        'full_name',
        'email',
        'phone',
        'notes',
        'payment_method',
        'reference_number',
        'proof_of_payment_path',
        'payment_status',
        'registration_status',
        'amount',
        'payment_verified_at',
        'payment_verified_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_verified_at' => 'datetime',
    ];

    public function activity()
    {
        return $this->belongsTo(CommunityEngagementActivity::class, 'activity_id');
    }
}
