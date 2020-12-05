<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CastMember extends Model
{
    const TYPE_DIRECTOR = 1;
    const TYPE_ACTOR = 2;

    use SoftDeletes, \App\Models\Traits\Uuid;
    protected $fillable = ['name', 'type'];
    protected $dates = ['deleted_at'];
    protected $casts = [
      'id' => 'string', 
      'type' => 'integer'
    ];

    public $incrementing = false;
}
