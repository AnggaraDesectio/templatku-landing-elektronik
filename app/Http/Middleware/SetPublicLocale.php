<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Paksa locale 'id' untuk rute publik (sitemap + halaman situs publik)
// agar <html lang> selalu "id". Tidak menyentuh rute /admin/* dan
// dan dashboard auth. Middleware ini hanya didaftarkan pada grup rute publik.
class SetPublicLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        app()->setLocale('id');

        return $next($request);
    }
}
