<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    public function index()
    {
        $donations = Donation::with('campaign')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($donations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'payment_method' => 'nullable|string|max:255',
            'reference_number' => 'required|string|max:120|unique:donations,reference_number',
            'proof_of_payment' => 'required|file|mimes:jpg,jpeg,png,pdf|max:6144',
        ]);

        $proofOfPaymentPath = null;
        if ($request->hasFile('proof_of_payment')) {
            $proofOfPaymentPath = '/storage/' . $request->file('proof_of_payment')->store('donation-payment-proofs', 'public');
        }

        $donation = Donation::create([
            'campaign_id'    => null,
            'first_name'     => $validated['first_name'],
            'last_name'      => $validated['last_name'],
            'email'          => $validated['email'],
            'amount'         => $validated['amount'],
            'payment_method' => $validated['payment_method'] ?? 'Credit Card',
            'payment_status' => 'pending',
            'reference_number' => $validated['reference_number'],
            'proof_of_payment_path' => $proofOfPaymentPath,
        ]);
        
        return response()->json([
            'message' => 'Donation recorded successfully',
            'donation' => $donation,
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'payment_status' => 'required|in:pending,verified,rejected',
            'verified_by'    => 'nullable|string|max:255',
        ]);

        $donation = Donation::findOrFail($id);
        $previousStatus = $donation->payment_status;
        $donation->payment_status = $validated['payment_status'];
        $donation->verified_by    = $validated['verified_by'] ?? null;
        $donation->verified_at    = $validated['payment_status'] === 'pending' ? null : now();
        $donation->save();

        if ($donation->campaign_id) {
            $campaign = $donation->campaign;

            if ($campaign) {
                if ($previousStatus !== 'verified' && $validated['payment_status'] === 'verified') {
                    $campaign->raised_amount += $donation->amount;
                } elseif ($previousStatus === 'verified' && $validated['payment_status'] !== 'verified') {
                    $campaign->raised_amount = max(0, $campaign->raised_amount - $donation->amount);
                }

                $campaign->save();
            }
        }

        return response()->json(['message' => 'Donation status updated.', 'donation' => $donation]);
    }

    public function getByEmail($email)
    {
        $donations = Donation::where('email', $email)
            ->with('campaign')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($donations);
    }

    public function getStatistics()
    {
        $currentYear = date('Y');
        
        // Total raised this year
        $totalRaisedThisYear = Donation::whereYear('created_at', $currentYear)->sum('amount');
        
        // Active donors (unique donors this year)
        $activeDonors = Donation::whereYear('created_at', $currentYear)
            ->distinct('email')
            ->count('email');
        
        // For scholarships, you can calculate or set a static value
        // Here I'll use a placeholder - you can adjust this based on your needs
        $scholarshipsAwarded = 1200;
        
        return response()->json([
            'total_raised_this_year' => $totalRaisedThisYear,
            'active_donors' => $activeDonors,
            'scholarships_awarded' => $scholarshipsAwarded,
        ]);
    }

    public function getAnalytics()
    {
        $allDonations = Donation::with('campaign')
            ->where('payment_status', 'verified')
            ->orderBy('created_at', 'desc')
            ->get();

        $generalDonations = Donation::whereNull('campaign_id')
            ->where('payment_status', 'verified')
            ->orderBy('created_at', 'desc')
            ->get();

        $generalTotal = $generalDonations->sum('amount');

        $campaignDonations = Donation::whereNotNull('campaign_id')
            ->where('payment_status', 'verified')
            ->with('campaign')
            ->get()
            ->groupBy('campaign_id')
            ->map(function ($donations) {
                return [
                    'campaign' => $donations->first()->campaign,
                    'total' => $donations->sum('amount'),
                    'count' => $donations->count(),
                    'donations' => $donations,
                ];
            })
            ->values();

        return response()->json([
            'all_donations' => $allDonations,
            'general_donations' => [
                'donations' => $generalDonations,
                'total' => $generalTotal,
                'count' => $generalDonations->count(),
            ],
            'campaign_donations' => $campaignDonations,
            'overall_total' => $allDonations->sum('amount'),
            'overall_count' => $allDonations->count(),
        ]);
    }
}
