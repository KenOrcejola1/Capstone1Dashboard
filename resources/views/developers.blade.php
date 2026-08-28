@extends('layouts.app')

@section('title', 'Meet the Developers')

@section('content')
<style>
    @import url('https://fonts.bunny.net/css?family=cinzel:400,700,800|nunito-sans:300,400,500,600,700,800|cormorant-garamond:400,500,600,700');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body { font-family: 'Nunito Sans', sans-serif; }

    .dev-page {
        min-height: 100vh;
        background-color: #f5f7ff;
        background-image:
            repeating-linear-gradient(
                45deg,
                rgba(9,16,122,0.1) 0,
                rgba(9,16,122,0.1) 1.5px,
                transparent 1.5px,
                transparent 120px
            ),
            repeating-linear-gradient(
                -45deg,
                rgba(9,16,122,0.1) 0,
                rgba(9,16,122,0.1) 1.5px,
                transparent 1.5px,
                transparent 120px
            );
        display: flex;
        flex-direction: column;
    }

    /* ── Topbar ── */
    .dev-topbar {
        background: #09107a;
        border-bottom: 2px solid rgba(201,162,39,0.35);
        box-shadow: 0 2px 18px rgba(0,0,0,0.25);
        height: 58px;
        padding: 0 2.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        z-index: 40;
    }

    .dev-topbar-brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-left: 1.5rem;
    }

    .dev-topbar-text {
        margin-top: 2px;
    }

    .dev-topbar-seal {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        object-fit: contain;
    }

    .dev-topbar-text h1 {
        display: block;
        font-family: 'Cinzel', serif;
        font-size: 0.92rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        color: #fff;
        line-height: 1.3;
        margin: 0;
        padding: 0;
    }

    .dev-topbar-text p {
        display: block;
        font-family: 'Cinzel', serif;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        color: rgba(255,255,255,0.55);
        line-height: 1.3;
        margin: 0;
        padding: 0;
    }

    .dev-back-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.35rem;
        padding: 0.50rem 1rem;
        background: transparent;
        border: 2.5px solid rgba(255,255,255,0.8);
        border-radius: 10px;
        color: #fff;
        font-family: 'Nunito Sans', sans-serif;
        font-size: 0.82rem;
        font-weight: 700;
        text-decoration: none;
        transition: background 0.15s;
        margin-right: 2.25rem;
    }

    .dev-back-btn:hover {
        background: rgba(255,255,255,0.14);
    }

    /* ── Hero ── */
    .dev-hero {
        text-align: center;
        padding: 4.5rem 2rem 3rem;
    }

    .dev-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        font-family: 'Nunito Sans', sans-serif;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #c9a227;
        margin-bottom: 1.1rem;
    }

    .dev-eyebrow-diamond {
        display: inline-block;
        width: 7px;
        height: 7px;
        background: #c9a227;
        transform: rotate(45deg);
    }

    .dev-hero h2 {
        font-family: 'Cinzel', serif;
        font-size: clamp(2.2rem, 5vw, 3.5rem);
        font-weight: 700;
        color: #09107a;
        letter-spacing: 0.03em;
        margin-bottom: 1rem;
    }

    .dev-hero p {
        font-size: 0.95rem;
        color: rgba(9,16,122,0.5);
        max-width: 480px;
        margin: 0 auto;
        line-height: 1.6;
    }

    /* ── Cards ── */
    .dev-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.5rem;
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 2rem 4rem;
        flex: 1;
    }

    .dev-card {
        background: linear-gradient(135deg, #09107a 0%, #1a24d2 100%);
        border: 1px solid rgba(201,162,39,0.35);
        border-top: 2px solid rgba(201,162,39,0.6);
        border-radius: 16px;
        padding: 2rem 1.75rem;
        position: relative;
        width: 320px;
        flex-shrink: 0;
        box-shadow: 0 8px 32px rgba(9,16,122,0.25), inset 0 1px 0 rgba(255,255,255,0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        min-height: 160px;
    }


    .dev-card-diamond {
        width: 9px;
        height: 9px;
        background: #c9a227;
        transform: rotate(45deg);
        flex-shrink: 0;
    }

    .dev-card-name {
        font-family: 'Cinzel', serif;
        font-size: 1.1rem;
        font-weight: 700;
        color: #fff;
        letter-spacing: 0.02em;
        margin-bottom: 0.55rem;
    }

    .dev-card-wave {
        color: #c9a227;
        font-size: 1rem;
        letter-spacing: 0.1em;
        margin-bottom: 0.85rem;
        display: block;
    }

    .dev-card-role {
        font-family: 'Nunito Sans', sans-serif;
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #c9a227;
    }

    /* ── Footer ── */
    .dev-footer {
        background: #09107a;
        border-top: 2px solid rgba(201,162,39,0.35);
        box-shadow: 0 -4px 24px rgba(0,0,0,0.2);
        padding: 0.85rem 2.5rem;
    }

    .dev-footer-inner {
        max-width: 1280px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .dev-footer-title {
        font-family: 'Cinzel', serif;
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #fff;
    }

    .dev-footer-tagline {
        font-family: 'Cinzel', serif;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #fff;
    }
</style>

<div class="dev-page">

    {{-- Topbar --}}
    <div class="dev-topbar">
        <div class="dev-topbar-brand">
            <img src="{{ asset('images/ADDU-SEAL-Colored.png') }}" alt="ADDU Seal" class="dev-topbar-seal" onerror="this.style.display='none'">
            <div class="dev-topbar-text">
                <h1>Ateneo de Davao University</h1>
                <p>Graduate Tracer Study</p>
            </div>
        </div>
        <a href="/" class="dev-back-btn">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="display:block;flex-shrink:0;position:relative;top:-1px;"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Home
        </a>
    </div>

    {{-- Hero --}}
    <div class="dev-hero">
        <h2>The Minds Behind the Innovation</h2>
        <div class="dev-eyebrow" style="margin-top:0.75rem;margin-bottom:0;">
            <span class="dev-eyebrow-diamond"></span>
            The team behind the AdDU Graduate Tracer Study platform
            <span class="dev-eyebrow-diamond"></span>
        </div>
    </div>

    {{-- Cards --}}
    <div class="dev-grid">
        @php
        $developers = [
            ['name' => 'Victoriano, O.',  'role' => 'Project Lead'],
            ['name' => 'Vales, J.',       'role' => 'Software Engineer'],
            ['name' => 'Lomanta, A.',     'role' => 'Software Engineer'],
            ['name' => 'Bautista, J.',    'role' => 'System & Data Analyst'],
            ['name' => 'Pelobello, N.',   'role' => 'System & Data Analyst'],
        ];
        @endphp

        @foreach($developers as $dev)
        <div class="dev-card">
            <div style="display:flex;align-items:center;justify-content:center;gap:0.65rem;margin-bottom:0.6rem;">
                <div class="dev-card-diamond" style="flex-shrink:0;"></div>
                <div class="dev-card-name" style="margin-bottom:0;">{{ $dev['name'] }}</div>
            </div>
            <div class="dev-card-role">{{ $dev['role'] }}</div>
        </div>
        @endforeach
    </div>

    {{-- Footer --}}
    <div class="dev-footer">
        <div class="dev-footer-inner">
            <span class="dev-footer-title">Ateneo Graduate Tracer Study</span>
            <span class="dev-footer-tagline">Strong in Faith That Does Justice</span>
        </div>
    </div>

</div>
@endsection
