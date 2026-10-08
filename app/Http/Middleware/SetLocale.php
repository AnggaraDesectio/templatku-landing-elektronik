<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Terapkan pilihan bahasa user (session 'locale') ke app locale.
// Default 'id', konten template berbahasa Indonesia.
class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->session()->get('locale', 'id');
        if (in_array($locale, ['id', 'en'], true)) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}
