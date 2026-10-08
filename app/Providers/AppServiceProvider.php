<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Super-admin bypass: user ber-role 'admin' lolos SEMUA
        // pemeriksaan Gate, policy model maupun permission spatie.
        // Return null = "tidak ikut campur", lanjut ke check normal.
        Gate::before(function (User $user, string $ability) {
            return $user->hasRole('admin') ? true : null;
        });

        // Scramble membatasi /docs/api ke env local ATAU gate ini.
        // Di testing dibuka supaya bisa di-test; di production
        // definisikan ulang sesuai kebutuhan (mis. hanya admin).
        Gate::define('viewApiDocs', function (?User $user) {
            if (app()->environment('testing')) {
                return true;
            }

            return $user !== null && $user->hasRole('admin');
        });
    }
}
