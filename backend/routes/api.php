<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DonationCampaignController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\CommunityEngagementActivityController;
use App\Http\Controllers\Api\CommunityEngagementRegistrationController;
use App\Http\Controllers\Api\CommunityEngagementAnalyticsController;
use App\Http\Controllers\Api\VolunteerEventController;
use App\Http\Controllers\Api\VolunteerRegistrationController;
use App\Http\Controllers\Api\ItemDonationController;

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
Route::get('/users/analytics/course-approvals', [UserController::class, 'getCourseAnalytics']); // Alumni analytics by course (must be before wildcard route)
Route::get('/users/{email}', [UserController::class, 'show']); // Get user by email
Route::put('/users/{email}', [UserController::class, 'update']); // Update user by email
Route::post('/users/{email}/profile-image', [UserController::class, 'uploadProfileImage']); // Upload profile image by email
Route::post('/users/{email}/change-password', [UserController::class, 'changePassword']); // Change password by email
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
Route::patch('/donations/{id}/status', [DonationController::class, 'updateStatus']); // Update payment status (admin)

// Community Engagement API
Route::get('/community/activities', [CommunityEngagementActivityController::class, 'index']);
Route::post('/community/activities', [CommunityEngagementActivityController::class, 'store']);
Route::get('/community/activities/{id}', [CommunityEngagementActivityController::class, 'show']);
Route::put('/community/activities/{id}', [CommunityEngagementActivityController::class, 'update']);
Route::post('/community/activities/{id}', [CommunityEngagementActivityController::class, 'update']);
Route::delete('/community/activities/{id}', [CommunityEngagementActivityController::class, 'destroy']);
Route::patch('/community/activities/{id}/registration', [CommunityEngagementActivityController::class, 'setRegistrationOpen']);
Route::patch('/community/activities/{id}/participant-limit', [CommunityEngagementActivityController::class, 'setParticipantLimit']);

Route::get('/community/registrations', [CommunityEngagementRegistrationController::class, 'index']);
Route::post('/community/registrations', [CommunityEngagementRegistrationController::class, 'store']);
Route::patch('/community/registrations/{id}/payment-status', [CommunityEngagementRegistrationController::class, 'updatePaymentStatus']);

Route::get('/community/analytics/overview', [CommunityEngagementAnalyticsController::class, 'overview']);
Route::get('/community/analytics/activity/{activityId}', [CommunityEngagementAnalyticsController::class, 'activity']);
Route::get('/community/analytics/export', [CommunityEngagementAnalyticsController::class, 'export']);

// Volunteer Events API
Route::get('/volunteer/events', [VolunteerEventController::class, 'index']);
Route::post('/volunteer/events', [VolunteerEventController::class, 'store']);
Route::get('/volunteer/events/{id}', [VolunteerEventController::class, 'show']);
Route::put('/volunteer/events/{id}', [VolunteerEventController::class, 'update']);
Route::delete('/volunteer/events/{id}', [VolunteerEventController::class, 'destroy']);

Route::get('/volunteer/registrations', [VolunteerRegistrationController::class, 'index']);
Route::post('/volunteer/registrations', [VolunteerRegistrationController::class, 'store']);
Route::delete('/volunteer/registrations/{id}', [VolunteerRegistrationController::class, 'destroy']);

// Item (In-Kind) Donations API
Route::get('/item-donations', [ItemDonationController::class, 'index']);
Route::post('/item-donations', [ItemDonationController::class, 'store']);
Route::patch('/item-donations/{id}/status', [ItemDonationController::class, 'updateStatus']);
