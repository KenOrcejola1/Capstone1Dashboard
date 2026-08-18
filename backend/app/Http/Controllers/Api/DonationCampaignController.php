<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DonationCampaign;
use App\Models\Donation;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DonationCampaignController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->query('role');
        
        // Auto-deactivate expired campaigns
        DonationCampaign::where('is_active', true)
            ->where('end_date', '<', Carbon::now()->startOfDay())
            ->update(['is_active' => false]);
        
        if ($role === 'admin') {
            // Admin sees all campaigns
            $campaigns = DonationCampaign::orderBy('created_at', 'desc')->get();
        } else {
            // Regular users only see active campaigns
            $campaigns = DonationCampaign::where('is_active', true)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        $campaigns->each(function (DonationCampaign $campaign) {
            $verifiedRaised = (float) $campaign->donations()->where('payment_status', 'verified')->sum('amount');
            $verifiedDonors = $campaign->donations()->where('payment_status', 'verified')->distinct('email')->count('email');

            $campaign->raised_amount = $verifiedRaised;
            $campaign->setAttribute('donors_count', $verifiedDonors);
        });
        
        return response()->json($campaigns);
    }

    public function show($id)
    {
        $campaign = DonationCampaign::findOrFail($id);

        $campaign->raised_amount = (float) $campaign->donations()->where('payment_status', 'verified')->sum('amount');
        $campaign->setAttribute('donors_count', $campaign->donations()->where('payment_status', 'verified')->distinct('email')->count('email'));

        return response()->json($campaign);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string|max:255',
            'image_url' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'goal_amount' => 'required|numeric|min:1',
            'end_date' => 'required|date',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('campaign-images', $imageName, 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        $campaign = DonationCampaign::create($validated);
        
        return response()->json($campaign, 201);
    }

    public function update(Request $request, $id)
    {
        $campaign = DonationCampaign::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string|max:255',
            'image_url' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'goal_amount' => 'required|numeric|min:1',
            'end_date' => 'required|date',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($campaign->image_url && \Storage::disk('public')->exists(str_replace('/storage/', '', $campaign->image_url))) {
                \Storage::disk('public')->delete(str_replace('/storage/', '', $campaign->image_url));
            }
            
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('campaign-images', $imageName, 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        $campaign->update($validated);
        
        return response()->json($campaign);
    }

    public function destroy($id)
    {
        $campaign = DonationCampaign::findOrFail($id);
        $campaign->delete();
        
        return response()->json(['message' => 'Campaign deleted successfully']);
    }

    public function toggleActive($id)
    {
        $campaign = DonationCampaign::findOrFail($id);
        $campaign->is_active = !$campaign->is_active;
        $campaign->save();
        
        return response()->json($campaign);
    }

    public function addDonation(Request $request, $id)
    {
        $campaign = DonationCampaign::findOrFail($id);
        
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

        $donation = new Donation([
            'campaign_id'    => $campaign->id,
            'first_name'     => $validated['first_name'],
            'last_name'      => $validated['last_name'],
            'email'          => $validated['email'],
            'amount'         => $validated['amount'],
            'payment_method' => $validated['payment_method'] ?? 'Credit Card',
            'payment_status' => 'pending',
            'reference_number' => $validated['reference_number'],
            'proof_of_payment_path' => $proofOfPaymentPath,
        ]);
        
        $donation->save();
        
        return response()->json([
            'message' => 'Donation recorded successfully',
            'donation' => $donation,
            'campaign' => $campaign,
        ], 201);
    }

    public function getDonors($id)
    {
        $campaign = DonationCampaign::findOrFail($id);
        $donors = $campaign->donations()
            ->where('payment_status', 'verified')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($donors);
    }
}
