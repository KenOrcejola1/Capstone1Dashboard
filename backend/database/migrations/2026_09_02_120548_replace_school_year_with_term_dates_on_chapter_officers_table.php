<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('chapter_officers', function (Blueprint $table) {
            $table->date('term_start_date')->nullable()->after('school_year');
            $table->date('term_end_date')->nullable()->after('term_start_date');
        });

        // Backfill from the old "YYYY-YYYY" school year string using the PH
        // school year convention (roughly August to May).
        DB::table('chapter_officers')->get(['id', 'school_year'])->each(function ($row) {
            if (!preg_match('/^(\d{4})-(\d{4})$/', (string) $row->school_year, $matches)) {
                return;
            }

            DB::table('chapter_officers')->where('id', $row->id)->update([
                'term_start_date' => "{$matches[1]}-08-01",
                'term_end_date' => "{$matches[2]}-05-31",
            ]);
        });

        // Anything that didn't match the pattern (or had no school_year)
        // still needs a non-null date to satisfy the NOT NULL below.
        DB::table('chapter_officers')->whereNull('term_start_date')->update([
            'term_start_date' => DB::raw('created_at::date'),
            'term_end_date' => DB::raw("(created_at::date + interval '1 year')::date"),
        ]);

        Schema::table('chapter_officers', function (Blueprint $table) {
            $table->date('term_start_date')->nullable(false)->change();
            $table->date('term_end_date')->nullable(false)->change();
        });

        Schema::table('chapter_officers', function (Blueprint $table) {
            $table->dropUnique(['chapter_id', 'user_id', 'school_year', 'position']);
        });

        Schema::table('chapter_officers', function (Blueprint $table) {
            $table->dropColumn('school_year');
        });

        Schema::table('chapter_officers', function (Blueprint $table) {
            $table->unique(['chapter_id', 'user_id', 'term_start_date', 'position'], 'chapter_officers_term_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chapter_officers', function (Blueprint $table) {
            $table->dropUnique('chapter_officers_term_unique');
            $table->string('school_year')->nullable()->after('position');
        });

        DB::table('chapter_officers')->get(['id', 'term_start_date', 'term_end_date'])->each(function ($row) {
            $startYear = date('Y', strtotime($row->term_start_date));
            $endYear = date('Y', strtotime($row->term_end_date));
            DB::table('chapter_officers')->where('id', $row->id)->update([
                'school_year' => "{$startYear}-{$endYear}",
            ]);
        });

        Schema::table('chapter_officers', function (Blueprint $table) {
            $table->string('school_year')->nullable(false)->change();
            $table->dropColumn(['term_start_date', 'term_end_date']);
        });

        Schema::table('chapter_officers', function (Blueprint $table) {
            $table->unique(['chapter_id', 'user_id', 'school_year', 'position']);
        });
    }
};
