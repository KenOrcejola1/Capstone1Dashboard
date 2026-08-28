@extends('layouts.app')

@section('title', 'Responses - Admin')

@section('content')
<style>
    @import url('https://fonts.bunny.net/css?family=cinzel:400,700,800|nunito-sans:300,400,500,600,700,800');

    .admin-shell {
        --admin-blue: #09107a;
        --admin-gold: #f5b800;
        --admin-ink: #10233f;
        --admin-muted: #5a6b86;
        min-height: 100vh;
        background: #f0f2f8;
        font-family: 'Nunito Sans', -apple-system, sans-serif;
    }

    .admin-topbar {
        background: #09107a;
        border-bottom: none;
        box-shadow: 0 2px 12px rgba(0,0,0,0.2);
    }
    .admin-topbar-seal {
        width: 35px !important;
        height: 35px !important;
        min-width: 35px;
        max-width: 35px !important;
        max-height: 35px !important;
        border-radius: 50%;
        object-fit: contain;
        opacity: 0.9;
    }

    .admin-heading {
        font-family: 'Cinzel', serif;
        color: #fff;
        font-weight: 700;
        font-size: 0.82rem !important;
        letter-spacing: 0.06em;
        text-transform: uppercase;
    }

    .admin-back-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        border-radius: 10px;
        font-weight: 700;
        font-family: 'Nunito Sans', sans-serif;
        font-size: 0.82rem;
        letter-spacing: 0.03em;
        transition: background 0.2s;
        background: transparent;
        color: #fff;
        border: 2.5px solid rgba(255,255,255,0.8);
        padding: 0.55rem 1rem;
        margin-right: 2.25rem;
        text-decoration: none;
        white-space: nowrap;
    }

    .admin-back-btn:hover { background: rgba(255,255,255,0.14); }

    .admin-tab-shell {
        background: #fff;
        border-bottom: 1px solid #e8edf6;
        box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }

    .admin-tab-btn {
        padding: 0.75rem 1.1rem;
        border-bottom: 2.5px solid transparent;
        font-size: 0.88rem;
        font-family: 'Nunito Sans', sans-serif;
        font-weight: 700;
        background: none;
        border-top: none;
        border-left: none;
        border-right: none;
        cursor: pointer;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        transition: color 0.15s, border-color 0.15s;
    }

    .admin-tab-btn.active {
        color: #09107a;
        border-bottom-color: #09107a;
    }

    .admin-tab-btn.inactive { color: #6b7a99; }

    .admin-tab-btn.inactive:hover {
        color: #09107a;
        border-bottom-color: rgba(9,16,122,0.3);
    }

    .admin-panel,
    .admin-card,
    .admin-empty-state {
        background: rgba(255,255,255,0.96);
        border: 1px solid rgba(16,35,63,0.10);
        border-radius: 18px;
        box-shadow: 0 14px 30px rgba(16,35,63,0.07);
    }

    .admin-hero {
        background: linear-gradient(135deg, #09107a 0%, #1a24d2 100%);
        color: white;
        border-radius: 14px 14px 0 0;
        padding: 1.5rem 1.75rem;
    }

    .admin-hero-eyebrow {
        font-family: 'Cinzel', serif;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--admin-gold);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.4rem;
    }

    .admin-hero-eyebrow::before { content: '—'; }

    .admin-hero h1 {
        font-family: 'Cinzel', serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: #fff;
        letter-spacing: 0.02em;
        margin-bottom: 0.3rem;
    }

    .admin-hero .muted {
        font-size: 0.85rem;
        color: rgba(255,255,255,0.65);
    }

    .admin-action-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: #fff;
        color: #09107a;
        border: none;
        border-radius: 8px;
        padding: 0.5rem 1.1rem;
        font-family: 'Nunito Sans', sans-serif;
        font-size: 0.82rem;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
        transition: background 0.15s;
    }

    .admin-action-btn:hover { background: #e8edf6; }

    .response-table-head {
        background: #f4f6fb;
        border-bottom: 1px solid rgba(16,35,63,0.08);
    }

    .response-row {
        border-bottom: 1px solid #f0f2f8;
        transition: background 0.15s;
    }

    .response-row:hover { background: #f7faff; }

    .response-row.selected {
        background: rgba(9,16,122,0.05);
        border-left: 3px solid #09107a;
    }

    .response-id {
        color: #10233f;
        font-weight: 600;
        word-break: break-all;
    }

    .response-muted { color: var(--admin-muted); }

    .response-view-btn {
        background: #09107a;
        color: #fff;
        border: none;
        border-radius: 8px;
        font-family: 'Nunito Sans', sans-serif;
        font-size: 0.78rem;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s;
    }

    .response-view-btn:hover { background: #1a24d2; }

    .detail-panel {
        background: #f8faff;
        border-bottom: 1px solid #e8edf6;
        padding: 1.5rem 1.75rem;
    }
</style>

<div class="admin-shell" x-data="responsesApp()" x-cloak>
    {{-- Admin Header --}}
    <div class="admin-topbar sticky top-0 z-40">
        <div style="height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 2.5rem;">
            <div style="display:flex;align-items:center;gap:0.75rem;margin-left:1.5rem;">
                <img src="{{ asset('images/ADDU-SEAL-Colored.png') }}" alt="" class="admin-topbar-seal" onerror="this.style.display='none'">
                <div>
                    <h1 class="admin-heading" style="line-height:1.3;margin:0;">Tracer Study Admin</h1>
                    <p style="font-family:'Cinzel',serif;font-size:0.72rem;font-weight:700;color:rgba(255,255,255,0.55);letter-spacing:0.06em;margin:0;line-height:1.3;">Graduate Tracer Study</p>
                </div>
            </div>
            <a href="/" class="admin-back-btn">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                Home
            </a>
        </div>

        {{-- Navigation Tabs --}}
        <div class="admin-tab-shell">
            <nav class="max-w-7xl mx-auto px-6 flex gap-1 -mb-px overflow-x-auto">
                     <a href="http://localhost:3000/surveymanagement"
                   class="admin-tab-btn inactive whitespace-nowrap">
                    Dashboard
                </a>
                <a href="/admin/responses"
                   class="admin-tab-btn active whitespace-nowrap">
                    Responses
                </a>
            </nav>
        </div>
    </div>{{-- /admin-topbar --}}

    <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="admin-panel overflow-hidden">
            {{-- Header --}}
            <div class="admin-hero mb-0">
                <div class="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <p class="admin-hero-eyebrow">Response Records</p>
                        <h1>Survey Responses</h1>
                    </div>
                    <template x-if="responses.length > 0">
                        <a href="/admin/export-csv" class="admin-action-btn">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            Export CSV
                        </a>
                    </template>
                </div>
            </div>
            <div class="px-8 pb-8 pt-3">

            <template x-if="responses.length === 0">
                <div class="admin-empty-state text-center py-20">
                    <svg class="w-16 h-16 mx-auto mb-4 text-[#003087] opacity-25" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <h2 class="text-xl font-extrabold text-[#10233f] mb-1">No responses yet</h2>
                    <p class="text-sm response-muted">Responses will appear here once someone submits the survey.</p>
                </div>
            </template>

            <template x-if="responses.length > 0">
                <div class="admin-card overflow-hidden">
                    {{-- Table Header --}}
                    <div class="response-table-head grid grid-cols-[1fr_200px_100px] gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#5a6b86]">
                        <span>Response ID</span>
                        <button class="flex items-center gap-1 hover:text-[#003087] transition-colors text-xs font-semibold uppercase tracking-wider text-[#5a6b86]" style="font-family:'Nunito Sans',sans-serif;background:none;border:none;cursor:pointer;padding:0;letter-spacing:inherit;" @click="sortAsc = !sortAsc">
                            Submitted
                            <template x-if="sortAsc">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
                            </template>
                            <template x-if="!sortAsc">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </template>
                        </button>
                        <span class="text-center">View</span>
                    </div>

                    {{-- Rows --}}
                    <template x-for="(r, i) in sortedResponses" :key="r.id">
                        <div>
                            <div
                                :class="selectedResponse === r.id ? 'response-row selected' : 'response-row'"
                                class="grid grid-cols-[1fr_200px_100px] gap-4 px-6 py-4 items-center"
                            >
                                <span class="text-sm font-mono response-id truncate" x-text="r.id"></span>
                                <span class="text-sm response-muted" x-text="formatDate(r.submitted_at)"></span>
                                <div class="text-center">
                                    <button
                                        @click="viewResponse(r.id)"
                                        class="response-view-btn inline-flex items-center gap-1 px-3 py-1 text-xs"
                                    >
                                        <template x-if="selectedResponse === r.id">
                                            <span class="flex items-center gap-1">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                                Close
                                            </span>
                                        </template>
                                        <template x-if="selectedResponse !== r.id">
                                            <span class="flex items-center gap-1">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                View
                                            </span>
                                        </template>
                                    </button>
                                </div>
                            </div>

                            {{-- Expanded detail --}}
                            <template x-if="selectedResponse === r.id">
                                <div class="detail-panel px-6 py-6 border-b border-slate-200">
                                    <template x-if="detailsLoading">
                                        <p class="text-sm response-muted">Loading answers...</p>
                                    </template>
                                    <template x-if="!detailsLoading && responseDetails.length === 0">
                                        <p class="text-sm response-muted">No answers recorded for this response.</p>
                                    </template>
                                    <template x-if="!detailsLoading && responseDetails.length > 0">
                                        <div class="space-y-4">
                                            <template x-for="group in groupedDetails" :key="group.title">
                                                <div>
                                                    <h3 class="text-xs font-extrabold text-[#003087] uppercase tracking-wider mb-2 border-b border-blue-100 pb-1" x-text="group.title"></h3>
                                                    <div class="space-y-1">
                                                        <template x-for="item in group.items" :key="item.id">
                                                            <div class="grid grid-cols-[1fr_1fr] gap-4 py-2 text-sm">
                                                                <span class="response-muted" x-text="item.question_text"></span>
                                                                <span class="font-semibold text-[#10233f]" x-text="formatAnswer(item)"></span>
                                                            </div>
                                                        </template>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </template>
                                </div>
                            </template>
                        </div>
                    </template>
                </div>
            </template>
            </div>{{-- /pt-3 --}}
        </div>
    </div>
</div>

<script>
function responsesApp() {
    return {
        responses: @json($responses),
        selectedResponse: null,
        responseDetails: [],
        detailsLoading: false,
        sortAsc: false,

        get sortedResponses() {
            return [...this.responses].sort((a, b) => {
                const da = new Date(a.submitted_at).getTime();
                const db = new Date(b.submitted_at).getTime();
                return this.sortAsc ? da - db : db - da;
            });
        },

        get groupedDetails() {
            const grouped = {};
            for (const ra of this.responseDetails) {
                const cat = ra.category_title || 'Unknown';
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(ra);
            }
            return Object.entries(grouped).map(([title, items]) => ({ title, items }));
        },

        formatDate(dateStr) {
            return new Date(dateStr).toLocaleString('en-PH', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
            });
        },

        formatAnswer(ra) {
            if (ra.values && ra.values.length > 0) return ra.values.join(', ');
            return ra.value || '—';
        },

        async viewResponse(responseId) {
            if (this.selectedResponse === responseId) {
                this.selectedResponse = null;
                return;
            }

            this.detailsLoading = true;
            this.selectedResponse = responseId;

            try {
                const res = await fetch('/admin/responses/' + responseId + '/details');
                this.responseDetails = await res.json();
            } catch {
                this.responseDetails = [];
            }
            this.detailsLoading = false;
        },
    };
}
</script>

<style>
[x-cloak] { display: none !important; }
</style>
@endsection
