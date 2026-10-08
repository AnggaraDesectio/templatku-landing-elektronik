{{-- Halaman 404: otomatis dipakai Laravel saat abort(404). --}}
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 — Halaman tidak ditemukan</title>
    @vite(['resources/css/app.css'])
</head>
<body class="font-sans antialiased">
    <div class="bg-background text-foreground flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p class="text-primary text-7xl font-bold tabular-nums sm:text-8xl">404</p>
        <h1 class="mt-4 text-2xl font-bold">Halaman tidak ditemukan</h1>
        <p class="text-muted-foreground mt-2 max-w-md text-sm">
            Alamat yang Anda tuju tidak ada atau sudah dipindahkan. Periksa kembali URL-nya.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-2">
            <a href="{{ route('dashboard') }}" class="bg-primary text-primary-foreground inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium shadow-sm">
                Kembali ke Dashboard
            </a>
            <button type="button" onclick="history.back()" class="border-input bg-background inline-flex h-10 items-center rounded-lg border px-4 text-sm font-medium">
                Kembali
            </button>
        </div>
    </div>
</body>
</html>
