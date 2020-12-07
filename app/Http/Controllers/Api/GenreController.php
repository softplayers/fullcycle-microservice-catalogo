<?php

namespace App\Http\Controllers\Api;

use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends BasicCrudController
{

    private $rules =[
        'name' => 'required|max:255',
        'is_active' => 'boolean',
        'categories_id' => 'required|array|exists:categories,id,deleted_at,NULL'
    ];

    public function store(Request $request)
    {
        $validData = $this->validate($request, $this->rulesStore());
        $self = $this;

        $entity = \DB::transaction(function() use($request, $validData, $self) {
            $entity = $this->model()::create($validData);
            $self->handleRelations($entity, $request);
            return $entity;
        });

        $entity->refresh();
        return $entity;
    }

    public function update(Request $request, $id)
    {
        $entity = $this->findOrFail($id);
        $validData = $this->validate($request, $this->rulesUpdate());
        $self = $this;

        $entity = \DB::transaction(function() use($request, $validData, $self, $entity) {
            $entity->update($validData);
            $self->handleRelations($entity, $request);
            return $entity;
        });
        return $entity;
    }

    protected function handleRelations($entity, Request $request) {
        $entity->categories()->sync($request->get('categories_id'));
    }

    protected function model()
    {
        return Genre::class;
    }

    protected function rulesStore()
    {
        return $this->rules;
    }

    protected function rulesUpdate()
    {
        return $this->rules;
    }
}
