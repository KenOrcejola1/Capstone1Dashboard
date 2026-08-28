@extends('layouts.app')

@section('title', 'ADDU Graduate Tracer Study')

@section('content')
<style>
    @import url('https://fonts.bunny.net/css?family=cinzel:700,800|nunito-sans:300,400,500,600,700,800');

    :root {
        --blue:     #1a24d2;
        --blue-d:   #0d1496;
        --blue-dd:  #09107a;
        --gold:     #c9a227;
        --gold-bright: #f5b800;
        --ink:      #0d1b3e;
        --muted:    #5a6a88;
        --bg:       #f0f2f9;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
        font-family: 'Nunito Sans', -apple-system, sans-serif;
        background: var(--bg);
        color: var(--ink);
    }

    /* ── Tribal pattern background ── */
    .blue-pattern {
        background-color: var(--blue-dd);
        background-image: linear-gradient(160deg, #1a24d2 0%, #09107a 100%);
        background-repeat: no-repeat;
        background-size: cover;
    }

    .hero.blue-pattern {
        background-image:
            url('/images/2024_Bagobo_Pattern__White_.png'),
            linear-gradient(160deg, #1a24d2 0%, #09107a 100%);
        background-repeat: no-repeat, no-repeat;
        background-size: 60% auto, cover;
        background-position: right center, center;
        background-blend-mode: soft-light, normal;
    }

    /* ── Navbar ── */
    .navbar {
        background: var(--blue-dd);
        height: 58px;
        padding: 0 2.5rem;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 50;
        box-shadow: 0 2px 18px rgba(0,0,0,0.25);
    }

    /* Gold gradient bar — fades out on scroll */
    .navbar::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg,
            transparent 0%,
            var(--gold-bright) 18%,
            var(--gold-bright) 82%,
            transparent 100%);
        opacity: 1;
        transition: opacity 0.5s ease, transform 0.5s ease;
        transform-origin: top;
        pointer-events: none;
    }

    .navbar.scrolled::after {
        opacity: 0;
        transform: scaleY(0);
    }

    .navbar-brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        justify-self: start;
        margin-left: 1.5rem;
    }

    .navbar-seal {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        object-fit: contain;
    }

    .navbar-brand-title {
        display: block;
        font-family: 'Cinzel', serif;
        font-size: 0.95rem;
        font-weight: 400;
        letter-spacing: 0.04em;
        color: #fff;
        line-height: 1.3;
    }

    .navbar-brand-sub {
        display: block;
        font-family: 'Cinzel', serif;
        font-size: 0.72rem;
        font-weight: 400;
        letter-spacing: 0.06em;
        color: rgba(255,255,255,0.55);
        line-height: 1.3;
    }

    .navbar-links {
        display: flex;
        align-items: center;
        gap: 0.15rem;
        list-style: none;
        justify-self: center;
    }

    .navbar-links a {
        display: block;
        padding: 0.45rem 0.9rem;
        padding-bottom: calc(0.45rem - 2px);
        border-bottom: 2px solid transparent;
        color: rgba(255,255,255,0.72);
        font-size: 0.8rem;
        font-weight: 600;
        text-decoration: none;
        letter-spacing: 0.01em;
        transition: color 0.2s, border-color 0.2s;
    }

    .navbar-links a:hover {
        color: #fff;
        border-bottom-color: var(--gold-bright);
    }

    .navbar-links a.active {
        color: #fff;
    }

    .navbar-login {
        display: inline-flex;
        align-items: center;
        justify-self: end;
        margin-right: 1.5rem;
        padding: 0.45rem 1.5rem;
        background: transparent;
        border: 2px solid rgba(255,255,255,0.8);
        border-radius: 10px;
        color: #fff;
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.03em;
        text-decoration: none;
        transition: background 0.2s;
    }

    .navbar-login:hover {
        background: rgba(255,255,255,0.14);
    }

    /* ── Hero ── */
    .hero {
        position: relative;
        overflow: hidden;
    }

    .hero-inner {
        max-width: 1120px;
        margin: 0 auto;
        padding: 5rem 2.5rem 4.5rem;
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 3rem;
        align-items: center;
    }

    .hero-eyebrow {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        color: var(--gold-bright);
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        margin-bottom: 1.25rem;
    }

    .hero-eyebrow::before {
        content: '';
        display: block;
        width: 30px;
        height: 2px;
        background: var(--gold-bright);
        flex-shrink: 0;
    }

    .hero h1 {
        font-family: 'Cinzel', serif;
        font-size: clamp(2.4rem, 4.5vw, 3.6rem);
        font-weight: 700;
        line-height: 1.1;
        color: #fff;
        letter-spacing: 0.02em;
        margin-bottom: 1.25rem;
    }

    .hero h1 .gold { color: #fff; }

    .hero-desc {
        color: rgba(255,255,255,0.75);
        font-size: 0.95rem;
        line-height: 1.72;
        max-width: 500px;
        margin-bottom: 2rem;
    }

    .hero-cta {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        padding: 0.85rem 1.9rem;
        background: var(--gold-bright);
        color: #09107a;
        font-size: 0.92rem;
        font-weight: 800;
        border-radius: 9px;
        border: none;
        cursor: pointer;
        letter-spacing: 0.01em;
        transition: background 0.15s, transform 0.12s;
        text-decoration: none;
    }

    .hero-cta:hover {
        background: #e5ab00;
        transform: translateY(-1px);
    }

    .hero-seal-wrap {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 1.5rem;
    }

    .hero-seal {
        width: 230px;
        height: 230px;
        border-radius: 50%;
        object-fit: contain;
        filter: drop-shadow(0 6px 28px rgba(0,0,0,0.35));
    }

    /* ── Info Section ── */
    .info-section {
        background: #f3f4f8;
    }

    .section-wrap {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2.75rem 1.5rem;
    }

    .section-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Cinzel', serif;
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--gold);
        margin-bottom: 0.75rem;
    }

    .section-eyebrow::before {
        content: '—';
        color: var(--gold);
    }

    .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        gap: 1.5rem;
    }

    /* About card: blue top + white bottom */
    .about-card {
        border-radius: 14px;
        overflow: hidden;
        border: 1px solid rgba(201,162,39,0.2);
        box-shadow: 0 4px 20px rgba(201,162,39,0.07), 0 8px 28px rgba(9,16,122,0.12);
        display: grid;
        grid-template-rows: subgrid;
        grid-row: span 2;
    }

    .about-card-top {
        padding: 1.5rem 1.75rem 1.4rem;
    }

    .about-card-top .card-label {
        font-family: 'Cinzel', serif;
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--gold);
        display: flex;
        align-items: center;
        gap: 0.45rem;
        margin-bottom: 0.75rem;
    }

    .about-card-top .card-label::before { content: '—'; }

    .about-card-top h3 {
        font-family: 'Cinzel', serif;
        font-size: 1.05rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        color: #fff;
        text-transform: uppercase;
        margin-bottom: 0.65rem;
    }

    .about-card-top p {
        font-size: 0.84rem;
        line-height: 1.65;
        color: rgba(255,255,255,0.72);
    }

    .about-card-bottom {
        background: #fff;
        padding: 1rem 1.75rem 1rem;
    }

    .meta-row {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0.6rem 0;
        border-bottom: 1px solid #eef0f8;
        gap: 0.15rem;
    }

    .meta-row:last-child { border-bottom: none; }

    .meta-label {
        font-size: 0.82rem;
        color: var(--muted);
        font-weight: 400;
    }

    .meta-value {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--ink);
    }

    /* Time commitment card */
    .time-card {
        border-radius: 14px;
        overflow: hidden;
        border: 1px solid rgba(201,162,39,0.2);
        box-shadow: 0 4px 20px rgba(201,162,39,0.07), 0 8px 28px rgba(9,16,122,0.12);
        display: grid;
        grid-template-rows: subgrid;
        grid-row: span 2;
    }

    .time-card-top {
        padding: 1.5rem 1.75rem 1.25rem;
    }

    .time-card-top .card-label {
        font-family: 'Cinzel', serif;
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--gold);
        display: flex;
        align-items: center;
        gap: 0.45rem;
        margin-bottom: 0.75rem;
    }

    .time-card-top .card-label::before { content: '—'; }

    .time-number {
        display: flex;
        align-items: baseline;
        gap: 0.4rem;
        margin-bottom: 0.2rem;
    }

    .time-big {
        font-family: 'Cinzel', serif;
        font-size: 3.5rem;
        font-weight: 700;
        color: #fff;
        line-height: 1;
        letter-spacing: -0.01em;
    }

    .time-unit {
        font-size: 0.95rem;
        font-weight: 600;
        color: rgba(255,255,255,0.75);
        line-height: 1;
        white-space: nowrap;
    }

    .time-subunit {
        font-size: 0.72rem;
        font-weight: 500;
        color: rgba(255,255,255,0.55);
        display: block;
    }

    .time-caption {
        font-size: 0.82rem;
        color: rgba(255,255,255,0.65);
        margin-bottom: 0;
    }

    .time-card-bottom {
        background: #fff;
        padding: 1rem 1.4rem;
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
        flex: 1;
        justify-content: center;
    }

    .time-item {
        background: #f5f8ff;
        border: 1px solid #dde6f4;
        border-radius: 10px;
        padding: 0.85rem 1rem;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .time-item-icon {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 1.5px solid #c8d3f0;
        background: #edf2ff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 0.05rem;
    }

    .time-item-icon svg {
        width: 13px;
        height: 13px;
        color: var(--blue-dd);
    }

    .time-item-text {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }

    .time-item-title {
        font-size: 0.88rem;
        font-weight: 700;
        color: var(--ink);
        line-height: 1.3;
    }

    .time-item-desc {
        font-size: 0.81rem;
        color: var(--muted);
        line-height: 1.5;
    }

    /* ── What to Expect ── */
    .expect-section {
        background: #f3f4f8;
    }

    .step-tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
    }

    .step-tab {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        padding: 0.6rem 1.3rem;
        border-radius: 50px;
        font-size: 0.88rem;
        font-weight: 700;
        cursor: pointer;
        border: 1.5px solid transparent;
        transition: all 0.15s;
        letter-spacing: 0.01em;
    }

    .step-tab svg { width: 15px; height: 15px; }

    .step-tab.active {
        background: var(--blue-dd);
        color: #fff;
        border-color: var(--blue-dd);
    }

    .step-tab.inactive {
        background: #fff;
        color: var(--muted);
        border-color: rgba(201,162,39,0.35);
    }

    .step-tab.inactive:hover {
        border-color: var(--gold);
        color: var(--ink);
    }

    .step-preview-wrap {
        position: relative;
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .step-nav-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1.5px solid #cdd7ee;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex-shrink: 0;
        transition: all 0.15s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .step-nav-btn:hover {
        border-color: var(--blue-dd);
        background: #edf2ff;
    }

    .step-nav-btn svg {
        width: 16px;
        height: 16px;
        color: var(--muted);
    }

    .step-preview-card {
        flex: 1;
        background: #fff;
        border: 1px solid rgba(201,162,39,0.15);
        border-radius: 14px;
        padding: 1.5rem 1.75rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        box-shadow: 0 4px 24px rgba(9,16,122,0.08);
        overflow: hidden;
        position: relative;
    }

    .step-preview-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #edf2ff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .step-preview-icon svg {
        width: 22px;
        height: 22px;
        color: var(--blue-dd);
    }

    .step-preview-content { flex: 1; min-width: 0; }

    .step-badge {
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--gold);
        display: block;
        margin-bottom: 0.5rem;
    }

    .step-title {
        font-family: 'Cinzel', serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--ink);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin-bottom: 0.5rem;
    }

    .step-desc {
        font-size: 0.95rem;
        line-height: 1.65;
        color: var(--muted);
    }

    .step-big-number {
        font-family: 'Cinzel', serif;
        font-size: 6rem;
        font-weight: 800;
        color: rgba(26,36,210,0.05);
        line-height: 1;
        flex-shrink: 0;
        user-select: none;
        letter-spacing: -0.02em;
    }

    .step-dots {
        display: flex;
        justify-content: center;
        gap: 0.45rem;
        margin-top: 1.1rem;
    }

    .step-dot {
        height: 7px;
        border-radius: 4px;
        background: #cdd7ee;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        padding: 0;
        width: 7px;
    }

    .step-dot.active {
        background: var(--blue-dd);
        width: 22px;
    }

    /* ── FAQs ── */
    .faq-section {
        background: #f3f4f8;
    }

    .faq-section-title {
        font-family: 'Cinzel', serif;
        font-size: 1.65rem;
        font-weight: 700;
        color: var(--ink);
        letter-spacing: 0.03em;
        margin-top: 0.3rem;
        margin-bottom: 1.5rem;
        text-transform: uppercase;
    }

    .faq-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .faq-card {
        background: #fff;
        border: 1px solid rgba(201,162,39,0.15);
        box-shadow: 0 2px 16px rgba(201,162,39,0.05);
        border-radius: 12px;
        padding: 1.15rem 1.35rem;
        transition: border-color 0.15s;
    }

    .faq-card:hover { }

    .faq-q {
        font-size: 0.86rem;
        font-weight: 700;
        color: var(--ink);
        margin-bottom: 0.5rem;
        display: flex;
        align-items: flex-start;
        gap: 0.45rem;
    }

    .faq-bullet {
        color: var(--gold);
        font-size: 0.9rem;
        margin-top: 0.05rem;
        flex-shrink: 0;
    }

    .faq-a {
        font-size: 0.8rem;
        line-height: 1.65;
        color: var(--muted);
    }

    /* ── Footer ── */
    .footer-contact {
        text-align: center;
        padding: 1.1rem 2rem;
        font-size: 0.8rem;
        color: var(--muted);
        background: #f3f4f8;
    }

    .footer-bar {
        background: var(--blue-dd);
        padding: 0.85rem 2.5rem;
        position: relative;
    }

    .footer-inner {
        max-width: 1280px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 1rem;
    }

    .footer-brand-title {
        font-family: 'Cinzel', serif;
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        margin-top: 3px;
        text-transform: uppercase;
        color: #fff;
    }

    .footer-tagline {
        font-family: 'Cinzel', serif;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        text-align: right;
        margin-top: 3px;
        color: #fff;
    }

    /* ── Modal ── */
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        z-index: 100;
    }

    .modal-box {
        background: #fff;
        border-radius: 16px;
        width: min(100%, 560px);
        max-height: 92vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 32px 80px rgba(0,0,0,0.3);
    }

    .modal-header {
        background: #fff;
        color: var(--ink);
        padding: 1.2rem 1.4rem;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.85rem;
        flex-shrink: 0;
        border-bottom: 1px solid #eef0f8;
    }

    .modal-hd-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #edf2ff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 2px;
    }

    .modal-hd-icon svg { width: 17px; height: 17px; color: var(--blue-dd); }

    .modal-hd-title {
        font-family: 'Cinzel', serif;
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: 0.03em;
        color: var(--ink);
        margin-bottom: 0.2rem;
    }

    .modal-hd-sub {
        font-size: 0.75rem;
        color: var(--muted);
    }

    .modal-close-btn {
        background: none;
        border: none;
        color: #a0aec0;
        font-size: 1.35rem;
        cursor: pointer;
        line-height: 1;
        padding: 0;
        flex-shrink: 0;
    }

    .modal-close-btn:hover { color: var(--ink); }

    .modal-body {
        overflow-y: auto;
        overscroll-behavior: contain;
        padding: 1.3rem 1.4rem 0.9rem;
        font-size: 0.92rem;
        line-height: 1.72;
        color: var(--ink);
        flex: 1;
        scrollbar-width: thin;
        scrollbar-color: #003087 #e5e7eb;
    }

    .modal-body::-webkit-scrollbar { width: 8px; }
    .modal-body::-webkit-scrollbar-track { background: #e5e7eb; border-radius: 8px; }
    .modal-body::-webkit-scrollbar-thumb { background: #003087; border-radius: 8px; }

    .modal-body p { margin-bottom: 0.75rem; }
    .modal-body p:last-child { margin-bottom: 0; }

    .modal-intro {
        background: #f0f4ff;
        border-left: 3px solid var(--blue-dd);
        border-radius: 0 8px 8px 0;
        padding: 0.75rem 1rem;
        color: #2a3a6b;
        font-size: 0.82rem;
        line-height: 1.65;
        margin-bottom: 1rem !important;
    }

    .modal-stitle {
        font-size: 0.82rem;
        font-weight: 800;
        color: var(--ink);
        margin-top: 0.9rem;
        margin-bottom: 0.3rem;
        display: block;
    }

    .modal-footer {
        padding: 0.9rem 1.4rem 1.2rem;
        border-top: 1px solid #e8edf6;
        flex-shrink: 0;
    }

    .consent-label {
        display: flex;
        align-items: flex-start;
        gap: 0.55rem;
        font-size: 0.8rem;
        color: var(--ink);
        cursor: pointer;
        margin-bottom: 0.9rem;
        line-height: 1.55;
    }

    .consent-label input[type="checkbox"] {
        appearance: none;
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        min-width: 16px;
        margin-top: 2px;
        border: 2px solid #111;
        border-radius: 3px;
        background: #fff;
        cursor: pointer;
        position: relative;
        transition: background 0.15s, border-color 0.15s;
    }

    .consent-label input[type="checkbox"]:checked {
        background: var(--blue-dd);
        border-color: var(--blue-dd);
    }

    .consent-label input[type="checkbox"]:checked::after {
        content: '';
        position: absolute;
        left: 3px;
        top: 0px;
        width: 5px;
        height: 9px;
        border: 2px solid #fff;
        border-top: none;
        border-left: none;
        transform: rotate(45deg);
    }

    .modal-actions {
        display: flex;
        gap: 0.7rem;
    }

    .btn-cancel {
        padding: 0.65rem 1.2rem;
        border: 1.5px solid #cdd7ee;
        border-radius: 8px;
        background: #fff;
        color: var(--muted);
        font-size: 0.83rem;
        font-weight: 700;
        cursor: pointer;
        font-family: 'Nunito Sans', sans-serif;
        transition: all 0.15s;
    }

    .btn-cancel:hover { border-color: #8ea4cc; color: var(--ink); }

    .btn-proceed {
        flex: 1;
        padding: 0.65rem 1.2rem;
        border-radius: 8px;
        border: none;
        background: var(--blue-dd);
        color: #fff;
        font-size: 0.83rem;
        font-weight: 700;
        font-family: 'Nunito Sans', sans-serif;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        text-decoration: none;
        transition: background 0.15s, opacity 0.15s;
    }

    .btn-proceed:hover { background: var(--blue-d); }
    .btn-proceed.disabled { opacity: 0.38; pointer-events: none; }

    /* ── Responsive ── */
    @media (max-width: 900px) {
        .info-grid { grid-template-columns: 1fr; }
        .faq-grid  { grid-template-columns: 1fr; }
    }

    @media (max-width: 720px) {
        .navbar-links { display: none; }
        .hero-inner { grid-template-columns: 1fr; }
        .hero-seal-wrap { display: none; }
        .step-big-number { display: none; }
    }

    [x-cloak] { display: none !important; }
</style>

<div x-data="homeApp()" x-cloak>

    {{-- ── NAVBAR ── --}}
    <nav class="navbar" :class="scrolled ? 'scrolled' : ''">
        <a href="/" class="navbar-brand">
            <img src="{{ asset('images/ADDU-SEAL-Colored.png') }}" alt="ADDU Seal" class="navbar-seal" onerror="this.style.display='none'">
            <span>
                <span class="navbar-brand-title">Ateneo de Davao University</span>
                <span class="navbar-brand-sub">Graduate Tracer Study</span>
            </span>
        </a>

        <ul class="navbar-links">
            <li><a href="#about" :class="activeSection === 'about' ? 'active' : ''">About</a></li>
            <li><a href="#time" :class="activeSection === 'time' ? 'active' : ''">Time</a></li>
            <li><a href="#what-to-expect" :class="activeSection === 'expect' ? 'active' : ''">What to Expect</a></li>
            <li><a href="#faqs" :class="activeSection === 'faqs' ? 'active' : ''">FAQs</a></li>
        </ul>

        <a href="{{ url('/admin') }}" class="navbar-login">Log In</a>
    </nav>

    {{-- ── HERO ── --}}
    <section id="about" class="hero blue-pattern">
        <div class="hero-inner">
            <div>
                <div class="hero-eyebrow">Ateneo de Davao University &middot; Alumni Affairs</div>
                <h1>Graduate<br><span class="gold">Tracer Study</span></h1>
                <p class="hero-desc">
                    The tracer study gathers insights on career paths, achievements, and alumni
                    experiences to improve academic programs and institutional services.
                </p>
                <button @click="openModal()" class="hero-cta">
                    Answer the Survey!
                    <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </button>
            </div>
            <div class="hero-seal-wrap">
                <img src="{{ asset('images/ADDU-SEAL-Colored.png') }}" alt="Ateneo de Davao University" class="hero-seal" onerror="this.style.display='none'">
            </div>
        </div>
    </section>

    {{-- ── INFO CARDS ── --}}
    <section id="time" class="info-section">
        <div class="section-wrap">
            <div class="info-grid">

                {{-- About This Study --}}
                <div class="about-card">
                    <div class="about-card-top blue-pattern">
                        <div class="card-label">About This Study</div>
                        <h3>Why Your Voice Matters</h3>
                        <p>The tracer study gathers insights on career paths, achievements, and alumni experiences to improve academic programs and institutional services.</p>
                    </div>
                    <div class="about-card-bottom">
                        <div class="meta-row">
                            <span class="meta-label">Conducted by</span>
                            <span class="meta-value">Ateneo de Davao University</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">Respondents</span>
                            <span class="meta-value">Ateneo Alumni</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">Purpose</span>
                            <span class="meta-value">Program Improvement</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">Mandate</span>
                            <span class="meta-value">CHED Institutional reporting</span>
                        </div>
                    </div>
                </div>

                {{-- Time Commitment --}}
                <div class="time-card">
                    <div class="time-card-top blue-pattern">
                        <div class="card-label">Time Commitment</div>
                        <div class="time-number">
                            <span class="time-big">15–20</span>
                            <span class="time-unit">minutes to complete</span>
                        </div>
                        <p class="time-caption" style="margin-top:0.5rem;">Please complete it in one sitting if possible.</p>
                    </div>
                    <div class="time-card-bottom">
                        <div class="time-item">
                            <span class="time-item-icon">
                                <svg fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14.5"/></svg>
                            </span>
                            <span class="time-item-text">
                                <span class="time-item-title">One sitting recommended</span>
                                <span class="time-item-desc">For the best experience, finish in one sitting if possible.</span>
                            </span>
                        </div>
                        <div class="time-item">
                            <span class="time-item-icon">
                                <svg fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"/></svg>
                            </span>
                            <span class="time-item-text">
                                <span class="time-item-title">Resume anytime</span>
                                <span class="time-item-desc">Save your progress and pick up right where you left off.</span>
                            </span>
                        </div>
                        <div class="time-item">
                            <span class="time-item-icon">
                                <svg fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12V22H4V12"/><path stroke-linecap="round" stroke-linejoin="round" d="M22 7H2v5h20V7z"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 22V7"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>
                            </span>
                            <span class="time-item-text">
                                <span class="time-item-title">Your participation matters!</span>
                                <span class="time-item-desc">As a token of appreciation for your time and effort, you are entitled to participate in the raffle for a chance to win an official AdDU polo shirt!</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {{-- ── WHAT TO EXPECT ── --}}
    <section id="what-to-expect" class="expect-section">
        <div class="section-wrap">
            <div class="section-eyebrow">What to Expect</div>

            <div class="step-tabs" style="margin-top:0.5rem;">
                <template x-for="(step, i) in steps" :key="i">
                    <button
                        @click="activeStep = i"
                        :class="activeStep === i ? 'step-tab active' : 'step-tab inactive'"
                        x-html="step.tabHtml"
                    ></button>
                </template>
            </div>

            <div class="step-preview-wrap">
                <button class="step-nav-btn" @click="activeStep = (activeStep - 1 + steps.length) % steps.length">
                    <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </button>

                <div class="step-preview-card">
                    <div class="step-preview-icon" x-html="steps[activeStep].previewIcon"></div>
                    <div class="step-preview-content">
                        <span class="step-badge" x-text="'STEP ' + steps[activeStep].num + ' OF 4'"></span>
                        <div class="step-title" x-text="steps[activeStep].title"></div>
                        <div class="step-desc" x-text="steps[activeStep].desc"></div>
                    </div>
                    <div class="step-big-number" x-text="steps[activeStep].num"></div>
                </div>

                <button class="step-nav-btn" @click="activeStep = (activeStep + 1) % steps.length">
                    <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
            </div>

            <div class="step-dots">
                <template x-for="(step, i) in steps" :key="i">
                    <button class="step-dot" :class="activeStep === i ? 'active' : ''" @click="activeStep = i"></button>
                </template>
            </div>
        </div>
    </section>

    {{-- ── FAQs ── --}}
    <section id="faqs" class="faq-section">
        <div class="section-wrap">
            <div class="section-eyebrow">FAQs</div>
            <h2 class="faq-section-title">Frequently Asked Questions</h2>

            <div class="faq-grid">
                <div class="faq-card">
                    <p class="faq-q"><span class="faq-bullet">●</span>Are my answers anonymous?</p>
                    <p class="faq-a">No. However, responses are used solely for institutional research and reporting purposes, and are handled with strict confidentiality.</p>
                </div>
                <div class="faq-card">
                    <p class="faq-q"><span class="faq-bullet">●</span>Can I pause and continue later?</p>
                    <p class="faq-a">Yes. Use the "Save for Later" option and keep your resume code so you can pick up right where you left off.</p>
                </div>
                <div class="faq-card">
                    <p class="faq-q"><span class="faq-bullet">●</span>How long does the survey take?</p>
                    <p class="faq-a">Most alumni complete the survey within 15 to 20 minutes. We recommend doing it in one sitting if possible.</p>
                </div>
                <div class="faq-card">
                    <p class="faq-q"><span class="faq-bullet">●</span>Who can answer this tracer study?</p>
                    <p class="faq-a">This tracer study is intended for AdDU alumni who have been invited to provide their post-graduation outcomes and feedback.</p>
                </div>
            </div>
        </div>
    </section>

    {{-- ── FOOTER ── --}}
    <div class="footer-contact">
        Still have questions? Reach out to the AdDU Office of Alumni Relations.
    </div>
    <footer class="footer-bar">
        <div class="footer-inner">
            <span class="footer-brand-title">Ateneo Graduate Tracer Study</span>
            <a href="/developers" style="text-decoration:none;font-family:'Cinzel',serif;font-size:0.6rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.45);transition:color 0.15s;white-space:nowrap;text-align:center;" onmouseover="this.style.color='#c9a227'" onmouseout="this.style.color='rgba(255,255,255,0.45)'">The Minds Behind the Innovation</a>
            <span class="footer-tagline">Strong in Faith That Does Justice</span>
        </div>
    </footer>

    {{-- ── PRIVACY MODAL ── --}}
    <div class="modal-backdrop" x-show="showModal" x-cloak @click.self="showModal = false">
        <div class="modal-box" @click.stop>
            <div class="modal-header">
                <div class="modal-hd-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <div style="flex:1;">
                    <div class="modal-hd-title">Data Privacy &amp; Consent</div>
                    <div class="modal-hd-sub">Please read carefully before proceeding.</div>
                </div>
                <button class="modal-close-btn" @click="showModal = false">&times;</button>
            </div>

            <div class="modal-body">
                <p class="modal-intro">Ateneo de Davao University is committed to protecting your personal data in accordance with the Data Privacy Act of 2012 (R.A. 10173). By participating in this tracer study, you agree to the collection and processing of your information as described below.</p>
                <span class="modal-stitle">What data will the University collect as part of the Graduate Tracer Study?</span>
                <p>We collect personal and professional information including your contact details, educational background, employment status, and feedback on your AdDU experience.</p>
                
                <span class="modal-stitle">Your privacy matters</span>
                <p>All responses are kept confidential and used only for research, shared exclusively in aggregate form. Individual responses will not be publicly attributed to you.</p>

                <span class="modal-stitle">How are my responses to the Graduate Tracer Study collected?</span>
                <p>They are collected only through the official AdDU Graduate Tracer Study Portal solely for academic quality assurance, institutional planning, accreditation, curriculum enhancement, graduate outcome assessment, and other legitimate educational purposes.</p>

                <span class="modal-stitle">How does the University process the personal information and survey responses I provide?</span>
                <p>Information provided by alumni will be processed by your respective academic units as authorized by the Office of Strategic Management and Quality Assurance (OSMQA) and designated system administrators from the CS cluster are bound by the University's data privacy and confidentiality policies.</p>

                <span class="modal-stitle">How will my responses to the Graduate Tracer Study be used by the University?</span>
                <p>Individual responses will be used exclusively for graduate tracer study analyses and institutional reporting. The information will not be used for commercial purposes or disclosed to unauthorized third parties unless required by law. Your responses are used exclusively for institutional research to assess program quality, improve academic offerings, and fulfill government reporting requirements (e.g., CHED).</p>

                <span class="modal-stitle">How will my responses to the Graduate Tracer Study be anonymized?</span>
                <p>Reports, dashboards, statistical summaries, and research outputs generated from the Graduate Tracer Study will present only aggregated and anonymized data. Personally identifiable information, such as names, contact details, and other identifying information, will not be disclosed in published reports.</p>

                <span class="modal-stitle">What measures does the University take to protect my personal information and Graduate Tracer Study responses?</span>
                <p>Appropriate administrative, organizational, technical, and physical safeguards are implemented to protect the confidentiality, integrity, and security of all information collected through the portal.</p>

                <span class="modal-stitle">What rights do I have concerning my Graduate Tracer Study responses?</span>
                <p>Alumni retain their rights under the Data Privacy Act of 2012, including the right to be informed, access their personal information, request correction of inaccurate data, and exercise other applicable rights in accordance with existing laws and University policies.</p>
            </div>

            <div class="modal-footer">
                <label class="consent-label">
                    <input type="checkbox" x-model="agreed">
                    <span>I have read and understood the data privacy notice, and I voluntarily consent to participate in this tracer study.</span>
                </label>
                <div class="modal-actions">
                    <button class="btn-cancel" @click="showModal = false">Cancel</button>
                    <a
                        href="{{ url('/survey') }}"
                        class="btn-proceed"
                        :class="!agreed ? 'disabled' : ''"
                        @click.prevent="if(agreed) window.location='{{ url('/survey') }}'"
                    >
                        Proceed to Survey
                        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                    </a>
                </div>
            </div>
        </div>
    </div>

</div>

<script>
function homeApp() {
    const personIcon = `<svg fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    const bgIcon     = `<svg fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`;
    const careerIcon = `<svg fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>`;
    const submitIcon = `<svg fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;

    return {
        showModal: false,
        agreed: false,
        activeStep: 0,
        activeSection: 'about',
        scrolled: false,

        steps: [
            {
                num: '01', title: 'Identification',
                desc: 'Tell us a bit about yourself, including your contact details, so we can match your entry to your alumni record.',
                tabHtml: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span>01 &middot; Identification</span>`,
                previewIcon: personIcon,
            },
            {
                num: '02', title: 'Background',
                desc: 'Share your educational background and personal history to help us understand your journey after AdDU.',
                tabHtml: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg><span>02 &middot; Background</span>`,
                previewIcon: bgIcon,
            },
            {
                num: '03', title: 'Career & Feedback',
                desc: 'Tell us about your current work, career outcomes, and how your AdDU education prepared you for professional life.',
                tabHtml: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg><span>03 &middot; Career &amp; Feedback</span>`,
                previewIcon: careerIcon,
            },
            {
                num: '04', title: 'Review & Submit',
                desc: 'Review your answers carefully and submit your completed tracer study response.',
                tabHtml: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg><span>04 &middot; Review &amp; Submit</span>`,
                previewIcon: submitIcon,
            },
        ],

        openModal() {
            this.agreed = false;
            this.showModal = true;
        },

        init() {
            const onScroll = () => { this.scrolled = window.scrollY > 28; };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();

            const sections = [
                { id: 'about',          key: 'about' },
                { id: 'time',           key: 'time' },
                { id: 'what-to-expect', key: 'expect' },
                { id: 'faqs',           key: 'faqs' },
            ];
            const observer = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        const match = sections.find(s => s.id === e.target.id);
                        if (match) this.activeSection = match.key;
                    }
                });
            }, { rootMargin: '-40% 0px -55% 0px' });
            sections.forEach(s => {
                const el = document.getElementById(s.id);
                if (el) observer.observe(el);
            });
        },
    };
}
</script>
@endsection
