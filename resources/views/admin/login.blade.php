@extends('layouts.app')

@section('title', 'Admin Login')

@section('content')
<style>
    @import url('https://fonts.bunny.net/css?family=cinzel:700,800|nunito-sans:300,400,500,600,700,800');

    :root {
        --blue-dd: #09107a;
        --blue:    #1a24d2;
    }

    body { margin: 0; font-family: 'Nunito Sans', -apple-system, sans-serif; }

    .login-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        position: relative;
        background: linear-gradient(160deg, #1a24d2 0%, #09107a 100%);
        overflow: hidden;
    }

    /* Gold bar at top */
    .login-page::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg,
            transparent 0%,
            #f5b800 18%,
            #f5b800 82%,
            transparent 100%);
        z-index: 100;
        pointer-events: none;
    }

    .login-page::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url('/images/pattern_1-01.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        filter: invert(1);
        mix-blend-mode: overlay;
        opacity: 1;
        pointer-events: none;
    }

    .login-above-card {
        position: absolute;
        top: 2rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
        width: min(90%, 420px);
        display: flex;
        justify-content: center;
    }

    .login-above-card img {
        width: 100%;
        height: auto;
        object-fit: contain;
        filter: drop-shadow(0 2px 12px rgba(255,255,255,0.15));
    }

    .login-card-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.85rem;
        position: relative;
        z-index: 1;
        width: min(100%, 440px);
    }

    .login-card {
        background: #fff;
        border-radius: 14px;
        width: 100%;
        padding: 2rem 2.25rem 2.25rem;
        box-shadow: 0 24px 60px rgba(0,0,0,0.28);
    }

    .login-credit {
        font-size: 0.75rem;
        color: rgba(255,255,255,0.5);
        text-align: center;
        margin: 0;
    }

    .login-seal {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .login-seal img {
        width: 68px;
        height: 68px;
        border-radius: 50%;
        object-fit: contain;
    }

    .login-seal-placeholder {
        width: 68px;
        height: 68px;
        border-radius: 50%;
        background: var(--blue);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .login-seal-placeholder svg {
        width: 32px;
        height: 32px;
        color: #fff;
    }

    .login-school-name {
        margin-top: 0.6rem;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--blue-dd);
        text-align: center;
    }

    .login-title {
        font-family: 'Cinzel', serif;
        font-size: 1.15rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #111;
        margin: 0 0 0.3rem;
    }

    .login-sub {
        font-size: 0.84rem;
        color: #6b7a99;
        margin: 0 0 1.25rem;
    }

    .login-divider {
        border: none;
        border-top: 1px solid #e8edf6;
        margin-bottom: 1.25rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-label {
        display: block;
        font-size: 0.8rem;
        font-weight: 700;
        color: #3d4f6b;
        margin-bottom: 0.35rem;
    }

    .form-input {
        display: block;
        width: 100%;
        padding: 0.65rem 0.9rem;
        border: 1.5px solid #d0d9ec;
        border-radius: 8px;
        font-size: 0.88rem;
        color: #0d1b3e;
        background: #fff;
        transition: border-color 0.15s, box-shadow 0.15s;
        box-sizing: border-box;
    }

    .form-input:focus {
        outline: none;
        border-color: var(--blue);
        box-shadow: 0 0 0 3px rgba(26,36,210,0.12);
    }

    .error-box {
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        padding: 0.65rem 0.9rem;
        margin-bottom: 1rem;
        font-size: 0.82rem;
        color: #991b1b;
    }

    .error-box ul { margin: 0; padding: 0 0 0 1rem; }
    .error-box li { margin: 0; }

    .form-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 1.25rem;
    }

    .back-link {
        font-size: 0.82rem;
        color: #6b7a99;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }

    .back-link:hover { color: var(--blue-dd); }

    .back-link::before { content: '←'; }

    .login-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.65rem 1.5rem;
        background: var(--blue-dd);
        color: #fff;
        font-family: 'Nunito Sans', sans-serif;
        font-size: 0.88rem;
        font-weight: 700;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.15s;
    }

    .login-btn:hover { background: var(--blue); }
</style>

<div class="login-page">
    <div class="login-above-card">
        <img src="{{ asset('images/seal_side_white.png') }}" alt="Ateneo de Davao University">
    </div>
    <div class="login-card-wrap">
    <div class="login-card">

        <h2 class="login-title">Admin Login</h2>
        <p class="login-sub">Use the registered admin account for sign in.</p>
        <hr class="login-divider">

        @if ($errors->any())
            <div class="error-box">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ url('/login') }}">
            @csrf

            <div class="form-group">
                <label for="admin_email" class="form-label">Email</label>
                <input
                    id="admin_email"
                    name="email"
                    type="email"
                    class="form-input"
                    value="{{ old('email') }}"
                    required
                    autofocus
                >
            </div>

            <div class="form-group">
                <label for="admin_password" class="form-label">Password</label>
                <input
                    id="admin_password"
                    name="password"
                    type="password"
                    class="form-input"
                    required
                >
            </div>

            <div class="form-footer">
                <a href="{{ url('/') }}" class="back-link">Back to home</a>
                <button type="submit" class="login-btn">
                    Log In
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </button>
            </div>
        </form>

    </div>
    <p class="login-credit">Ateneo de Davao University &middot; Office of Alumni Relations</p>
    </div>
</div>
@endsection
