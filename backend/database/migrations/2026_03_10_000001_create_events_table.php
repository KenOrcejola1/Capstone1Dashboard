<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->string('date');          // stored as 'YYYY-MM-DD' for real dates, or duration string for teaching opps
            $table->string('time_display');  // human-readable schedule string
            $table->string('location')->nullable();
            $table->integer('participants')->default(0);
            $table->text('description');
            $table->string('image_path')->nullable(); // uploaded file path
            $table->string('image_key')->nullable();  // key mapping to a frontend static asset
            $table->string('tab');           // Upcoming Events, Past Events, Teaching Opportunities, Seminars & Workshops, Alumni Proposals
            $table->string('posted_by')->nullable();
            $table->string('compensation')->nullable();
            $table->string('status')->nullable(); // Pending, Approved, Rejected (for proposals)
            $table->string('submitted_by')->nullable();
            $table->string('submitted_by_email')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
