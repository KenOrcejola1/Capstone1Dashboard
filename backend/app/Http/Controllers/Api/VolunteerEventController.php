<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VolunteerEvent;
use Illuminate\Http\Request;

class VolunteerEventController extends Controller
{
    public function index(Request $request)
    {
        $query = VolunteerEvent::orderBy('registration_deadline', 'asc');

        if ($request->query('role') !== 'admin') {
            $query->where('is_active', true);
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        return response()->json(VolunteerEvent::findOrFail($id));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'event_date' => ['nullable', 'date'],
            'registration_deadline' => ['required', 'date'],
            'volunteer_slots' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['nullable', 'boolean'],
            'created_by_email' => ['nullable', 'email', 'max:255'],
        ]);

        $event = VolunteerEvent::create($validated);

        return response()->json($event, 201);
    }

    public function update(Request $request, $id)
    {
        $event = VolunteerEvent::findOrFail($id);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'event_date' => ['nullable', 'date'],
            'registration_deadline' => ['sometimes', 'required', 'date'],
            'volunteer_slots' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['nullable', 'boolean'],
            'created_by_email' => ['nullable', 'email', 'max:255'],
        ]);

        $event->update($validated);

        return response()->json($event->fresh());
    }

    public function destroy($id)
    {
        $event = VolunteerEvent::findOrFail($id);
        $event->delete();

        return response()->json(['message' => 'Volunteer event deleted successfully']);
    }
}
