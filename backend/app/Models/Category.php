<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use EloquentFilter\Filterable;

class Category extends Model
{
    use SoftDeletes, \App\Models\Traits\Uuid, Filterable;

    protected $fillable = ['name', 'description', 'is_active'];
    protected $dates = ['deleted_at'];
    protected $casts = [
      'id' => 'string', 
      'is_active' => 'bool'
    ];

    public $incrementing = false;

    public function modelFilter()
    {
      return $this->providerFilter(CategoryFilter::class);
    }
}
