<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Loader: endpoint asli tinggal di routes/api/v1/{domain}.php
| (satu file per domain). File ini hanya me-load semuanya dengan
| prefix v1 — jangan taruh route langsung di sini kalau
| aplikasinya membesar.
|
*/

foreach (glob(__DIR__.'/api/v1/*.php') as $file) {
    Route::prefix('v1')->group(static function () use ($file) {
        require $file;
    });
}
