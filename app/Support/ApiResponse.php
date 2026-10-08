<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Satu-satunya cara membentuk response API di template ini.
 *
 * Envelope sukses : { success: true,  message, data, meta }
 * Envelope error  : { success: false, message, code, errors }
 *
 * Jangan pernah return model/Eloquent mentah dari controller,
 * selalu lewat ApiResponse + API Resource.
 */
final class ApiResponse
{
    /**
     * Response sukses standar.
     */
    public static function success(mixed $data = null, string $message = 'OK', int $status = 200, mixed $meta = null): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'meta' => $meta,
        ], $status);
    }

    /**
     * Response error standar.
     *
     * @param  string  $code  Kode machine-readable yang STABIL (mis. 'validation_failed',
     *                        'insufficient_stock'). Jangan pakai pesan acak sebagai kode,
     *                        client (termasuk mobile) branching dari sini.
     * @param  array<string, array<int, string>>  $errors  Detail per-field (validasi).
     */
    public static function error(string $message, string $code = 'error', int $status = 400, array $errors = []): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'code' => $code,
            'errors' => $errors,
        ], $status);
    }

    /**
     * Response list ter-paginasi. Resource class dipetakan otomatis,
     * meta paginator selalu ada di dalam envelope.
     */
    public static function paginated(LengthAwarePaginator $paginator, string $resourceClass, string $message = 'OK'): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $resourceClass::collection($paginator->getCollection()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    /**
     * Shortcut 404 standar.
     */
    public static function notFound(string $message = 'Data tidak ditemukan.'): JsonResponse
    {
        return self::error($message, 'not_found', 404);
    }
}
