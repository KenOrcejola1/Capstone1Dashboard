<?php

namespace Database\Seeders;

use App\Models\Chapter;
use Illuminate\Database\Seeder;

class ChapterSeeder extends Seeder
{
    public function run(): void
    {
        // Rename in place (rather than delete + recreate) so any officer
        // assignments already pointing at these chapters keep working.
        $renames = [
            'CS Cluster Chapter' => 'Computer Studies Chapter',
            'Engineering Chapter' => 'School of Engineering and Architecture Chapter',
            'SBG Chapter' => 'Business and Management Chapter',
        ];
        foreach ($renames as $oldName => $newName) {
            Chapter::where('name', $oldName)->update(['name' => $newName]);
        }

        $chapters = [
            ['name' => 'Computer Studies Chapter', 'color' => '#7C3AED'],
            ['name' => 'School of Engineering and Architecture Chapter', 'color' => '#F97316'],
            ['name' => 'Business and Management Chapter', 'color' => '#1E3A8A'],
            ['name' => 'Humanities and Letters Chapter', 'color' => '#DC2626'],
            ['name' => 'Natural Sciences and Mathematics Chapter', 'color' => '#16A34A'],
            ['name' => 'Social Sciences Chapter', 'color' => '#DB2777'],
            ['name' => 'Accountancy Chapter', 'color' => '#EAB308'],
            ['name' => 'School of Education Chapter', 'color' => '#0D9488'],
            ['name' => 'School of Nursing Chapter', 'color' => '#000000'],
        ];

        foreach ($chapters as $chapter) {
            Chapter::updateOrCreate(['name' => $chapter['name']], $chapter);
        }
    }
}
