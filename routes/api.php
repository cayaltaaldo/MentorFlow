<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'MentorFlow API funcionando correctamente',
    ]);
});

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', [AuthController::class, 'user']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/tickets', [TicketController::class, 'index'])
        ->middleware('permission:tickets.view');

    Route::post('/tickets', [TicketController::class, 'store'])
        ->middleware('permission:tickets.create');

    Route::get('/tickets/{ticket}', [TicketController::class, 'show'])
        ->middleware('permission:tickets.view');

    Route::put('/tickets/{ticket}', [TicketController::class, 'update'])
        ->middleware('permission:tickets.update');

    Route::delete('/tickets/{ticket}', [TicketController::class, 'destroy'])
        ->middleware('permission:tickets.delete');

});