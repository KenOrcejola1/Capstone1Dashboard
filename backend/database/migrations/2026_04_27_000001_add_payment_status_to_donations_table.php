<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->enum('payment_status', ['pending', 'verified', 'rejected'])->default('pending')->after('payment_method');
            $table->string('verified_by')->nullable()->after('payment_status');
            $table->timestamp('verified_at')->nullable()->after('verified_by');
        });
    }

    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropColumn(['payment_status', 'verified_by', 'verified_at']);
        });
    }
};
