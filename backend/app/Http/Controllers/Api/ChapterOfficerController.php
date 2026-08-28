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
            'school_year' => 'required|string|max:20',
            'email' => 'required|email',
            'admin_email' => 'required|email',
        ]);

        $alumnus = User::where('email', $validated['email'])->first();
        if (!$alumnus) {
            return response()->json(['message' => 'No user found with that email.'], 422);
        }

        $admin = User::where('email', $validated['admin_email'])->first();

        $officer = ChapterOfficer::create([
            'chapter_id' => $validated['chapter_id'],
            'user_id' => $alumnus->id,
            'position' => $validated['position'],
            'school_year' => $validated['school_year'],
            'status' => 'pending',
            'is_active' => true,
            'assigned_by' => $admin?->id,
        ]);

        return response()->json($officer->load(['chapter', 'user']), 201);
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
