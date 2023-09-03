<?php

namespace App\Http\Controllers;
use App\Http\Resources\SiteResource;
use Illuminate\Http\Request;
use App\Models\Site;
use Validator;
use Auth;

class SiteController extends Controller
{
      //  /site/get-all
      public function GetAll(){
        try {
            
            $user = Auth::user();
            if(is_null($user))
                return response()->json([
                    'message' => 'Unauthorized'
                ], 401);

            $sites=Site::where('user_id', '=', $user->id)->select('*')->get();
            if($sites->isEmpty()){
                return response()->json(["message"=>"Empty" , "data"=>$sites]);
            }
            else{
                $sites=SiteResource::collection($sites);
                return response()->json([ "data"=>$sites]);
            }
        } catch (\Throwable $e) {
            // Handle token authentication error
            return response()->json([
                //'message' => 'Unauthorized',
                'error'=>"$e"
            ], 200);
        }
       
    }

    public function Get($id){
        $user = Auth::user();
        if(is_null($user))
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);

        $site=Site::where('id', '=', $id)->where('user_id', '=', $user->id)->select('*')->first();
       // $site=$sites->find($id);
        if(empty($site) ){
            return response()->json(["message"=>" no site" , "data"=>null]);
        }
        if($site->user_id!=$user->id)
            return response()->json(['message' => 'Unauthorized'],401);
        else{
            $site=new SiteResource($site);
            return response()->json( ["data"=>$site]);
        }
        return response()->json(['message' => 'nothing'],200);
    }

    public function Create(Request $request){

        $user = Auth::user();
        if(is_null($user))
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);

        $sites=Site::where('user_id', '=', $user->id)->where('link', '=', $request->link)->select('*')->first();
        if(!empty($sites)){
            return response()->json(["message"=>"Sorry ,this Site added before" ,"hasError"=>true],200);
        }
        
        try{
            $site= new Site;
            $site->name=$request->name;
            $site->description=$request->description??" ";
            $site->link=$request->link;
            $site->user_id=$user->id;
    
            $site->save();
    
            return response()->json([ "message"=>"site added",'site'=>new SiteResource($site) ,"hasError"=>false]);
        }
        catch(\throw $th){
            return response()->json([ "message"=>"Sorry ,Can't add ","error"=>$th,"hasError"=>true]);
        }
    }

    public function Update(Request $request){
        $user = Auth::user();
        if(is_null($user))
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);

        $site= Site::find($request->id);
        if(empty($site) ){
            return response()->json(
                ["message"=>" no site"]);
        }
        else if($request->user_id!=$user->id){
            return response()->json(
                ["message"=>"Unauthorized"],401);
        }
        $sites=Site::where('user_id', '=', $user->id)->where('link', '=', $request->link)->where('id', '!=', $request->id)->select('*')->first();
        if(!empty($sites)){
            return response()->json(
                ["message"=>"Sorry ,this Site added before" ,"hasError"=>true],200);
        }
        else{
            $site->name= is_null($request->name)?$site->name:$request->name;
            $site->description= is_null($request->description)?$site->description:$request->description;
            $site->link= is_null($request->link)?$site->link:$request->link;

        }
        $site->save();

        return response()->json([ "message"=>"site updated",'site'=>new SiteResource($site) ]);
        
    }

    public function Delete($id){
        $user = Auth::user();
        if(is_null($user))
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);

        $site= Site::find($id);
        if(empty($site) ){
            return response()->json(
                ["message"=>"site not found"],400);
        }else{
            $site->delete();
            return response()->json([ "message"=>"site deleted"]);
        }
        
    }


   
}
