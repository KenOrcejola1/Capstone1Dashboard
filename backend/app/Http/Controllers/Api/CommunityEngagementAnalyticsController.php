<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommunityEngagementActivity;
use App\Models\CommunityEngagementRegistration;
use App\Models\Donation;
use App\Models\DonationCampaign;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CommunityEngagementAnalyticsController extends Controller
{
    public function overview(Request $request)
    {
        $verifiedFees = (float) CommunityEngagementRegistration::where('payment_status', 'verified')->sum('amount');
        $donationTotal = (float) Donation::sum('amount');
        $pendingPayments = CommunityEngagementRegistration::where('payment_status', 'pending')->count();

        $mostActiveCampaigns = DonationCampaign::query()
            ->select('title')
            ->selectRaw("'campaign' as type")
            ->withCount(['donations as engagement_count'])
            ->orderByDesc('engagement_count')
            ->limit(3)
            ->get();

        $mostActiveActivities = CommunityEngagementActivity::query()
            ->select('title')
            ->selectRaw("'activity' as type")
            ->withCount('registrations')
            ->orderByDesc('registrations_count')
            ->limit(3)
            ->get()
            ->map(function ($activity) {
                return [
                    'title' => $activity->title,
                    'type' => 'activity',
                    'engagement_count' => $activity->registrations_count,
                ];
            });

        $mostActiveProjects = collect($mostActiveCampaigns->toArray())
            ->concat($mostActiveActivities)
            ->sortByDesc('engagement_count')
            ->take(6)
            ->values();

        $monthly = $this->buildMonthlyReports();

        return response()->json([
            'totals' => [
                'total_donations' => $donationTotal,
                'total_funds_raised' => $donationTotal + $verifiedFees,
                'total_registrants' => CommunityEngagementRegistration::count(),
                'pending_payments' => $pendingPayments,
                'verified_payments' => CommunityEngagementRegistration::where('payment_status', 'verified')->count(),
                'active_activities' => CommunityEngagementActivity::where('status', 'active')->count(),
            ],
            'most_active_projects' => $mostActiveProjects,
            'monthly_reports' => $monthly,
        ]);
    }

    public function activity($activityId)
    {
        $activity = CommunityEngagementActivity::with('registrations')->findOrFail($activityId);

        $registrations = $activity->registrations;

        return response()->json([
            'activity' => $activity,
            'stats' => [
                'total_registrants' => $registrations->count(),
                'verified_payments' => $registrations->where('payment_status', 'verified')->count(),
                'pending_payments' => $registrations->where('payment_status', 'pending')->count(),
                'rejected_payments' => $registrations->where('payment_status', 'rejected')->count(),
                'amount_raised' => (float) $registrations->where('payment_status', 'verified')->sum('amount'),
            ],
            'registrations' => $registrations,
        ]);
    }

    public function export(Request $request)
    {
        $overview = $this->overview($request)->getData(true);

        $lines = [];
        $lines[] = 'Metric,Value';
        foreach ($overview['totals'] as $metric => $value) {
            $lines[] = $metric . ',' . $value;
        }

        $lines[] = '';
        $lines[] = 'Top Project/Activity,Type,Engagement Count';
        foreach ($overview['most_active_projects'] as $project) {
            $lines[] = sprintf('%s,%s,%s', $this->escapeCsv($project['title']), $project['type'], $project['engagement_count']);
        }

        $lines[] = '';
        $lines[] = 'Month,Donations,Verified Fees,Total Raised,Registrants';
        foreach ($overview['monthly_reports'] as $month) {
            $lines[] = implode(',', [
                $month['month'],
                $month['donations'],
                $month['verified_fees'],
                $month['total_raised'],
                $month['registrants'],
            ]);
        }

        $csv = implode("\n", $lines);
        $fileName = 'community-analytics-' . now()->format('Ymd-His') . '.csv';

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }

    private function buildMonthlyReports(): array
    {
        $year = (int) now()->year;
        $months = [];

        for ($m = 1; $m <= 12; $m++) {
            $start = Carbon::create($year, $m, 1)->startOfMonth();
            $end = (clone $start)->endOfMonth();

            $donations = (float) Donation::whereBetween('created_at', [$start, $end])->sum('amount');
            $fees = (float) CommunityEngagementRegistration::where('payment_status', 'verified')
                ->whereBetween('updated_at', [$start, $end])
                ->sum('amount');
            $registrants = CommunityEngagementRegistration::whereBetween('created_at', [$start, $end])->count();

            $months[] = [
                'month' => $start->format('M'),
                'donations' => $donations,
                'verified_fees' => $fees,
                'total_raised' => $donations + $fees,
                'registrants' => $registrants,
            ];
        }

        return $months;
    }

    private function escapeCsv(string $value): string
    {
        if (str_contains($value, ',') || str_contains($value, '"')) {
            return '"' . str_replace('"', '""', $value) . '"';
        }

        return $value;
    }
}
