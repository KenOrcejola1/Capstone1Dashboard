<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('community_engagement_activities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('venue')->nullable();
            $table->dateTime('schedule_start')->nullable();
            $table->dateTime('schedule_end')->nullable();
            $table->unsignedInteger('participant_limit')->nullable();
            $table->boolean('registration_open')->default(true);
            $table->string('poster_image_path')->nullable();
            $table->decimal('fee_amount', 12, 2)->default(0);
            $table->text('payment_instructions')->nullable();
            $table->enum('status', ['active', 'cancelled'])->default('active');
            $table->string('created_by_email')->nullable();
            $table->timestamps();
        });

        Schema::create('community_engagement_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('community_engagement_activities')->cascadeOnDelete();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 40)->nullable();
            $table->text('notes')->nullable();
            $table->enum('payment_method', ['gcash', 'bank_transfer', 'cash'])->nullable();
            $table->string('reference_number')->nullable()->unique();
            $table->string('proof_of_payment_path')->nullable();
            $table->enum('payment_status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->enum('registration_status', ['confirmed', 'cancelled'])->default('confirmed');
            $table->decimal('amount', 12, 2)->default(0);
            $table->timestamp('payment_verified_at')->nullable();
            $table->string('payment_verified_by')->nullable();
            $table->timestamps();

            $table->unique(['activity_id', 'email']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('community_engagement_registrations');
        Schema::dropIfExists('community_engagement_activities');
    }
};
