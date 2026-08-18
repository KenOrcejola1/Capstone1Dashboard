<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            if (!Schema::hasColumn('donations', 'reference_number')) {
                $table->string('reference_number')->nullable()->unique()->after('payment_method');
            }

            if (!Schema::hasColumn('donations', 'proof_of_payment_path')) {
                $table->string('proof_of_payment_path')->nullable()->after('reference_number');
            }
        });
    }

    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropColumn(['reference_number', 'proof_of_payment_path']);
        });
    }
};