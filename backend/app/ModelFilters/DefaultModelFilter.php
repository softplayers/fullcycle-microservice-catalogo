<?php 

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;

class DefaultModelFilter extends ModelFilter
{
    protected $sortable = [];

    public function setup($search) 
    {
        $this->blacklistMethod('isSortable');

        $noSort = $this->input('sort', '') === '';
        if ($noSort) {
            $this->orderBy('created_at', 'DESC');
        }
    }


    public function sort($column) 
    {
        if (methos_exists($this, $method = 'sortBy' . Str::studly($column))){
            $this.$method();
        }

        if ($this->isSortable($column)) {
            $dir = strtolower($this->input('dir')) == 'asc' ? 'ASC' : 'DESC';
            $this->orderBy('created_at', 'DESC');
        }
    }

    protected function isSortable($column) 
    {
       return in_array($column, $this->sortable);
    }
}
