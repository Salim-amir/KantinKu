<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsStudent
{
    /**
     * Only allow users with role = 'student' through.
     * Admins cannot use student-only endpoints.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isStudent()) {
            return response()->json([
                'message' => 'Forbidden. Student access required.',
            ], 403);
        }

        return $next($request);
    }
}