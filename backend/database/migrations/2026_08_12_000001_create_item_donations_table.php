<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item_donations', function (Blueprint $table) {
            $table->id();
            $table->string('donor_first_name');
            $table->string('donor_last_name');
            $table->string('donor_email');
            $table->string('donor_phone', 40)->nullable();
            $table->string('item_name');
            $table->string('category');
            $table->text('description')->nullable();
            $table->unsignedInteger('quantity')->default(1);
            $table->enum('condition', ['new', 'like_new', 'good', 'fair'])->default('good');
            $table->enum('delivery_method', ['drop_off', 'pickup_request'])->default('drop_off');
            $table->string('pickup_address')->nullable();
            $table->string('photo_path')->nullable();
            $table->enum('status', ['pending', 'received', 'rejected'])->default('pending');
            $table->string('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_donations');
    }
};
