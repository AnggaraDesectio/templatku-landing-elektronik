<?php

namespace App\Exceptions;

use Exception;

/**
 * Contoh domain exception: error bisnis yang EXPECTED (bukan bug).
 *
 * Ciri wajib exception seperti ini:
 * - errorCode() STABIL dan machine-readable → client branching dari sini,
 *   bukan dari pesan (pesan boleh Bahasa Indonesia / berubah).
 * - statusCode() HTTP yang tepat.
 * - Didaftarkan di bootstrap/app.php: dontReport() (bukan error log)
 *   + renderer khusus yang pakai ApiResponse::error().
 */
class InsufficientStockException extends Exception
{
    public function __construct(
        public readonly string $sku,
        public readonly int $requested,
        public readonly int $available,
    ) {
        parent::__construct(
            "Stok produk {$sku} tidak mencukupi (minta {$requested}, tersedia {$available})."
        );
    }

    /**
     * Kode stabil untuk client. JANGAN PERNAH diubah setelah dirilis,
     * aplikasi mobile/consumer lain bergantung padanya.
     */
    public function errorCode(): string
    {
        return 'insufficient_stock';
    }

    public function statusCode(): int
    {
        return 422;
    }
}
