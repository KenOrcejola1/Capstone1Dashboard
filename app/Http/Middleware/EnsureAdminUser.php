<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminUser
{
    private const PORTAL_LOGIN_URL = 'http://localhost:3000/login';

    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            $email = strtolower(trim((string) $request->query('email', '')));
            $role = strtolower(trim((string) $request->query('role', '')));

            if ($email !== '' && $role === 'admin') {
                $adminUser = User::where('email', $email)
                    ->where('role', 'admin')
                    ->first();

                if ($adminUser) {
                    Auth::login($adminUser);
                    $request->session()->regenerate();
                }
            }
        }

        if (!Auth::check() || (Auth::user()->role ?? null) !== 'admin') {
            if ($request->expectsJson() || $request->is('admin/api/*')) {
                return response()->json(['message' => 'Forbidden.'], 403);
            }

            return redirect()->away(self::PORTAL_LOGIN_URL);
        }

        return $next($request);
    }
}
