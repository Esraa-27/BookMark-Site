<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Validator;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    public function __construct() {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

        /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:6',
        ]);
       

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json(['error' => $errors], 400);
        }

        $user = User::create(array_merge(
                    $validator->validated(),
                    ['password' => bcrypt($request->password)]
                ));
        $token = auth()->attempt($validator->validated());
        return response()->json([
            'message' => 'User successfully registered',
            'token' =>  $this->createNewToken($token),
            'user'=>new UserResource(auth()->user())
        ], 200);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request){
    	$validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors()->all(), 422);
        }
        if (! $token = auth()->attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return response()->json([
            'token' =>  $this->createNewToken($token),
            'user'=>new UserResource(auth()->user())
        ], 200);
    }

    public function refresh() {
        try {
            $newToken=$this->createNewToken(auth()->refresh());
            return response()->json([
                'token'=> $newToken
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Unauthorized'],401);
            
        }
    }
    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile() {
        try {
            $currUser=auth()->user();
            return response()->json(new UserResource($currUser));

        } catch (\Throwable $th) {
            return response()->json(['error' => 'Unauthorized'],401);
            
        }
        
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout() {
       try{
           auth()->logout();
           return response()->json(['message' => 'User successfully signed out'],200);
       }
       catch(\Throwable  $th){
           return response()->json(['message' => 'User invalid'],401);
       }
    }
    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createNewToken($token){
        return $token ;
    }
}

