<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VolunteerEvent extends Model
{
    protected $attributes = [
        'is_active' => true,
    ];

    protected $fillable = [
        'title',
        'description',
        'location',
        'event_date',
        'registration_deadline',
        'volunteer_slots',
        'is_active',
        'created_by_email',
    ];

    protected $casts = [
        'event_date' => 'datetime',
        'registration_deadline' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'registrants_count',
        'slots_remaining',
        'is_registration_open',
    ];

    public function registrations()
    {
        return $this->hasMany(VolunteerRegistration::class);
    }

    public function getRegistrantsCountAttribute(): int
    {
        return $this->registrations()->count();
    }

    public function getSlotsRemainingAttribute(): ?int
    {
        if ($this->volunteer_slots === null) {
            return null;
        }

        return max(0, $this->volunteer_slots - $this->registrants_count);
    }

    public function getIsRegistrationOpenAttribute(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->registration_deadline && now()->gt($this->registration_deadline)) {
            return false;
        }

        if ($this->slots_remaining !== null && $this->slots_remaining <= 0) {
            return false;
        }

        return true;
    }
}
