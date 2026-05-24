<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    /**
     * REGISTER
     * ─────────────────────────────────────────────
     * Creates a new student account and returns a token.
     *
     * POST /api/register
     * Body: { name, email, password, password_confirmation }
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // Create the user — password is auto-hashed by the model cast
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'student',
        ]);
        // Create a Sanctum personal access token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registrasi berhasil.',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    /**
     * LOGIN
     * ─────────────────────────────────────────────
     * Authenticates a user and returns a token.
     *
     * POST /api/login
     * Body: { email, password }
     */
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah.'
            ], 401);
        }

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil.',
            'user' => $user,
            'token' => $token,
            'role' => $user->role,
        ]);
    }

    /**
     * LOGOUT
     * ─────────────────────────────────────────────
     * Deletes the current token — user is logged out.
     *
     * POST /api/logout
     * Header: Authorization: Bearer {token}
     */
    public function logout(Request $request): JsonResponse
    {
        // Delete only the current token used for this request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil.',
        ]);
    }

    /**
     * ME (Current User)
     * ─────────────────────────────────────────────
     * Returns the currently authenticated user's data.
     * Used by the frontend on page load to restore session.
     *
     * GET /api/me
     * Header: Authorization: Bearer {token}
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }
}
