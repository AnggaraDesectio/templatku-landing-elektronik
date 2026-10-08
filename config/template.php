<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "landing-elektronik".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'landing-elektronik'),

    'flavors' => array (
  'landing-elektronik' => 
  array (
    'label' => 'VOLTARA — Elektronik',
    'brand_name' => 'VOLTARA',
    'brand_tagline' => 'Elektronik bergaransi resmi',
    'brand_initials' => 'VL',
    'accent' => '#0284c7',
    'category' => 'teknologi',
    'home' => 'landings.elektronik',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Menu',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Landing',
              'to' => '/landings/elektronik',
              'icon' => 'Home',
            ),
            1 => 
            array (
              'label' => 'Dashboard',
              'to' => '/dashboard',
              'icon' => 'LayoutDashboard',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
          ),
        ),
      ),
    ),
  ),
),
];
