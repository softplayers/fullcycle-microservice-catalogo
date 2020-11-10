<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CastMember extends Model
{
    use SoftDeletes, \App\Models\Traits\Uuid;
    protected $fillable = ['name', 'type', 'is_active'];
    protected $dates = ['deleted_at'];
    protected $casts = [
      'id' => 'string', 
      'type' => 'integer',
      'is_active' => 'bool'
    ];

    public $incrementing = false;
}
