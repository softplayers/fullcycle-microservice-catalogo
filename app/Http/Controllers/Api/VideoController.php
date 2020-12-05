<?php

namespace App\Http\Controllers\Api;

use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends BasicCrudController
{

    private $rules;

    public function __construct() 
    {
        $this->rules = [
            'title' => 'required|max:255',
            'description' => 'required',
            'year_launched' => 'required|date_format:Y',
            'opened' => 'boolean',
            'rating' => 'required|in:' . implode(',', Video::RATING_LIST),
            'duration' => 'required|integer',
            'categories_id' => 'required|array|exists:categories,id',
            'genres_id' => 'required|array|exists:genres,id',
        ];
    }

    public function store(Request $request) 
    {
        $validData = $this->validate($request, $this->rulesStore());
        $entity = $this->model()::create($validData);
        $entity->categories()->sync($request->get('categories_id'));
        $entity->genres()->sync($request->get('genres_id'));
        $entity->refresh();
        return $entity;
    }

    public function update(Request $request, $id) 
    {
        $entity = $this->findOrFail($id);
        $validatedData = $this->validate($request, $this->rulesUpdate());
        $entity->categories()->sync($request->get('categories_id'));
        $entity->genres()->sync($request->get('genres_id'));
        $entity->update($validatedData);
        return $entity;
    }

    protected function model()
    {
        return Video::class;
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
