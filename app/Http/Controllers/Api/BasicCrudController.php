<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

abstract class BasicCrudController extends Controller
{
    protected abstract function model();
    protected abstract function rulesStore();
    protected abstract function rulesUpdate();
    
    public function index()
    {
       return $this->model()::all();
    }

    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rulesStore());
        $obj = $this->model()::create($validatedData);
        $obj->refresh();
        return $obj;
    }

    protected function findOrFail($id)
    {
        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();
        return $this->model()::where($keyName, $id)->firstOrFail();
    }
    
    public function show($id)
    {
        $entity = $this->findOrFail($id);
        return $entity;
    }

    public function update(Request $request, $id)
    {
        $entity = $this->findOrFail($id);
        $validatedData = $this->validate($request, $this->rulesUpdate());
        $entity->update($validatedData);
        return $entity;
    }

    public function destroy($id)
    {
        $entity = $this->findOrFail($id);
        $entity->delete();
        return response()->noContent();
    }
}
