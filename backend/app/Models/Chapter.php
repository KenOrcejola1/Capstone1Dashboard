<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    protected $fillable = [
        'name',
        'description',
        'color',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function officers()
    {
        return $this->hasMany(ChapterOfficer::class);
    }

    public function activeOfficers()
    {
        return $this->officers()->where('status', 'approved')->where('is_active', true);
    }
}
