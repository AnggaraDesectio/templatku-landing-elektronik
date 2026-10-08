<?php

use App\Support\TemplateFlavor;
use Illuminate\Support\Facades\Route;

// Di-generate oleh php artisan template:zip - minimal untuk flavor "landing-elektronik".
// "/" selalu redirect ke "home" flavor aktif (config/template.php).
Route::get('/', function () {
    return redirect()->route(TemplateFlavor::homeRoute());
})->name('home');

// Rute domain flavor ini.
require __DIR__.'/flavors/landing-elektronik.php';
