<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Question;
use App\Models\Answer;

class SurveySeeder extends Seeder
{
    private function answers(array $items): array
    {
        return array_map(fn($text, $i) => ['text' => $text, 'order' => $i + 1], $items, array_keys($items));
    }

    private function likert5(array $labels = ['Not at all', 'Very little', 'Some', 'A lot', 'Very much']): array
    {
        return $this->answers($labels);
    }

    private function satisfactionScale5(): array
    {
        return $this->answers(['Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied']);
    }

    private function agreementScale5(): array
    {
        return $this->answers(['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree']);
    }

    // Store question IDs for cross-referencing conditions
    private array $questionIds = [];

    public function run(): void
    {
        $categories = $this->getCategories();

        foreach ($categories as $catData) {
            $cat = Category::create([
                'title' => $catData['title'],
                'description' => $catData['description'],
                'order' => $catData['order'],
            ]);

            foreach ($catData['questions'] as $qData) {
                $q = Question::create([
                    'category_id' => $cat->id,
                    'text' => $qData['text'],
                    'type' => $qData['type'],
                    'required' => $qData['required'] ?? false,
                    'placeholder' => $qData['placeholder'] ?? '',
                    'help_text' => $qData['help_text'] ?? '',
                    'order' => $qData['order'],
                    'condition_question_id' => $qData['condition_question_id'] ?? null,
                    'condition_operator' => $qData['condition_operator'] ?? null,
                    'condition_value' => $qData['condition_value'] ?? null,
                ]);

                if (isset($qData['ref'])) {
                    $this->questionIds[$qData['ref']] = $q->id;
                }

                foreach ($qData['answers'] ?? [] as $aData) {
                    Answer::create([
                        'question_id' => $q->id,
                        'text' => $aData['text'],
                        'order' => $aData['order'],
                    ]);
                }
            }

            // Second pass: update condition references
            foreach ($catData['questions'] as $qData) {
                if (isset($qData['condition_ref'])) {
                    $refId = $this->questionIds[$qData['condition_ref']] ?? null;
                    if ($refId) {
                        Question::where('category_id', $cat->id)
                            ->where('text', $qData['text'])
                            ->update(['condition_question_id' => $refId]);
                    }
                }
            }
        }
    }

    private function getCategories(): array
    {
        return [
            // ── IDENTIFICATION AND CALL RECORD ──
            [
                'title' => 'Identification & Call Record',
                'description' => 'Please provide your identification details. All information will be kept strictly confidential.',
                'order' => 1,
                'questions' => [
                    ['text' => 'Region Graduated From', 'type' => 'text', 'placeholder' => 'e.g. Region XI', 'order' => 1],
                    ['text' => 'Region', 'type' => 'text', 'placeholder' => 'Current region', 'order' => 2],
                    ['text' => 'Province', 'type' => 'text', 'placeholder' => 'Province', 'order' => 3],
                    ['text' => 'Municipality', 'type' => 'text', 'placeholder' => 'Municipality', 'order' => 4],
                    ['text' => 'Barangay', 'type' => 'text', 'placeholder' => 'Barangay', 'order' => 5],
                    ['text' => 'Urban/Rural', 'type' => 'radio', 'answers' => $this->answers(['Urban', 'Rural']), 'order' => 6],
                    ['text' => 'Name of Respondent', 'type' => 'text', 'placeholder' => 'Full name', 'order' => 7],
                    ['text' => 'Address', 'type' => 'text', 'placeholder' => 'Complete address', 'order' => 8],
                    ['text' => 'Geocode', 'type' => 'text', 'placeholder' => 'Geocode', 'order' => 9],
                    ['text' => 'Email', 'type' => 'text', 'placeholder' => 'email@example.com', 'order' => 10],
                    ['text' => 'Mobile No.', 'type' => 'text', 'placeholder' => '09XX XXX XXXX', 'order' => 11],
                    ['text' => 'Telephone No. (with area code)', 'type' => 'text', 'placeholder' => '(Area Code) / Number', 'order' => 12],
                ],
            ],

            // ── BLOCK A: RESPONDENT'S BACKGROUND — Personal Information ──
            [
                'title' => "Respondent's Background — Personal Information",
                'description' => 'Personal information of the respondent.',
                'order' => 2,
                'questions' => [
                    ['text' => 'A1. Month of birth', 'type' => 'number', 'placeholder' => 'Month (1–12)', 'order' => 1],
                    ['text' => 'A1. Year of birth', 'type' => 'number', 'placeholder' => 'e.g. 1995', 'order' => 2],
                    ['text' => 'A2. Age on last birthday', 'type' => 'number', 'placeholder' => 'Age in completed years', 'order' => 3],
                    ['text' => 'A3. Gender', 'type' => 'radio', 'answers' => $this->answers(['Male', 'Female']), 'order' => 4],
                    ['text' => 'A3a. Religion', 'type' => 'radio', 'answers' => $this->answers(['None', 'Roman Catholic', 'Protestant', 'Iglesia ni Cristo', 'Islam', 'Born Again', 'Others (specify)']), 'order' => 5],
                    ['text' => 'A4. Current marital status', 'type' => 'radio', 'ref' => 'A4', 'answers' => $this->answers(['Never married', 'Married', 'Living-in', 'Separated', 'Annulled', 'Divorced', 'Widowed']), 'order' => 6],
                    ['text' => 'A5. Month of first marriage', 'type' => 'number', 'placeholder' => 'Month (1–12)', 'order' => 7],
                    ['text' => 'A5. Year of first marriage', 'type' => 'number', 'placeholder' => 'e.g. 2018', 'order' => 8],
                    ['text' => 'A6. Month started living together', 'type' => 'number', 'placeholder' => 'Month (1–12)', 'order' => 9],
                    ['text' => 'A6. Year started living together', 'type' => 'number', 'placeholder' => 'e.g. 2018', 'order' => 10],
                    ['text' => 'A7. Do you intend to get married in the future?', 'type' => 'radio', 'ref' => 'A7', 'answers' => $this->answers(['Yes', 'No']), 'order' => 11],
                    ['text' => 'A8. At what age do you intend to get married?', 'type' => 'number', 'placeholder' => 'Age', 'condition_ref' => 'A7', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 12],
                    ['text' => 'A9. Reason for not intending to get married', 'type' => 'text', 'placeholder' => 'Reason', 'condition_ref' => 'A7', 'condition_operator' => 'equals', 'condition_value' => 'No', 'order' => 13],
                ],
            ],

            // ── BLOCK A: Family Information ──
            [
                'title' => 'Family Information',
                'description' => 'Information about your family background and household.',
                'order' => 3,
                'questions' => [
                    ['text' => 'A10. Do you still live with your parents?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'order' => 1],
                    ['text' => 'A11. Number of Cars owned when in college', 'type' => 'number', 'placeholder' => '0', 'help_text' => 'Household items owned when you were in college', 'order' => 2],
                    ['text' => 'A11. Number of Personal Computers', 'type' => 'number', 'placeholder' => '0', 'order' => 3],
                    ['text' => 'A11. Number of Aircon units', 'type' => 'number', 'placeholder' => '0', 'order' => 4],
                    ['text' => 'A11. Number of Component/Stereo sets', 'type' => 'number', 'placeholder' => '0', 'order' => 5],
                    ['text' => 'A11. Number of Gas Ranges', 'type' => 'number', 'placeholder' => '0', 'order' => 6],
                    ['text' => 'A11. Number of Washing Machines', 'type' => 'number', 'placeholder' => '0', 'order' => 7],
                    ['text' => 'A11. Number of Refrigerator/Freezers', 'type' => 'number', 'placeholder' => '0', 'order' => 8],
                    ['text' => 'A11. Number of VCRs', 'type' => 'number', 'placeholder' => '0', 'order' => 9],
                    ['text' => 'A11. Number of CD/VCD/DVD Players', 'type' => 'number', 'placeholder' => '0', 'order' => 10],
                    ['text' => 'A11. Number of Televisions', 'type' => 'number', 'placeholder' => '0', 'order' => 11],
                    ['text' => 'A11. Number of Karaoke sets', 'type' => 'number', 'placeholder' => '0', 'order' => 12],
                    ['text' => 'A11. Number of Landline Telephones', 'type' => 'number', 'placeholder' => '0', 'order' => 13],
                    ['text' => 'A11. Number of Cellular Phones', 'type' => 'number', 'placeholder' => '0', 'order' => 14],
                    ['text' => 'A11. Number of Radio/Radio Cassettes', 'type' => 'number', 'placeholder' => '0', 'order' => 15],
                    ['text' => "A12. Highest educational attainment of Father", 'type' => 'select', 'help_text' => 'Codes: No grade completed=00, Pre-school=01, Elementary=11-16, High School=21-24, College=31-47, Post-baccalaureate=51, Don\'t know=98', 'answers' => $this->answers(["No grade completed", "Pre-school", "Elementary Undergraduate", "Elementary Graduate", "High School Undergraduate", "High School Graduate", "Vocational/Technical", "College Undergraduate", "College Graduate", "Post-baccalaureate", "Don't know"]), 'order' => 16],
                    ['text' => "A12. Highest educational attainment of Mother", 'type' => 'select', 'answers' => $this->answers(["No grade completed", "Pre-school", "Elementary Undergraduate", "Elementary Graduate", "High School Undergraduate", "High School Graduate", "Vocational/Technical", "College Undergraduate", "College Graduate", "Post-baccalaureate", "Don't know"]), 'order' => 17],
                    ['text' => 'A13. Number of siblings', 'type' => 'number', 'ref' => 'A13', 'placeholder' => '0 (if 0, skip to A15)', 'order' => 18],
                    ['text' => 'A14. Siblings details (Name, Sex, Age, Highest Education, Currently Working) — from eldest to youngest, excluding yourself', 'type' => 'textarea', 'placeholder' => 'Name | Sex (M/F) | Age | Highest Education | Working (Yes/No)', 'help_text' => 'Enter one sibling per line', 'condition_ref' => 'A13', 'condition_operator' => 'greaterThan', 'condition_value' => '0', 'order' => 19],
                    ['text' => "A14f. Respondent's birth order among siblings", 'type' => 'number', 'placeholder' => 'e.g. 2', 'condition_ref' => 'A13', 'condition_operator' => 'greaterThan', 'condition_value' => '0', 'order' => 20],
                ],
            ],

            // ── BLOCK A: Residential Change ──
            [
                'title' => 'Residential Change',
                'description' => 'Where you lived before and after college.',
                'order' => 4,
                'questions' => [
                    ['text' => 'A15. How long have you been living continuously at current residence? (years)', 'type' => 'number', 'placeholder' => 'Years (if <1 year, enter 0)', 'order' => 1],
                    ['text' => 'A16. Previous residence type', 'type' => 'radio', 'answers' => $this->answers(['City', 'Town proper/poblacion', 'Barrio/rural', 'Abroad']), 'order' => 2],
                    ['text' => 'A17. How many years had you lived continuously at previous residence?', 'type' => 'number', 'placeholder' => 'Years (if <1 year, enter 0)', 'order' => 3],
                ],
            ],

            // ── BLOCK B: EDUCATION — College Program ──
            [
                'title' => 'Education — College Program',
                'description' => 'Information about the academic program you completed and considered.',
                'order' => 5,
                'questions' => [
                    ['text' => 'B1. What baccalaureate program/degree did you complete?', 'type' => 'text', 'placeholder' => 'e.g. BS Computer Science', 'order' => 1],
                    ['text' => 'B2. What program(s) did you consider before entering college?', 'type' => 'text', 'placeholder' => 'Program name(s)', 'order' => 2],
                    ['text' => 'B3. Was your school Public or Private?', 'type' => 'radio', 'answers' => $this->answers(['Public', 'Private']), 'order' => 3],
                    ['text' => 'B4. Was your school Sectarian or Non-sectarian?', 'type' => 'radio', 'answers' => $this->answers(['Sectarian', 'Non-sectarian']), 'order' => 4],
                    ['text' => 'B5. Student ID number', 'type' => 'text', 'placeholder' => 'Student ID', 'order' => 5],
                    ['text' => 'B6. Year started in program', 'type' => 'number', 'placeholder' => 'e.g. 2016', 'order' => 6],
                    ['text' => 'B7. Year graduated', 'type' => 'number', 'placeholder' => 'e.g. 2020', 'order' => 7],
                    ['text' => 'B8. Did you receive any honors/awards?', 'type' => 'text', 'placeholder' => 'e.g. Cum Laude, Dean\'s Lister, N/A', 'order' => 8],
                    ['text' => 'B9. Reason for choosing your program', 'type' => 'checkbox', 'answers' => $this->answers(['Academic difficulty', 'Financial', 'Employment prospects', 'Personal preference', 'Others (specify)']), 'order' => 9],
                    ['text' => 'B13. Would you have changed your course given what you know today?', 'type' => 'radio', 'ref' => 'B13', 'answers' => $this->answers(['Yes', 'No']), 'order' => 10],
                    ['text' => 'B14. Which baccalaureate program would you have taken instead?', 'type' => 'text', 'placeholder' => 'Degree program', 'condition_ref' => 'B13', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 11],
                    ['text' => 'B15. Would you have chosen another college/university?', 'type' => 'radio', 'ref' => 'B15', 'answers' => $this->answers(['Yes', 'No']), 'order' => 12],
                    ['text' => 'B16. Which college/university would you have chosen?', 'type' => 'text', 'placeholder' => 'University name', 'condition_ref' => 'B15', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 13],
                    ['text' => 'B16a. Primary reason for choosing that university', 'type' => 'radio', 'answers' => $this->answers(['Better employment opportunities', 'Proximity', 'Prestige/Branding', 'Others (specify)']), 'condition_ref' => 'B15', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 14],
                    ['text' => 'B17. Did you ever stop schooling for at least one semester?', 'type' => 'radio', 'ref' => 'B17', 'answers' => $this->answers(['Yes', 'No']), 'order' => 15],
                    ['text' => 'B17a. Reason for stopping', 'type' => 'radio', 'answers' => $this->answers(['Financial difficulty', 'Health reasons', 'Family obligations', 'Got someone pregnant', 'School penalties', 'Discipline']), 'condition_ref' => 'B17', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 16],
                ],
            ],

            // ── BLOCK B: Cost of College Education ──
            [
                'title' => 'Education — Cost of College',
                'description' => 'Information about the cost and financing of your college education.',
                'order' => 6,
                'questions' => [
                    ['text' => 'B18. Average tuition & fees per semester (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 1],
                    ['text' => 'B19. Number of semesters to complete degree', 'type' => 'number', 'placeholder' => 'e.g. 8', 'order' => 2],
                    ['text' => 'B20. Average weeks per semester', 'type' => 'number', 'placeholder' => 'e.g. 18', 'order' => 3],
                    ['text' => 'B21. Weekly allowance (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 4],
                    ['text' => 'B22. Books, uniforms, supplies per semester (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 5],
                    ['text' => 'B23. Residence while in college', 'type' => 'radio', 'answers' => $this->answers(['Own home', "Relatives' home", 'Dormitory', 'Boarding house', 'Others (specify)']), 'order' => 6],
                    ['text' => 'B24. Did you pay rent?', 'type' => 'radio', 'ref' => 'B24', 'answers' => $this->answers(['Yes', 'No']), 'order' => 7],
                    ['text' => 'B25. Monthly rental (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'condition_ref' => 'B24', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 8],
                    ['text' => 'B26. Co-curricular expenses per semester (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 9],
                    ['text' => 'B26. Extra-curricular expenses per semester (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 10],
                    ['text' => 'B27. How was college education financed?', 'type' => 'checkbox', 'help_text' => 'Select all that apply', 'answers' => $this->answers(['Support from parents', 'Support from relatives', 'Self-support', 'Scholarship', 'Loans', 'Grants-in-aid', 'Others (specify)']), 'order' => 11],
                    ['text' => 'B28. Primary source of financing', 'type' => 'text', 'placeholder' => 'Primary source', 'order' => 12],
                ],
            ],

            // ── BLOCK B: Professional / Licensure Exams ──
            [
                'title' => 'Education — Professional & Licensure Exams',
                'description' => 'Professional and government licensure examinations taken.',
                'order' => 7,
                'questions' => [
                    ['text' => 'B29. Have you taken any professional/licensure exams?', 'type' => 'radio', 'ref' => 'B29', 'answers' => $this->answers(['Yes', 'No']), 'order' => 1],
                    ['text' => 'B30. Name of exam', 'type' => 'text', 'placeholder' => 'e.g. CPA Board Exam', 'condition_ref' => 'B29', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 2],
                    ['text' => 'B31. Month/Year taken', 'type' => 'text', 'placeholder' => 'MM/YYYY', 'condition_ref' => 'B29', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 3],
                    ['text' => 'B32. Rating/Score (%)', 'type' => 'number', 'placeholder' => 'Score in %', 'condition_ref' => 'B29', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 4],
                    ['text' => 'B33. Was it taken the first time?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'condition_ref' => 'B29', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 5],
                    ['text' => 'B34. Other professional exams taken (list name, date, score)', 'type' => 'textarea', 'placeholder' => 'Exam name | Month/Year | Score', 'condition_ref' => 'B29', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 6],
                    ['text' => 'B35. Have you taken any government examinations (Civil Service, TESDA, etc.)?', 'type' => 'radio', 'ref' => 'B35', 'answers' => $this->answers(['Yes', 'No']), 'order' => 7],
                    ['text' => 'B36. Government exam name', 'type' => 'text', 'placeholder' => 'e.g. Civil Service Professional', 'condition_ref' => 'B35', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 8],
                    ['text' => 'B37. Month/Year taken', 'type' => 'text', 'placeholder' => 'MM/YYYY', 'condition_ref' => 'B35', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 9],
                    ['text' => 'B38. Rating/Score', 'type' => 'number', 'placeholder' => 'Score', 'condition_ref' => 'B35', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 10],
                    ['text' => 'B39. Was it taken the first time?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'condition_ref' => 'B35', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 11],
                ],
            ],

            // ── BLOCK B: Graduate Studies & Trainings ──
            [
                'title' => 'Education — Graduate Studies & Trainings',
                'description' => 'Post-graduate education, internships, and training programs.',
                'order' => 8,
                'questions' => [
                    ['text' => 'B41. Did you have an internship/OJT in college?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'order' => 1],
                    ['text' => 'B41a. Have you pursued graduate studies (Masters/Doctorate)?', 'type' => 'radio', 'ref' => 'B41a', 'answers' => $this->answers(['Yes', 'No']), 'order' => 2],
                    ['text' => 'B42. Reason for taking undergraduate/postgraduate studies', 'type' => 'checkbox', 'answers' => $this->answers(['Good grades', 'Parent influence', 'Peer influence', 'Role model', 'Passion', 'Employment prospects', 'Prestige', 'Availability', 'Career advancement', 'Affordability', 'Overseas opportunity', 'CHED priority course', 'Others (specify)']), 'order' => 3],
                    ['text' => 'B43. Have you taken any training/advanced studies after college?', 'type' => 'radio', 'ref' => 'B43', 'answers' => $this->answers(['Yes', 'No']), 'order' => 4],
                    ['text' => 'B44. Courses/Training attended', 'type' => 'checkbox', 'answers' => $this->answers(['Professional skills', 'General skills (foreign languages, computer, management, etc.)', 'Others (specify)']), 'condition_ref' => 'B43', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 5],
                    ['text' => 'B45. Reason for training', 'type' => 'checkbox', 'answers' => $this->answers(['Promotion', 'Professional development', 'Personal development', 'Others (specify)']), 'condition_ref' => 'B43', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 6],
                    ['text' => 'B46. Who paid for the training?', 'type' => 'checkbox', 'answers' => $this->answers(['Respondent/family', 'Employer', 'Private/NGO', 'Public/State', 'International', 'Others (specify)']), 'condition_ref' => 'B43', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 7],
                    ['text' => 'B47. Are there courses that would assist you in finding a job?', 'type' => 'radio', 'ref' => 'B47', 'answers' => $this->answers(['Yes', 'No']), 'order' => 8],
                    ['text' => 'B48. What courses/programs?', 'type' => 'text', 'placeholder' => 'Course/program names', 'condition_ref' => 'B47', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 9],
                ],
            ],

            // ── BLOCK B: Skills Development & Curriculum Assessment ──
            [
                'title' => 'Education — Skills Development & Curriculum Assessment',
                'description' => 'Rate the extent to which your program developed the following skills. Scale: 1=Not at all, 2=Very little, 3=Some, 4=A lot, 5=Very much.',
                'order' => 9,
                'questions' => [
                    ['text' => 'B49a. Critical thinking', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 1],
                    ['text' => 'B49b. Problem-solving', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 2],
                    ['text' => 'B49c. Teamwork', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 3],
                    ['text' => 'B49d. Independent learning', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 4],
                    ['text' => 'B49e. Written communication', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 5],
                    ['text' => 'B49f. Spoken communication', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 6],
                    ['text' => 'B49g. Field knowledge', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 7],
                    ['text' => 'B49h. Work-related knowledge and skills', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 8],
                    ['text' => 'B49a. Overall: Did the curriculum enable you to compete in the labor market?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'order' => 9],
                    ['text' => 'B50. What courses/trainings need to be included to compete in the labor market?', 'type' => 'checkbox', 'answers' => $this->answers(['Communication', 'IT', 'HR', 'Language', 'Occupational skills', 'CV writing', 'Internship', 'Others (specify)']), 'order' => 10],
                ],
            ],

            // ── BLOCK C: COLLEGE EXPERIENCE ──
            [
                'title' => 'College Experience',
                'description' => 'Your overall experience during college. Rate each item on a scale of 1 (Strongly disagree) to 5 (Strongly agree).',
                'order' => 10,
                'questions' => [
                    // C1. Learner Engagement
                    ['text' => 'C1a. I had a strong sense of belonging in the university', 'type' => 'radio', 'help_text' => 'Learner Engagement', 'answers' => $this->agreementScale5(), 'order' => 1],
                    ['text' => 'C1b. I felt well-prepared for my studies', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 2],
                    ['text' => 'C1c. I actively participated in school activities', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 3],
                    ['text' => 'C1d. I took on leadership roles', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 4],
                    ['text' => 'C1e. My religious affiliation was respected', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 5],
                    ['text' => 'C1f. I explored career options during college', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 6],
                    // C2. Teaching Quality
                    ['text' => 'C2a. Faculty explained concepts clearly', 'type' => 'radio', 'help_text' => 'Teaching Quality', 'answers' => $this->agreementScale5(), 'order' => 7],
                    ['text' => 'C2b. Faculty used real-world examples', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 8],
                    ['text' => 'C2c. Assignments were meaningful and relevant', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 9],
                    ['text' => 'C2d. Teaching was intellectually stimulating', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 10],
                    ['text' => 'C2e. Faculty provided useful feedback', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 11],
                    ['text' => 'C2f. Faculty were approachable', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 12],
                    ['text' => 'C2g. Faculty demonstrated subject mastery', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 13],
                    ['text' => 'C2h. Class time was used effectively', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 14],
                    // C3. Student Support Services
                    ['text' => 'C3a. Administrative staff were available and helpful', 'type' => 'radio', 'help_text' => 'Student Support Services', 'answers' => $this->agreementScale5(), 'order' => 15],
                    ['text' => 'C3b. Librarians were available and helpful', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 16],
                    ['text' => 'C3c. Counselors were available and helpful', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 17],
                    ['text' => 'C3d. Chaplains were available and helpful', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 18],
                    ['text' => 'C3e. Lab technicians were available and helpful', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 19],
                    ['text' => 'C3f. Research personnel were available and helpful', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 20],
                    // C4. Overall College Experience
                    ['text' => 'C4a. Learning was connected to real life', 'type' => 'radio', 'help_text' => 'Overall College Experience', 'answers' => $this->agreementScale5(), 'order' => 21],
                    ['text' => 'C4b. I experienced intellectual growth', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 22],
                    ['text' => 'C4c. I experienced personal growth', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 23],
                    ['text' => 'C4d. The college shaped my attitudes and values positively', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 24],
                ],
            ],

            // ── BLOCK D: EMPLOYMENT — Current Employment ──
            [
                'title' => 'Employment — Current Status',
                'description' => 'Information about your current employment status.',
                'order' => 11,
                'questions' => [
                    ['text' => 'D1. Did you work or have a business/job during the past week?', 'type' => 'radio', 'ref' => 'D1', 'answers' => $this->answers(['Yes', 'No']), 'order' => 1],
                    ['text' => 'D2. Although you did not work, do you have a job/business?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'condition_ref' => 'D1', 'condition_operator' => 'equals', 'condition_value' => 'No', 'order' => 2],
                    ['text' => 'D3. Did you look for work or try to establish a business during the past week?', 'type' => 'radio', 'ref' => 'D3', 'answers' => $this->answers(['Yes', 'No']), 'condition_ref' => 'D1', 'condition_operator' => 'equals', 'condition_value' => 'No', 'order' => 3],
                    ['text' => 'D4. Reason for not looking for work', 'type' => 'radio', 'answers' => $this->answers(['Tired/believe no work available', 'Awaiting results of application', 'Temporary illness/disability', 'Bad weather', 'Waiting for rehire/recall', 'Others (specify)']), 'condition_ref' => 'D3', 'condition_operator' => 'equals', 'condition_value' => 'No', 'order' => 4],
                    ['text' => 'D5. When was the last time you looked for work?', 'type' => 'text', 'placeholder' => 'Month/Year', 'order' => 5],
                    ['text' => 'D6. Are you available for work if offered?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'order' => 6],
                    ['text' => 'D7. Are you willing to take up work?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'order' => 7],
                    ['text' => 'D8. Occupation/Position', 'type' => 'text', 'placeholder' => 'Job title', 'order' => 8],
                    ['text' => 'D9. Name of company/employer', 'type' => 'text', 'placeholder' => 'Company name', 'order' => 9],
                    ['text' => 'D10. Company address', 'type' => 'text', 'placeholder' => 'Full address', 'order' => 10],
                    ['text' => 'D11. Line of business/industry', 'type' => 'text', 'placeholder' => 'e.g. Manufacturing, BPO, Education', 'order' => 11],
                ],
            ],

            // ── BLOCK D: Employment Details ──
            [
                'title' => 'Employment — Details',
                'description' => 'Details of your current employment situation.',
                'order' => 12,
                'questions' => [
                    ['text' => 'D12. How many months have you been in your current company?', 'type' => 'number', 'placeholder' => 'Months', 'order' => 1],
                    ['text' => 'D13. Type of employment', 'type' => 'radio', 'answers' => $this->answers(['Permanent/Regular', 'Contractual', 'Casual', 'Seasonal', 'Self-employed', 'Others (specify)']), 'order' => 2],
                    ['text' => 'D14. Normal working hours per week', 'type' => 'number', 'placeholder' => 'e.g. 40', 'order' => 3],
                    ['text' => 'D15. Basis of payment', 'type' => 'radio', 'answers' => $this->answers(['Daily', 'Weekly', 'Bi-monthly', 'Monthly', 'Piece rate', 'Commission', 'Others (specify)']), 'order' => 4],
                    ['text' => 'D16. Basic daily pay (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 5],
                    ['text' => 'D17. Monthly income (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 6],
                    ['text' => 'D18. Main reason for staying in current job', 'type' => 'radio', 'answers' => $this->answers(['Salary/Pay', 'Career growth', 'Related to field', 'Proximity to home', 'Benefits', 'Peer influence', 'Family influence', 'Others (specify)']), 'order' => 7],
                    ['text' => 'D19. Do you have additional jobs/businesses?', 'type' => 'radio', 'ref' => 'D19', 'answers' => $this->answers(['Yes', 'No']), 'order' => 8],
                    ['text' => 'D20. Additional jobs/businesses (describe)', 'type' => 'textarea', 'placeholder' => 'Describe your additional work', 'condition_ref' => 'D19', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 9],
                    ['text' => 'D21. Total working hours across all jobs per week', 'type' => 'number', 'placeholder' => 'Total hours', 'order' => 10],
                    ['text' => 'D22. Reason for working long hours (if >48 hrs/week)', 'type' => 'text', 'placeholder' => 'Reason', 'order' => 11],
                    ['text' => 'D23. Nature of current job', 'type' => 'radio', 'answers' => $this->answers(['Research (R&D)', 'Teaching/Training', 'Administrative', 'Technical', 'Clerical', 'Managerial', 'Sales', 'Production', 'Others (specify)']), 'order' => 12],
                    ['text' => 'D24. Was your education required for this job?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No', 'Not required but preferred']), 'order' => 13],
                ],
            ],

            // ── BLOCK D: First Job After College ──
            [
                'title' => 'Employment — First Job After College',
                'description' => 'Information about your first employment after graduating.',
                'order' => 13,
                'questions' => [
                    ['text' => 'D31. What was your first job after college?', 'type' => 'text', 'placeholder' => 'Job title', 'order' => 1],
                    ['text' => 'D32. What were your main tasks at that job?', 'type' => 'textarea', 'placeholder' => 'Describe your duties', 'order' => 2],
                    ['text' => 'D33. Basis of payment in first job', 'type' => 'radio', 'answers' => $this->answers(['Daily', 'Weekly', 'Bi-monthly', 'Monthly', 'Piece rate', 'Commission', 'Others (specify)']), 'order' => 3],
                    ['text' => 'D34. Basic daily pay at first job (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 4],
                    ['text' => 'D35. Monthly income at first job (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 5],
                    ['text' => 'D36. Main reason for accepting first job', 'type' => 'radio', 'answers' => $this->answers(['Salary/Pay', 'Career growth', 'Related to field of study', 'Proximity to home', 'Only job available', 'Peer influence', 'Family influence', 'Others (specify)']), 'order' => 6],
                    ['text' => 'D37. Was your first job related to your college degree?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'Somewhat', 'No']), 'order' => 7],
                    ['text' => 'D38. How long did it take to get your first job after graduation?', 'type' => 'radio', 'answers' => $this->answers(['Less than 1 month', '1 to 3 months', '4 to 6 months', '7 to 12 months', 'More than 1 year', 'Had a job before graduation']), 'order' => 8],
                ],
            ],

            // ── BLOCK D: Job History ──
            [
                'title' => 'Employment — Job History',
                'description' => 'Your complete employment history since graduation.',
                'order' => 14,
                'questions' => [
                    ['text' => 'D39. Total number of jobs/employers since you started working', 'type' => 'number', 'placeholder' => 'Number of jobs', 'order' => 1],
                    ['text' => 'D40. List your jobs BEFORE college (position, company, industry, duration)', 'type' => 'textarea', 'placeholder' => "Position | Company | Industry | Duration\ne.g. Cashier | SM | Retail | 6 months", 'order' => 2],
                    ['text' => 'D41. List your jobs AFTER college (position, company, industry, duration, nature of work, basis of pay, income)', 'type' => 'textarea', 'placeholder' => "Position | Company | Industry | Duration | Nature | Pay basis | Monthly income\ne.g. Programmer | Accenture | IT | 2 years | Technical | Monthly | 25000", 'order' => 3],
                ],
            ],

            // ── BLOCK E: PERCEPTIONS / ATTITUDES / OPINIONS ──
            [
                'title' => 'Perceptions, Attitudes & Opinions',
                'description' => 'Your satisfaction and perceptions regarding your education and employment.',
                'order' => 15,
                'questions' => [
                    ['text' => 'E1. How satisfied are you with your college education overall?', 'type' => 'radio', 'answers' => $this->satisfactionScale5(), 'order' => 1],
                    ['text' => 'E2. How relevant is your college degree to your current work?', 'type' => 'radio', 'answers' => $this->answers(['Not at all', 'Very little', 'Somewhat', 'Mostly', 'Completely']), 'order' => 2],
                    ['text' => 'E3. How well did your college prepare you for the labor market?', 'type' => 'radio', 'answers' => $this->answers(['Not at all', 'Very little', 'Somewhat', 'Mostly', 'Completely']), 'order' => 3],
                    ['text' => 'E4. Perceptions of employment opportunities in your field', 'type' => 'radio', 'answers' => $this->answers(['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']), 'order' => 4],
                    ['text' => 'E5. Graduate studies are required for career advancement', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 5],
                    ['text' => 'E6. Suggestions for improving higher education curriculum', 'type' => 'textarea', 'placeholder' => 'Your suggestions...', 'order' => 6],
                    ['text' => 'E7. Additional comments on education, employment, or skills', 'type' => 'textarea', 'placeholder' => 'Any additional comments...', 'order' => 7],
                ],
            ],
        ];
    }
}
