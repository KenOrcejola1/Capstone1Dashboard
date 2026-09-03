<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChapterOfficer;
use App\Models\User;
use Illuminate\Http\Request;

class ChapterOfficerController extends Controller
{
    public function index(Request $request)
    {
        $query = ChapterOfficer::query()->with(['chapter', 'user', 'reviewer'])->latest();

        if ($request->filled('chapter_id')) {
            $query->where('chapter_id', $request->input('chapter_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('user_email')) {
            $user = User::where('email', $request->input('user_email'))->first();
            $query->where('user_id', $user?->id ?? 0);
        }

        return response()->json($query->get());
    }

    /**
     * Admin assigns an alumnus as an officer. This is the verification
     * request itself — it starts as "pending" and needs a separate
     * approve/reject action before it counts as an active assignment.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'chapter_id' => 'required|exists:chapters,id',
            'position' => 'required|string|max:255',
            'term_start_date' => 'required|date',
            'term_end_date' => 'required|date|after:term_start_date',
            'email' => 'required|email',
            'admin_email' => 'required|email',
        ]);

        $alumnus = User::where('email', $validated['email'])->first();
        if (!$alumnus) {
            return response()->json(['message' => 'No user found with that email.'], 422);
        }

        // A person can only hold one officer assignment at a time — pending
        // (awaiting review) or approved+active both count as "assigned".
        // Rejected or deactivated assignments don't block a new one.
        $existingAssignment = $alumnus->chapterOfficerAssignments()
            ->where(function ($query) {
                $query->where('status', 'pending')
                    ->orWhere(function ($active) {
                        $active->where('status', 'approved')->where('is_active', true);
                    });
            })
            ->with('chapter')
            ->first();

        if ($existingAssignment) {
            $statusLabel = $existingAssignment->status === 'pending' ? 'pending as' : 'assigned as';
            return response()->json([
                'message' => "This alumnus is already {$statusLabel} {$existingAssignment->position} of {$existingAssignment->chapter->name}. Remove that assignment before assigning a new one.",
            ], 422);
        }

        // The position itself can only be held by one person per chapter at
        // a time — same "pending or approved+active counts as occupied"
        // rule as above, just scoped to chapter+position instead of user.
        $positionHolder = ChapterOfficer::where('chapter_id', $validated['chapter_id'])
            ->where('position', $validated['position'])
            ->where(function ($query) {
                $query->where('status', 'pending')
                    ->orWhere(function ($active) {
                        $active->where('status', 'approved')->where('is_active', true);
                    });
            })
            ->with(['user', 'chapter'])
            ->first();

        if ($positionHolder) {
            $statusLabel = $positionHolder->status === 'pending' ? 'has a pending assignment for' : 'already holds';
            return response()->json([
                'message' => "{$positionHolder->user->name} {$statusLabel} {$positionHolder->position} of {$positionHolder->chapter->name}. Remove that assignment before assigning someone else to this position.",
            ], 422);
        }

        $admin = User::where('email', $validated['admin_email'])->first();

        $officer = ChapterOfficer::create([
            'chapter_id' => $validated['chapter_id'],
            'user_id' => $alumnus->id,
            'position' => $validated['position'],
            'term_start_date' => $validated['term_start_date'],
            'term_end_date' => $validated['term_end_date'],
            'status' => 'pending',
            'is_active' => true,
            'assigned_by' => $admin?->id,
        ]);

        return response()->json($officer->load(['chapter', 'user']), 201);
    }

    /**
     * Admin edits an existing assignment's position and/or term dates only
     * — the chapter and the alumnus stay fixed (use delete + reassign for
     * that instead).
     */
    public function update(Request $request, $id)
    {
        $officer = ChapterOfficer::findOrFail($id);

        $validated = $request->validate([
            'position' => 'required|string|max:255',
            'term_start_date' => 'required|date',
            'term_end_date' => 'required|date|after:term_start_date',
        ]);

        $officer->update($validated);

        return response()->json($officer->load(['chapter', 'user']));
    }

    public function approve(Request $request, $id)
    {
        $officer = ChapterOfficer::findOrFail($id);
        $admin = User::where('email', $request->input('admin_email'))->first();

        $officer->update([
            'status' => 'approved',
            'reviewed_by' => $admin?->id,
            'reviewed_at' => now(),
        ]);

        return response()->json($officer->load(['chapter', 'user']));
    }

    public function reject(Request $request, $id)
    {
        $officer = ChapterOfficer::findOrFail($id);
        $admin = User::where('email', $request->input('admin_email'))->first();

        $officer->update([
            'status' => 'rejected',
            'reviewed_by' => $admin?->id,
            'reviewed_at' => now(),
        ]);

        return response()->json($officer->load(['chapter', 'user']));
    }

    /**
     * Expire/deactivate an assignment, e.g. when a school year ends.
     * The alumni account itself is untouched — they just stop counting
     * as an active officer until (re)assigned.
     */
    public function deactivate($id)
    {
        $officer = ChapterOfficer::findOrFail($id);
        $officer->update(['is_active' => false]);

        return response()->json($officer->load(['chapter', 'user']));
    }

    /**
     * Undo a deactivation — brings a previously-approved assignment back
     * to active without needing to re-run the approve step.
     */
    public function reactivate($id)
    {
        $officer = ChapterOfficer::findOrFail($id);
        $officer->update(['is_active' => true]);

        return response()->json($officer->load(['chapter', 'user']));
    }

    /**
     * Permanently remove this officer assignment record. The alumnus's
     * account is untouched — this only clears their history in this role.
     */
    public function destroy($id)
    {
        $officer = ChapterOfficer::findOrFail($id);
        $officer->delete();

        return response()->json(['message' => 'Officer assignment deleted successfully']);
    }
}
