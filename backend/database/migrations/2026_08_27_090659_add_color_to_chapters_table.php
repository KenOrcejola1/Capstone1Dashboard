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
        Schema::table('chapters', function (Blueprint $table) {
            // Hex color (e.g. "#7C3AED") shown on the chapter's header on the
            // Alumni Chapters page. Nullable so existing/future rows without
            // one just fall back to the default theme color in the frontend.
            $table->string('color', 7)->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chapters', function (Blueprint $table) {
            $table->dropColumn('color');
        });
    }
};
