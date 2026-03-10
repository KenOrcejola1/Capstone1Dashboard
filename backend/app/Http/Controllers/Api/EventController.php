<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class EventController extends Controller
{
    // GET /api/events  — optionally filter by ?tab=
    public function index(Request $request)
    {
        $query = Event::query();

        if ($request->has('tab')) {
            $query->where('tab', $request->query('tab'));
        }

        $events = $query->orderBy('created_at', 'asc')->get();

        return response()->json($events->map(fn($e) => $this->formatEvent($e)));
    }

    // POST /api/events  — admin creates an event
    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'category'     => 'required|string|max:255',
            'date'         => 'required|string|max:255',
            'time_display' => 'required|string|max:255',
            'location'     => 'nullable|string|max:255',
            'participants' => 'nullable|integer|min:0',
            'description'  => 'required|string',
            'tab'          => 'nullable|string',
            'posted_by'    => 'nullable|string|max:255',
            'compensation' => 'nullable|string|max:255',
            'image'        => 'nullable|image|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('events', 'public');
        }

        $event = Event::create([
            'title'        => $request->title,
            'category'     => $request->category,
            'date'         => $request->date,
            'time_display' => $request->time_display,
            'location'     => $request->location,
            'participants' => $request->participants ?? 0,
            'description'  => $request->description,
            'tab'          => $request->tab ?? 'Upcoming Events',
            'posted_by'    => $request->posted_by,
            'compensation' => $request->compensation,
            'image_path'   => $imagePath,
        ]);

        return response()->json($this->formatEvent($event), 201);
    }

    // POST /api/events/{id}/update  — admin edits an event (POST used to support FormData file upload)
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $request->validate([
            'title'        => 'required|string|max:255',
            'category'     => 'required|string|max:255',
            'date'         => 'required|string|max:255',
            'time_display' => 'required|string|max:255',
            'location'     => 'nullable|string|max:255',
            'participants' => 'nullable|integer|min:0',
            'description'  => 'required|string',
            'image'        => 'nullable|image|max:5120',
        ]);

        $imagePath = $event->image_path;
        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('events', 'public');
        }

        $event->update([
            'title'        => $request->title,
            'category'     => $request->category,
            'date'         => $request->date,
            'time_display' => $request->time_display,
            'location'     => $request->location,
            'participants' => $request->participants ?? $event->participants,
            'description'  => $request->description,
            'image_path'   => $imagePath,
            'image_key'    => $imagePath ? null : $event->image_key, // clear key if new file uploaded
        ]);

        return response()->json($this->formatEvent($event->fresh()));
    }

    // DELETE /api/events/{id}
    public function destroy($id)
    {
        $event = Event::findOrFail($id);

        if ($event->image_path) {
            Storage::disk('public')->delete($event->image_path);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }

    // PATCH /api/events/{id}/approve  — admin approves a proposal
    public function approve($id)
    {
        $event = Event::findOrFail($id);
        $event->update([
            'status' => 'Approved',
            'tab'    => 'Upcoming Events',
        ]);

        return response()->json($this->formatEvent($event->fresh()));
    }

    // PATCH /api/events/{id}/reject  — admin rejects a proposal
    public function reject($id)
    {
        $event = Event::findOrFail($id);
        $event->update(['status' => 'Rejected']);

        return response()->json($this->formatEvent($event->fresh()));
    }

    // POST /api/events/proposals  — alumni submits an event proposal
    public function submitProposal(Request $request)
    {
        $request->validate([
            'title'              => 'required|string|max:255',
            'category'           => 'required|string|max:255',
            'date'               => 'required|string|max:255',
            'time_display'       => 'required|string|max:255',
            'location'           => 'required|string|max:255',
            'participants'       => 'nullable|integer|min:0',
            'description'        => 'required|string',
            'submitted_by'       => 'required|string|max:255',
            'submitted_by_email' => 'required|email',
            'image'              => 'nullable|image|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('events', 'public');
        }

        $event = Event::create([
            'title'              => $request->title,
            'category'           => $request->category,
            'date'               => $request->date,
            'time_display'       => $request->time_display,
            'location'           => $request->location,
            'participants'       => $request->participants ?? 0,
            'description'        => $request->description,
            'tab'                => 'Alumni Proposals',
            'status'             => 'Pending',
            'submitted_by'       => $request->submitted_by,
            'submitted_by_email' => $request->submitted_by_email,
            'posted_by'          => $request->submitted_by,
            'image_path'         => $imagePath,
        ]);

        return response()->json($this->formatEvent($event), 201);
    }

    // GET /api/events/my-proposals/{email}  — alumni views own proposals
    public function getMyProposals($email)
    {
        $events = Event::where('tab', 'Alumni Proposals')
            ->where('submitted_by_email', $email)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($events->map(fn($e) => $this->formatEvent($e)));
    }

    // POST /api/events/{id}/register  — register for an event
    public function register(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $request->validate([
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'email'          => 'required|email',
            'guest_count'    => 'nullable|integer|min:0',
            'guests_data'    => 'nullable|array',
            'payment_method' => 'required|string|in:gcash,maya,card',
            'total_amount'   => 'nullable|numeric|min:0',
        ]);

        EventRegistration::create([
            'event_id'       => $event->id,
            'first_name'     => $request->first_name,
            'last_name'      => $request->last_name,
            'email'          => $request->email,
            'guest_count'    => $request->guest_count ?? 0,
            'guests_data'    => $request->guests_data,
            'payment_method' => $request->payment_method,
            'total_amount'   => $request->total_amount ?? 0,
        ]);

        $event->increment('participants');

        return response()->json(['message' => 'Registration successful'], 201);
    }

    // ─── Helper ────────────────────────────────────────────────────────────────

    private function formatEvent(Event $event): array
    {
        return [
            'id'          => (string) $event->id,
            'title'       => $event->title,
            'category'    => $event->category,
            'date'        => $this->formatDate($event->date),
            'date_value'  => $event->date,   // raw value for date <input>
            'time'        => $event->time_display,
            'location'    => $event->location ?? '',
            'participants' => $event->participants,
            'description' => $event->description,
            'image'       => $event->image_url,
            'tab'         => $event->tab,
            'postedBy'    => $event->posted_by,
            'postedDate'  => $event->created_at ? $event->created_at->diffForHumans() : null,
            'compensation' => $event->compensation,
            'status'      => $event->status,
            'submittedBy' => $event->submitted_by,
        ];
    }

    private function formatDate(string $date): string
    {
        // Only format strings that look like ISO dates (YYYY-MM-DD)
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return Carbon::parse($date)->format('F j, Y');
        }
        return $date; // teaching-opp durations like "1 Semester", "Ongoing", etc.
    }
}
