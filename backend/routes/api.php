<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DonationCampaignController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\EventController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'Laravel API working'
    ]);
});

// Authentication API
Route::post('/login', [UserController::class, 'login']); // Login/authenticate user

// User Management API
Route::get('/users', [UserController::class, 'index']); // Get all users
Route::post('/users', [UserController::class, 'store']); // Create new user
Route::get('/users/pending/list', [UserController::class, 'getPendingUsers']); // Get pending approval users (must be before wildcard route)
Route::get('/users/{email}', [UserController::class, 'show']); // Get user by email
Route::put('/users/{email}', [UserController::class, 'update']); // Update user by email
Route::put('/users/id/{id}', [UserController::class, 'updateById']); // Update user by ID
Route::delete('/users/{id}', [UserController::class, 'destroy']); // Delete user by ID
Route::patch('/users/{id}/toggle-active', [UserController::class, 'toggleActive']); // Block/Unblock user
Route::patch('/users/{id}/approve', [UserController::class, 'approveUser']); // Approve user
Route::patch('/users/{id}/disapprove', [UserController::class, 'disapproveUser']); // Disapprove user

// Donation Campaign API
Route::get('/campaigns', [DonationCampaignController::class, 'index']); // Get all campaigns
Route::get('/campaigns/{id}', [DonationCampaignController::class, 'show']); // Get single campaign
Route::post('/campaigns', [DonationCampaignController::class, 'store']); // Create campaign (admin)
Route::put('/campaigns/{id}', [DonationCampaignController::class, 'update']); // Update campaign (admin)
Route::delete('/campaigns/{id}', [DonationCampaignController::class, 'destroy']); // Delete campaign (admin)
Route::post('/campaigns/{id}/donate', [DonationCampaignController::class, 'addDonation']); // Add donation to campaign
Route::patch('/campaigns/{id}/toggle-active', [DonationCampaignController::class, 'toggleActive']); // Toggle campaign status (admin)
Route::get('/campaigns/{id}/donors', [DonationCampaignController::class, 'getDonors']); // Get donors for campaign (admin)

// Donation API
Route::post('/donations', [DonationController::class, 'store']); // Create general donation
Route::get('/donations', [DonationController::class, 'index']); // Get all donations (admin)
Route::get('/donations/email/{email}', [DonationController::class, 'getByEmail']); // Get donations by email
Route::get('/donations/statistics', [DonationController::class, 'getStatistics']); // Get donation statistics
Route::get('/donations/analytics', [DonationController::class, 'getAnalytics']); // Get detailed analytics (admin)

// Events / Engagement API
Route::get('/events', [EventController::class, 'index']);                          // List events (optional ?tab= filter)
Route::post('/events/proposals', [EventController::class, 'submitProposal']);      // Alumni submits proposal (must be before {id} wildcard)
Route::get('/events/my-proposals/{email}', [EventController::class, 'getMyProposals']); // Alumni views own proposals
Route::post('/events', [EventController::class, 'store']);                         // Admin creates event
Route::post('/events/{id}/update', [EventController::class, 'update']);            // Admin updates event (FormData)
Route::delete('/events/{id}', [EventController::class, 'destroy']);                // Admin deletes event
Route::patch('/events/{id}/approve', [EventController::class, 'approve']);         // Admin approves proposal
Route::patch('/events/{id}/reject', [EventController::class, 'reject']);           // Admin rejects proposal
Route::post('/events/{id}/register', [EventController::class, 'register']);        // Register for event
