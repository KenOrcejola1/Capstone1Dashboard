<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ItemDonation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ItemDonationController extends Controller
{
    public function index(Request $request)
    {
        $query = ItemDonation::latest();

        if ($request->query('role') === 'admin') {
            return response()->json($query->get());
        }

        if ($request->filled('email')) {
            return response()->json($query->where('donor_email', $request->query('email'))->get());
        }

        return response()->json([]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'donor_first_name' => ['required', 'string', 'max:255'],
            'donor_last_name' => ['required', 'string', 'max:255'],
            'donor_email' => ['required', 'email', 'max:255'],
            'donor_phone' => ['nullable', 'string', 'max:40'],
            'item_name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'quantity' => ['required', 'integer', 'min:1'],
            'condition' => ['required', Rule::in(['new', 'like_new', 'good', 'fair'])],
            'delivery_method' => ['required', Rule::in(['drop_off', 'pickup_request'])],
            'pickup_address' => ['required_if:delivery_method,pickup_request', 'nullable', 'string', 'max:255'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo_path'] = '/storage/' . $request->file('photo')->store('item-donation-photos', 'public');
        }

        $validated['status'] = 'pending';

        $itemDonation = ItemDonation::create($validated);

        return response()->json([
            'message' => 'Item donation submitted successfully.',
            'item_donation' => $itemDonation,
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'received', 'rejected'])],
            'admin_notes' => ['nullable', 'string', 'max:255'],
        ]);

        $itemDonation = ItemDonation::findOrFail($id);
        $itemDonation->status = $validated['status'];
        $itemDonation->admin_notes = $validated['admin_notes'] ?? $itemDonation->admin_notes;
        $itemDonation->save();

        return response()->json($itemDonation->fresh());
    }
}
