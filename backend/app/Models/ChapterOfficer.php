<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChapterOfficer extends Model
{
    protected $fillable = [
        'chapter_id',
        'user_id',
        'position',
        'school_year',
        'status',
        'is_active',
        'assigned_by',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'reviewed_at' => 'datetime',
    ];

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assigner()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
