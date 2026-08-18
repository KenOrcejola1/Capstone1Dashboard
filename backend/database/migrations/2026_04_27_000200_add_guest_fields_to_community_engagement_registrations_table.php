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
        Schema::table('community_engagement_registrations', function (Blueprint $table) {
            $table->string('guest_name')->nullable()->after('email');
            $table->string('guest_email')->nullable()->after('guest_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('community_engagement_registrations', function (Blueprint $table) {
            $table->dropColumn(['guest_name', 'guest_email']);
        });
    }
};
