<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="{{ \App\Support\TemplateFlavor::accent() }}">
    <title inertia>{{ config('app.name', 'TemplateKu') }}</title>
    {{-- Cegah flash tema salah: terapkan dark sebelum render --}}
    <script>
        try {
            var t = localStorage.getItem('tpl-theme');
            if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            }
        } catch (e) {}
    </script>
    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    {{-- Tema dinamis per flavor: font Google Fonts + CSS vars --primary/--ring/--chart-1..5 --}}
    @php
        $flavorAccent = \App\Support\TemplateFlavor::accent();
        $flavorFonts  = \App\Support\TemplateFlavor::fontPairing();
        $flavorCharts = \App\Support\TemplateFlavor::chartPalette();
        $flavorFontUrl = 'https://fonts.googleapis.com/css2?family='
            .str_replace(' ', '+', $flavorFonts['display']).':wght@500;600;700;800&family='
            .str_replace(' ', '+', $flavorFonts['body']).':wght@400;500;600;700&display=swap';
    @endphp
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="{{ $flavorFontUrl }}" rel="stylesheet">
    <style id="flavor-theme">
        :root {
            --primary: {{ $flavorAccent }};
            --ring: {{ $flavorAccent }};
            --sidebar-primary: {{ $flavorAccent }};
            --chart-1: {{ $flavorCharts[0] }};
            --chart-2: {{ $flavorCharts[1] }};
            --chart-3: {{ $flavorCharts[2] }};
            --chart-4: {{ $flavorCharts[3] }};
            --chart-5: {{ $flavorCharts[4] }};
            --font-sans: '{{ $flavorFonts['body'] }}', ui-sans-serif, system-ui, sans-serif;
            --font-display: '{{ $flavorFonts['display'] }}', serif;
        }
        .dark {
            --primary: color-mix(in oklch, {{ $flavorAccent }} 82%, white);
            --ring: color-mix(in oklch, {{ $flavorAccent }} 82%, white);
            --sidebar-primary: color-mix(in oklch, {{ $flavorAccent }} 82%, white);
        }
    </style>
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
