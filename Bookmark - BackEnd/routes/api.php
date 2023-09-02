<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
        Route::get('/logout', [AuthController::class, 'logout']);
        Route::get('/refresh', [AuthController::class, 'refresh']);
        Route::get('/user-profile', [AuthController::class, 'userProfile']);    

});

Route::group([
    'middleware' => 'api',
    'prefix' => 'site' 
    ],function ($router) {
        Route::get ('/get-all',[SiteController::class,'GetAll']);
        Route::get ('/get/{id}',[SiteController::class,'Get']);
        Route::post('/create',[SiteController::class,'Create']);
        Route::post('/update',[SiteController::class,'Update']);
        Route::delete('/delete/{id}',[SiteController::class,'Delete']);
    });