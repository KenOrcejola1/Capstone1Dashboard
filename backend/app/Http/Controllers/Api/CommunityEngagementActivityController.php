<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommunityEngagementActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CommunityEngagementActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = CommunityEngagementActivity::query()->withCount('registrations')->latest();

        if ($request->query('role') !== 'admin') {
            $query->where('status', 'active');
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $activity = CommunityEngagementActivity::with(['registrations' => function ($q) {
            $q->latest();
        }])->findOrFail($id);

        return response()->json($activity);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'venue' => ['nullable', 'string', 'max:255'],
            'schedule_start' => ['nullable', 'date'],
            'schedule_end' => ['nullable', 'date', 'after_or_equal:schedule_start'],
            'participant_limit' => ['nullable', 'integer', 'min:1'],
            'registration_open' => ['nullable', 'boolean'],
            'fee_amount' => ['nullable', 'numeric', 'min:0'],
            'payment_instructions' => ['nullable', 'string'],
            'status' => ['nullable', Rule::in(['active', 'cancelled'])],
            'created_by_email' => ['nullable', 'email'],
            'poster_image' => ['nullable', 'image', 'max:5120'],
        ]);

        if ($request->hasFile('poster_image')) {
            $validated['poster_image_path'] = '/storage/' . $request->file('poster_image')->store('community-posters', 'public');
        }

        $activity = CommunityEngagementActivity::create($validated);

        return response()->json($activity, 201);
    }

    public function update(Request $request, $id)
    {
        $activity = CommunityEngagementActivity::findOrFail($id);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'venue' => ['nullable', 'string', 'max:255'],
            'schedule_start' => ['nullable', 'date'],
            'schedule_end' => ['nullable', 'date', 'after_or_equal:schedule_start'],
            'participant_limit' => ['nullable', 'integer', 'min:1'],
            'registration_open' => ['nullable', 'boolean'],
            'fee_amount' => ['nullable', 'numeric', 'min:0'],
            'payment_instructions' => ['nullable', 'string'],
            'status' => ['nullable', Rule::in(['active', 'cancelled'])],
            'poster_image' => ['nullable', 'image', 'max:5120'],
        ]);

        if ($request->hasFile('poster_image')) {
            if ($activity->poster_image_path && str_starts_with($activity->poster_image_path, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $activity->poster_image_path));
            }

            $validated['poster_image_path'] = '/storage/' . $request->file('poster_image')->store('community-posters', 'public');
        }

        $activity->update($validated);

        return response()->json($activity->fresh());
    }

    public function destroy($id)
    {
        $activity = CommunityEngagementActivity::findOrFail($id);

        if ($activity->poster_image_path && str_starts_with($activity->poster_image_path, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $activity->poster_image_path));
        }

        $activity->delete();

        return response()->json(['message' => 'Activity deleted']);
    }

    public function setRegistrationOpen(Request $request, $id)
    {
        $data = $request->validate([
            'registration_open' => ['required', 'boolean'],
        ]);

        $activity = CommunityEngagementActivity::findOrFail($id);
        $activity->registration_open = $data['registration_open'];
        $activity->save();

        return response()->json($activity);
    }

    public function setParticipantLimit(Request $request, $id)
    {
        $data = $request->validate([
            'participant_limit' => ['nullable', 'integer', 'min:1'],
        ]);

        $activity = CommunityEngagementActivity::findOrFail($id);
        $activity->participant_limit = $data['participant_limit'] ?? null;
        $activity->save();

        return response()->json($activity);
    }
}
