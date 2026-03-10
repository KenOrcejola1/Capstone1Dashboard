<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventRegistration extends Model
{
    protected $fillable = [
        'event_id', 'first_name', 'last_name', 'email',
        'guest_count', 'guests_data', 'payment_method', 'total_amount',
    ];

    protected $casts = [
        'guests_data' => 'array',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
