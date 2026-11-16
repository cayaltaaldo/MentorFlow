
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketCatalogController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TicketDashboardController;
use Illuminate\Support\Facades\Route;


Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'MentorFlow API funcionando correctamente',
    ]);
});

/*
|--------------------------------------------------------------------------
| Autenticación pública
|--------------------------------------------------------------------------
*/

Route::post('/register', [
    AuthController::class,
    'register',
]);

Route::post('/login', [
    AuthController::class,
    'login',
]);

/*
|--------------------------------------------------------------------------
| Rutas protegidas con Sanctum
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Usuario autenticado

    Route::get('/user', [
        AuthController::class,
        'user',
    ]);

    Route::post('/logout', [
        AuthController::class,
        'logout',
    ]);

    /*
    |--------------------------------------------------------------------------
    | Catálogos de tickets
    |--------------------------------------------------------------------------
    */

    Route::middleware('permission:tickets.create')->group(function () {

        Route::get('/ticket-categories', [
            TicketCatalogController::class,
            'categories',
        ]);

        Route::get('/ticket-priorities', [
            TicketCatalogController::class,
            'priorities',
        ]);

    });

    /*
    |--------------------------------------------------------------------------
    | Gestión de tickets
    |--------------------------------------------------------------------------
    */

    Route::get('/tickets', [
        TicketController::class,
        'index',
    ])->middleware('permission:tickets.view');

    Route::post('/tickets', [
        TicketController::class,
        'store',
    ])->middleware('permission:tickets.create');

    Route::get('/tickets/{ticket}', [
        TicketController::class,
        'show',
    ])->middleware('permission:tickets.view');

    Route::put('/tickets/{ticket}', [
        TicketController::class,
        'update',
    ])->middleware('permission:tickets.update');

    Route::delete('/tickets/{ticket}', [
        TicketController::class,
        'destroy',
    ])->middleware('permission:tickets.delete');

    Route::patch('/tickets/{ticket}/status', [
        TicketController::class,
        'changeStatus',
    ])->middleware('permission:tickets.update');

    Route::get('/tickets/{ticket}/history', [
        TicketController::class,
        'history',
    ])->middleware('permission:tickets.view');

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard/tickets', [
        TicketDashboardController::class,
        'index',
    ])->middleware('permission:tickets.view_all');

});
