<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request=null)
    {
        if(is_null($request))
            return null;
            
        return [
            'id'=>$this->id,
            'name'=>$this->name,
            'link'=>$this->link,
            'description'=>$this->description
        ];
    }
}
