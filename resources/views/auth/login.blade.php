@extends('layouts.app')

@section('title', 'Login - ADDU Alumni Tracer Study')

@section('content')
<div class="min-h-screen bg-[#FDFDFC] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
        <div class="overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_rgba(61,71,82,0.12)]">
            <div class="px-8 py-10">
                <div class="mb-8 text-center">
                    <h1 class="text-3xl font-semibold text-[#003087]">Tracer Study Login</h1>
                    <p class="mt-2 text-sm text-gray-600">Sign in to access the tracer study admin dashboard.</p>
                </div>

                @if ($errors->any())
                    <div class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <ul class="space-y-1">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <form method="POST" action="{{ route('login') }}" class="space-y-6">
                    @csrf

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value="{{ old('email') }}"
                            required
                            autofocus
                            class="mt-2 w-full rounded-2xl border border-[#e3e3e0] bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/20"
                        >
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            class="mt-2 w-full rounded-2xl border border-[#e3e3e0] bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/20"
                        >
                    </div>

                    <div class="flex items-center justify-between text-sm text-gray-600">
                        <label class="inline-flex items-center gap-2">
                            <input type="checkbox" name="remember" class="h-4 w-4 rounded border-gray-300 text-[#003087] focus:ring-[#003087]">
                            Remember me
                        </label>
                        <span>Use the registered admin account for login.</span>
                    </div>

                    <button type="submit" class="w-full rounded-2xl bg-[#003087] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#002366]">
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
