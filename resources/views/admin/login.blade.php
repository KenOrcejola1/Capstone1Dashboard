@extends('layouts.app')

@section('title', 'Admin Login - Tracer Study')

@section('content')
<div class="min-h-screen bg-slate-100 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-md border border-slate-200 p-8">
        <h1 class="text-2xl font-bold text-[#003087] mb-1">Tracer Study Admin</h1>
        <p class="text-sm text-slate-500 mb-6">Sign in with an admin account to continue.</p>

        <form method="POST" action="{{ route('admin.login.attempt') }}" class="space-y-4">
            @csrf

            <div>
                <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value="{{ old('email') }}"
                    required
                    autofocus
                    class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]"
                >
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]"
                >
            </div>

            @if ($errors->any())
                <div class="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                    {{ $errors->first() }}
                </div>
            @endif

            <button
                type="submit"
                class="w-full rounded-lg bg-[#003087] text-white py-2.5 text-sm font-semibold hover:bg-[#002366] transition-colors"
            >
                Sign in as Admin
            </button>
        </form>

        <div class="mt-4 text-center">
            <a href="/" class="text-sm text-[#003087] hover:underline">Back to survey</a>
        </div>
    </div>
</div>
@endsection
