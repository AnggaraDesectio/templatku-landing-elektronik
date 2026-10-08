{{-- Halaman 500: otomatis dipakai Laravel saat exception tak tertangani. --}}
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>500 — Kesalahan server</title>
    @vite(['resources/css/app.css'])
</head>
<body class="font-sans antialiased">
    <div class="bg-background text-foreground flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p class="text-destructive text-7xl font-bold tabular-nums sm:text-8xl">500</p>
        <h1 class="mt-4 text-2xl font-bold">Terjadi kesalahan</h1>
        <p class="text-muted-foreground mt-2 max-w-md text-sm">
            Maaf, ada yang tidak beres di sisi kami. Tim sudah diberi tahu — silakan coba lagi beberapa saat.
        </p>
        <div class="mt-6">
            <a href="{{ route('dashboard') }}" class="bg-primary text-primary-foreground inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium shadow-sm">
                Kembali ke Dashboard
            </a>
        </div>
    </div>
</body>
</html>
