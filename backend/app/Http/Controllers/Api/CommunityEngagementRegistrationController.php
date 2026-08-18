<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommunityEngagementActivity;
use App\Models\CommunityEngagementRegistration;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CommunityEngagementRegistrationController extends Controller
{
    public function index(Request $request)
    {
        $query = CommunityEngagementRegistration::with('activity')->latest();

        if ($request->filled('activity_id')) {
            $query->where('activity_id', $request->integer('activity_id'));
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->query('payment_status'));
        }

        if ($request->filled('email')) {
            $query->where('email', $request->query('email'));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'activity_id' => ['required', 'exists:community_engagement_activities,id'],
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'notes' => ['nullable', 'string'],
            'payment_method' => ['required', Rule::in(['gcash', 'bank_transfer', 'cash'])],
            'reference_number' => ['required', 'string', 'max:120', 'unique:community_engagement_registrations,reference_number'],
            'proof_of_payment' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:6144'],
        ]);

        $activity = CommunityEngagementActivity::findOrFail($validated['activity_id']);

        if (!$activity->registration_open) {
            return response()->json(['message' => 'Registration is currently closed for this activity.'], 422);
        }

        $existingCount = CommunityEngagementRegistration::where('activity_id', $activity->id)->count();
        if ($activity->participant_limit !== null && $existingCount >= $activity->participant_limit) {
            return response()->json(['message' => 'Participant limit reached for this activity.'], 422);
        }

        $alreadyRegistered = CommunityEngagementRegistration::where('activity_id', $activity->id)
            ->where('email', $validated['email'])
            ->exists();

        if ($alreadyRegistered) {
            return response()->json(['message' => 'You are already registered for this activity.'], 422);
        }

        $fee = (float) $activity->fee_amount;
        $method = $validated['payment_method'];
        $reference = $validated['reference_number'];
        if ($fee > 0 && !$method) {
            return response()->json(['message' => 'Payment method is required for paid activities.'], 422);
        }

        if (!$reference) {
            return response()->json(['message' => 'Reference number is required for GCash and Bank Transfer.'], 422);
        }

        if (!$request->hasFile('proof_of_payment')) {
            return response()->json(['message' => 'Receipt upload is required before joining the event.'], 422);
        }

        if ($request->hasFile('proof_of_payment')) {
            $validated['proof_of_payment_path'] = '/storage/' . $request->file('proof_of_payment')->store('community-payment-proofs', 'public');
        }

        $validated['amount'] = $fee;
        // New registrations always require admin verification before acceptance.
        $validated['payment_status'] = 'pending';

        $registration = CommunityEngagementRegistration::create($validated);

        return response()->json([
            'message' => 'Registration submitted successfully.',
            'payment_instructions' => $activity->payment_instructions,
            'registration' => $registration->load('activity'),
        ], 201);
    }

    public function updatePaymentStatus(Request $request, $id)
    {
        $data = $request->validate([
            'payment_status' => ['required', Rule::in(['pending', 'verified', 'rejected'])],
            'payment_verified_by' => ['nullable', 'string', 'max:255'],
        ]);

        $registration = CommunityEngagementRegistration::findOrFail($id);
        $registration->payment_status = $data['payment_status'];
        $registration->payment_verified_by = $data['payment_verified_by'] ?? null;
        $registration->payment_verified_at = $data['payment_status'] === 'verified' ? now() : null;
        $registration->save();

        return response()->json($registration->fresh()->load('activity'));
    }
}
