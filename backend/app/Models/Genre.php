<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use \App\ModelFilters\GenreFilter;
use EloquentFilter\Filterable;
use \App\Models\Traits\Uuid;

class Genre extends Model
{
    use SoftDeletes, Uuid, Filterable;
    protected $fillable = ['name', 'is_active'];
    protected $dates = ['deleted_at'];
    protected $casts = [
      'id' => 'string',
      'is_active' => 'bool'
    ];

    public $incrementing = false;

    public function categories()
    {
        return $this->belongsToMany(Category::class)->withTrashed();
    }

    public function modelFilter()
    {
      return $this->provideFilter(GenreFilter::class);
    }
}
