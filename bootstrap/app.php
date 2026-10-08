<?php

use App\Exceptions\InsufficientStockException;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SetLocale;
use App\Support\ApiResponse;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;
use Laravel\Sanctum\Http\Middleware\CheckForAnyAbility;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            SetLocale::class,
            HandleInertiaRequests::class,
        ]);

        // Alias middleware spatie/laravel-permission (v8 tidak
        // mendaftarkannya otomatis — wajib manual).
        // Sanctum v4 juga tidak mendaftarkan alias ability — manual juga.
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
            'abilities' => CheckAbilities::class,
            'ability' => CheckForAnyAbility::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // API tidak pernah me-return redirect HTML — penting kalau
        // consumer-nya aplikasi mobile (Flutter) atau SPA.
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Domain exception → envelope konsisten + kode stabil.
        // Client branching dari 'code', bukan dari pesan.
        $exceptions->render(
            fn (InsufficientStockException $e, Request $request) => $request->is('api/*')
                ? ApiResponse::error($e->getMessage(), $e->errorCode(), $e->statusCode())
                : null
        );

        // Validasi gagal → envelope yang sama (bukan format default Laravel).
        $exceptions->render(
            fn (ValidationException $e, Request $request) => $request->is('api/*')
                ? ApiResponse::error('Validasi gagal.', 'validation_failed', 422, $e->errors())
                : null
        );

        // Error bisnis yang expected bukan bug — jangan penuhi log.
        $exceptions->dontReport([
            InsufficientStockException::class,
        ]);
    })->create();
