<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'first_name',
        'middle_name',
        'last_name',
        'maiden_name',
        'current_address',
        'country',
        'phone_number',
        'telephone_number',
        'zipcode',
        'sex',
        'religion',
        'religion_other',
        'marital_status',
        'marriage_date',
        'intend_to_marry',
        'intended_marriage_age',
        'no_marriage_reason',
        'birth_date',
        'region',
        'province',
        'city',
        'barangay',
        'course',
        'batch_year',
        'has_diploma',
        'diploma_file_path',
        'id_type',
        'valid_id_file_path',
        'profile_image_path',
        'photo_2x2_file_path',
        'approval_status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Always include is_officer when a User is serialized, so the frontend
     * can show the officer badge next to a name wherever it appears without
     * every caller having to remember to ask for it.
     *
     * @var list<string>
     */
    protected $appends = [
        'is_officer',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'deleted_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function chapterOfficerAssignments()
    {
        return $this->hasMany(ChapterOfficer::class);
    }

    /**
     * Just the approved + active assignments, for eager-loading (e.g.
     * `User::with('activeOfficerAssignments')`) so is_officer below doesn't
     * fire an N+1 query per user when listing many at once.
     */
    public function activeOfficerAssignments()
    {
        return $this->chapterOfficerAssignments()
            ->where('status', 'approved')
            ->where('is_active', true);
    }

    /**
     * Whether this user currently has at least one approved, active officer
     * assignment. This is the check event-proposal features should use to
     * gate reunion proposals — an assignment that's pending, rejected, or
     * deactivated (e.g. a past school year the admin has since expired)
     * does not count.
     */
    public function hasActiveOfficerAssignment(): bool
    {
        return $this->relationLoaded('activeOfficerAssignments')
            ? $this->activeOfficerAssignments->isNotEmpty()
            : $this->activeOfficerAssignments()->exists();
    }

    /**
     * Powers the appended is_officer field so the frontend can show the
     * officer badge next to this user's name wherever it's displayed.
     */
    public function getIsOfficerAttribute(): bool
    {
        return $this->hasActiveOfficerAssignment();
    }
}
