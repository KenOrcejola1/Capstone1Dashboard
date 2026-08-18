<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VolunteerRegistration extends Model
{
    protected $fillable = [
        'volunteer_event_id',
        'full_name',
        'email',
        'phone',
        'notes',
    ];

    public function volunteerEvent()
    {
        return $this->belongsTo(VolunteerEvent::class);
    }
}
