<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use EloquentFilter\Filterable;
use \App\Models\Traits\Uuid;
use \App\ModelFilters\CategoryFilter;

class Category extends Model
{
    use SoftDeletes, Uuid, Filterable;

    protected $fillable = ['name', 'description', 'is_active'];
    protected $dates = ['deleted_at'];
    protected $casts = [
      'id' => 'string', 
      'is_active' => 'bool'
    ];

    public $incrementing = false;

    public function modelFilter()
    {
      return $this->provideFilter(CategoryFilter::class);
    }
}
