<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommunityEngagementActivity extends Model
{
    protected $fillable = [
        'title',
        'category',
        'description',
        'venue',
        'schedule_start',
        'schedule_end',
        'participant_limit',
        'registration_open',
        'poster_image_path',
        'fee_amount',
        'payment_instructions',
        'status',
        'created_by_email',
    ];

    protected $casts = [
        'schedule_start' => 'datetime',
        'schedule_end' => 'datetime',
        'registration_open' => 'boolean',
        'fee_amount' => 'decimal:2',
    ];

    protected $appends = [
        'registrants_count',
        'paid_count',
        'pending_payment_count',
        'available_slots',
    ];

    public function registrations()
    {
        return $this->hasMany(CommunityEngagementRegistration::class, 'activity_id');
    }

    public function getRegistrantsCountAttribute(): int
    {
        return $this->registrations()->count();
    }

    public function getPaidCountAttribute(): int
    {
        return $this->registrations()->where('payment_status', 'verified')->count();
    }

    public function getPendingPaymentCountAttribute(): int
    {
        return $this->registrations()->where('payment_status', 'pending')->count();
    }

    public function getAvailableSlotsAttribute(): ?int
    {
        if ($this->participant_limit === null) {
            return null;
        }

        return max(0, $this->participant_limit - $this->registrants_count);
    }
}
