<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    use HasFactory;
    protected $table='sites';
    protected $fillable = [
        'id',
        'name',
        'link',
        'description',
        'user_id',
    ];

    public function user()
    {
    return $this->belongsTo(User::class,'user_id');
    }
}
