<?php

namespace Database\Seeders;

use App\Models\Chapter;
use Illuminate\Database\Seeder;

class ChapterSeeder extends Seeder
{
    public function run(): void
    {
        $chapters = [
            ['name' => 'CS Cluster Chapter'],
            ['name' => 'SBG Chapter'],
            ['name' => 'Engineering Chapter'],
        ];

        foreach ($chapters as $chapter) {
            Chapter::firstOrCreate(['name' => $chapter['name']], $chapter);
        }
    }
}
