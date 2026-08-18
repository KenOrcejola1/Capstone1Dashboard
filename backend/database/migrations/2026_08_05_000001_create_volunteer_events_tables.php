<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('volunteer_events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('location')->nullable();
            $table->dateTime('event_date')->nullable();
            $table->dateTime('registration_deadline');
            $table->unsignedInteger('volunteer_slots')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('created_by_email')->nullable();
            $table->timestamps();
        });

        Schema::create('volunteer_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('volunteer_event_id')->constrained('volunteer_events')->cascadeOnDelete();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 40)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->unique(['volunteer_event_id', 'email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('volunteer_registrations');
        Schema::dropIfExists('volunteer_events');
    }
};
