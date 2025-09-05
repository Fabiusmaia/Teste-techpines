<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SongController;
use App\Http\Controllers\AuthController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/songs/top', [SongController::class, 'topSongs']);
Route::get('/songs/other', [SongController::class, 'otherSongs']);
Route::post('/songs', [SongController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::put('/songs/{id}', [SongController::class, 'update']);
    Route::delete('/songs/{id}', [SongController::class, 'destroy']);
    Route::put('/songs/approve/{id}', [SongController::class, 'approve']);
    Route::get('/songs/pending', [SongController::class, 'pending']);
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});
