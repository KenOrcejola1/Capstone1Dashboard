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
        // Postgres emulates enum() as varchar + CHECK, so the allowed values
        // are swapped via a raw constraint replacement rather than Schema::table()
        // (see 2026_03_04_000002_make_optional_user_fields_nullable.php for why).
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_religion_check');
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_religion_check CHECK (religion IN ('none', 'roman_catholic', 'protestant', 'iglesia_ni_cristo', 'islam', 'born_again', 'other'))");
        } else {
            Schema::table('users', function (Blueprint $table) {
                $table->enum('religion', ['none', 'roman_catholic', 'protestant', 'iglesia_ni_cristo', 'islam', 'born_again', 'other'])->nullable()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_religion_check');
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_religion_check CHECK (religion IN ('roman_catholic', 'protestant', 'iglesia_ni_cristo', 'islam', 'born_again_christian', 'buddhist', 'other', 'prefer_not_to_say'))");
        } else {
            Schema::table('users', function (Blueprint $table) {
                $table->enum('religion', ['roman_catholic', 'protestant', 'iglesia_ni_cristo', 'islam', 'born_again_christian', 'buddhist', 'other', 'prefer_not_to_say'])->nullable()->change();
            });
        }
    }
};
