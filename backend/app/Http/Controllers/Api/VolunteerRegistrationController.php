<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VolunteerEvent;
use App\Models\VolunteerRegistration;
use Illuminate\Http\Request;

class VolunteerRegistrationController extends Controller
{
    public function index(Request $request)
    {
        $query = VolunteerRegistration::with('volunteerEvent')->latest();

        if ($request->filled('volunteer_event_id')) {
            $query->where('volunteer_event_id', $request->integer('volunteer_event_id'));
        }

        if ($request->filled('email')) {
            $query->where('email', $request->query('email'));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'volunteer_event_id' => ['required', 'exists:volunteer_events,id'],
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'notes' => ['nullable', 'string'],
        ]);

        $event = VolunteerEvent::findOrFail($validated['volunteer_event_id']);

        if (!$event->is_active) {
            return response()->json(['message' => 'Registration is closed for this event.'], 422);
        }

        if (now()->gt($event->registration_deadline)) {
            return response()->json(['message' => 'The registration deadline for this event has passed.'], 422);
        }

        if ($event->slots_remaining !== null && $event->slots_remaining <= 0) {
            return response()->json(['message' => 'Volunteer slots are full.'], 422);
        }

        $alreadyRegistered = VolunteerRegistration::where('volunteer_event_id', $event->id)
            ->where('email', $validated['email'])
            ->exists();

        if ($alreadyRegistered) {
            return response()->json(['message' => 'You are already registered for this event.'], 422);
        }

        $registration = VolunteerRegistration::create($validated);

        return response()->json([
            'message' => 'You have successfully registered to volunteer.',
            'registration' => $registration->load('volunteerEvent'),
        ], 201);
    }

    public function destroy($id)
    {
        $registration = VolunteerRegistration::findOrFail($id);
        $registration->delete();

        return response()->json(['message' => 'Registration removed successfully']);
    }
}
