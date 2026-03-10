<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Event extends Model
{
    protected $fillable = [
        'title', 'category', 'date', 'time_display', 'location',
        'participants', 'description', 'image_path', 'image_key',
        'tab', 'posted_by', 'compensation', 'status',
        'submitted_by', 'submitted_by_email',
    ];

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function getImageUrlAttribute(): string
    {
        if ($this->image_path) {
            return url('storage/' . $this->image_path);
        }
        return $this->image_key ?? '';
    }
}
