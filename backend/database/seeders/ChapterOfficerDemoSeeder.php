<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\ChapterOfficer;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ChapterOfficerDemoSeeder extends Seeder
{
    /**
     * Populates every chapter with a President/Vice President/Secretary
     * (plus fills out the two chapters that already had partial officer
     * lists) using freshly created demo alumni accounts. Idempotent: safe
     * to re-run — users and assignments are upserted by unique key.
     */
    public function run(): void
    {
        $password = '12345678';
        $schoolYear = '2026-2027';
        $admin = User::where('role', 'admin')->first();

        $users = [
            // Business and Management Chapter
            ['name' => 'Maria Fernanda Villanueva', 'email' => 'mariavillanueva@gmail.com', 'course' => 'BS in Business Management', 'batch_year' => '2023'],
            ['name' => 'Carlos Miguel Ramos', 'email' => 'carlosramos@gmail.com', 'course' => 'BS in Marketing', 'batch_year' => '2022'],
            ['name' => 'Isabella Santos Reyes', 'email' => 'isabellareyes@gmail.com', 'course' => 'BS in Entrepreneurship', 'batch_year' => '2024'],
            // School of Engineering and Architecture Chapter
            ['name' => 'Rafael Antonio Cruz', 'email' => 'rafaelcruz@gmail.com', 'course' => 'BS in Civil Engineering', 'batch_year' => '2021'],
            ['name' => 'Samantha Joy Bautista', 'email' => 'samanthabautista@gmail.com', 'course' => 'BS in Electrical Engineering', 'batch_year' => '2023'],
            ['name' => 'Diego Emmanuel Torres', 'email' => 'diegotorres@gmail.com', 'course' => 'BS in Mechanical Engineering', 'batch_year' => '2022'],
            // Humanities and Letters Chapter
            ['name' => 'Andrea Nicole Flores', 'email' => 'andreaflores@gmail.com', 'course' => 'AB in Communication', 'batch_year' => '2020'],
            ['name' => 'Joshua Miguel Garcia', 'email' => 'joshuagarcia@gmail.com', 'course' => 'AB in English Language', 'batch_year' => '2021'],
            ['name' => 'Katrina Mae Aquino', 'email' => 'katrinaaquino@gmail.com', 'course' => 'AB in Philosophy', 'batch_year' => '2023'],
            // Natural Sciences and Mathematics Chapter
            ['name' => 'Patricia Anne Del Rosario', 'email' => 'patriciadelrosario@gmail.com', 'course' => 'BS in Biology Major in General Biology', 'batch_year' => '2022'],
            ['name' => 'Vincent Paul Mercado', 'email' => 'vincentmercado@gmail.com', 'course' => 'BS in Mathematics', 'batch_year' => '2021'],
            ['name' => 'Cristina Mae Domingo', 'email' => 'cristinadomingo@gmail.com', 'course' => 'BS in Chemistry', 'batch_year' => '2024'],
            // Social Sciences Chapter
            ['name' => 'Gabriel Luis Navarro', 'email' => 'gabrielnavarro@gmail.com', 'course' => 'AB Sociology', 'batch_year' => '2020'],
            ['name' => 'Michelle Anne Castillo', 'email' => 'michellecastillo@gmail.com', 'course' => 'AB Major in Political Science', 'batch_year' => '2022'],
            ['name' => 'Francis Xavier Padilla', 'email' => 'francispadilla@gmail.com', 'course' => 'AB in Psychology', 'batch_year' => '2023'],
            // School of Education Chapter
            ['name' => 'Angela Marie Dizon', 'email' => 'angeladizon@gmail.com', 'course' => 'Bachelor of Elementary Education', 'batch_year' => '2021'],
            ['name' => 'Ryan Joseph Mendoza', 'email' => 'ryanmendoza@gmail.com', 'course' => 'Bachelor of Secondary Education Major in Mathematics', 'batch_year' => '2020'],
            ['name' => 'Bea Alexandra Salazar', 'email' => 'beasalazar@gmail.com', 'course' => 'Bachelor of Secondary Education Major in English', 'batch_year' => '2022'],
            // School of Nursing Chapter
            ['name' => 'Camille Rose Ocampo', 'email' => 'camilleocampo@gmail.com', 'course' => 'BS in Nursing', 'batch_year' => '2021'],
            ['name' => 'Nathaniel John Pascual', 'email' => 'nathanielpascual@gmail.com', 'course' => 'BS in Nursing', 'batch_year' => '2023'],
            ['name' => 'Kimberly Faith Aguilar', 'email' => 'kimberlyaguilar@gmail.com', 'course' => 'BS in Nursing', 'batch_year' => '2022'],
            // Computer Studies Chapter (rounding out Luigi's existing presidency)
            ['name' => 'Ethan Marcus Villareal', 'email' => 'ethanvillareal@gmail.com', 'course' => 'BS in Information Technology', 'batch_year' => '2022'],
            ['name' => 'Sophia Grace Lim', 'email' => 'sophialim@gmail.com', 'course' => 'BS in Information Systems', 'batch_year' => '2023'],
            // Accountancy Chapter (rounding out the existing President/VP)
            ['name' => 'Daniel James Yu', 'email' => 'danielyu@gmail.com', 'course' => 'BS in Accountancy', 'batch_year' => '2021'],
            ['name' => 'Alexandra Faith Chua', 'email' => 'alexandrachua@gmail.com', 'course' => 'BS in Accountancy', 'batch_year' => '2022'],
        ];

        foreach ($users as $u) {
            User::firstOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'first_name' => explode(' ', $u['name'])[0],
                    'last_name' => last(explode(' ', $u['name'])),
                    'password' => $password,
                    'role' => 'alumni',
                    'is_active' => 1,
                    'approval_status' => 'approved',
                    'course' => $u['course'],
                    'batch_year' => $u['batch_year'],
                    'email_verified_at' => Carbon::now(),
                ]
            );
        }

        $assignments = [
            ['chapter' => 'Business and Management Chapter', 'position' => 'Chapter President', 'email' => 'mariavillanueva@gmail.com'],
            ['chapter' => 'Business and Management Chapter', 'position' => 'Vice President', 'email' => 'carlosramos@gmail.com'],
            ['chapter' => 'Business and Management Chapter', 'position' => 'Secretary', 'email' => 'isabellareyes@gmail.com'],

            ['chapter' => 'School of Engineering and Architecture Chapter', 'position' => 'Chapter President', 'email' => 'rafaelcruz@gmail.com'],
            ['chapter' => 'School of Engineering and Architecture Chapter', 'position' => 'Vice President', 'email' => 'samanthabautista@gmail.com'],
            ['chapter' => 'School of Engineering and Architecture Chapter', 'position' => 'Secretary', 'email' => 'diegotorres@gmail.com'],

            ['chapter' => 'Humanities and Letters Chapter', 'position' => 'Chapter President', 'email' => 'andreaflores@gmail.com'],
            ['chapter' => 'Humanities and Letters Chapter', 'position' => 'Vice President', 'email' => 'joshuagarcia@gmail.com'],
            ['chapter' => 'Humanities and Letters Chapter', 'position' => 'Secretary', 'email' => 'katrinaaquino@gmail.com'],

            ['chapter' => 'Natural Sciences and Mathematics Chapter', 'position' => 'Chapter President', 'email' => 'patriciadelrosario@gmail.com'],
            ['chapter' => 'Natural Sciences and Mathematics Chapter', 'position' => 'Vice President', 'email' => 'vincentmercado@gmail.com'],
            ['chapter' => 'Natural Sciences and Mathematics Chapter', 'position' => 'Secretary', 'email' => 'cristinadomingo@gmail.com'],

            ['chapter' => 'Social Sciences Chapter', 'position' => 'Chapter President', 'email' => 'gabrielnavarro@gmail.com'],
            ['chapter' => 'Social Sciences Chapter', 'position' => 'Vice President', 'email' => 'michellecastillo@gmail.com'],
            ['chapter' => 'Social Sciences Chapter', 'position' => 'Secretary', 'email' => 'francispadilla@gmail.com'],

            ['chapter' => 'School of Education Chapter', 'position' => 'Chapter President', 'email' => 'angeladizon@gmail.com'],
            ['chapter' => 'School of Education Chapter', 'position' => 'Vice President', 'email' => 'ryanmendoza@gmail.com'],
            ['chapter' => 'School of Education Chapter', 'position' => 'Secretary', 'email' => 'beasalazar@gmail.com'],

            ['chapter' => 'School of Nursing Chapter', 'position' => 'Chapter President', 'email' => 'camilleocampo@gmail.com'],
            ['chapter' => 'School of Nursing Chapter', 'position' => 'Vice President', 'email' => 'nathanielpascual@gmail.com'],
            ['chapter' => 'School of Nursing Chapter', 'position' => 'Secretary', 'email' => 'kimberlyaguilar@gmail.com'],

            ['chapter' => 'Computer Studies Chapter', 'position' => 'Vice President', 'email' => 'ethanvillareal@gmail.com'],
            ['chapter' => 'Computer Studies Chapter', 'position' => 'Secretary', 'email' => 'sophialim@gmail.com'],

            ['chapter' => 'Accountancy Chapter', 'position' => 'Secretary', 'email' => 'danielyu@gmail.com'],
            ['chapter' => 'Accountancy Chapter', 'position' => 'Treasurer', 'email' => 'alexandrachua@gmail.com'],
        ];

        foreach ($assignments as $a) {
            $chapter = Chapter::where('name', $a['chapter'])->first();
            $user = User::where('email', $a['email'])->first();
            if (!$chapter || !$user) {
                continue;
            }

            ChapterOfficer::updateOrCreate(
                [
                    'chapter_id' => $chapter->id,
                    'user_id' => $user->id,
                    'school_year' => $schoolYear,
                    'position' => $a['position'],
                ],
                [
                    'status' => 'approved',
                    'is_active' => true,
                    'assigned_by' => $admin?->id,
                    'reviewed_by' => $admin?->id,
                    'reviewed_at' => Carbon::now(),
                ]
            );
        }
    }
}
