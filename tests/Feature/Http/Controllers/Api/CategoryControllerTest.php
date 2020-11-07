<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class CategoryControllerTest extends TestCase
{
    use DatabaseMigrations;
    use TestValidations;
    use TestSaves;

    private $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->category = factory(Category::class)->create();
    }

    public function testIndex()
    {
        $response = $this->get(route('categories.index'));

        $response
            ->assertStatus(200)
            ->assertJson([$this->category->toArray()]);
    }

    public function testShow()
    {
        $response = $this->get(route('categories.show', ['category' => $this->category->id]));

        $response
            ->assertStatus(200)
            ->assertJson($this->category->toArray());
    }

    public function testInvalidData()
    {
        $data = ['name' => ''];
        $this->assertInvalidInStoreAction($data, 'required');
        $this->assertInvalidInUpdateAction($data, 'required');

        $data = ['name' => str_repeat('a', 256)];
        $this->assertInvalidInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidInUpdateAction($data, 'max.string', ['max' => 255]);

        $data = ['is_active' => 'a'];
        $this->assertInvalidInStoreAction($data, 'boolean');
        $this->assertInvalidInUpdateAction($data, 'boolean');
    }

    public function testStore()
    {
        $data = ['name' => 'test'];
        $response = $this->assertStore($data, $data + ['description' => null, 'is_active' => true, 'deleted_at' => null]);
        $response->assertJsonStructure(['created_at', 'updated_at']);

        $data = [
            'name' => 'test',
            'description' => 'description',
            'is_active' => false
        ];
        $this->assertStore($data, $data);
    }


    public function testUpdate()
    {
        $this->category = factory(Category::class)->create([
            'description' => 'description',
            'is_active' => false
        ]);
        $data = [
            'name' => 'test',
            'description' => 'teste',
            'is_active' => true
        ];
        $response = $this->assertUpdate($data, $data + ['deleted_at' => null]);
        $response->assertJsonStructure(['created_at', 'updated_at']);

        $data = [
            'name' => 'test',
            'description' => '',
        ];
        $response = $this->assertUpdate($data, array_merge($data, ['description' => null]));

        $data['description'] = 'test';
        $response = $this->assertUpdate($data, array_merge($data, ['description' => 'test']));

        $data['description'] = null;
        $response = $this->assertUpdate($data, array_merge($data, ['description' => null]));
    }    

    public function testDestroy()
    {
        $response = $this->json('DELETE', route('categories.destroy', ['category' => $this->category->id]));

        $response
            ->assertStatus(204);

        $this->assertNull(Category::find($this->category->id));
        $this->assertNotNull(Category::withTrashed()->find($this->category->id));
    }

    protected function routeStore()
    {
        return route('categories.store');
    }

    protected function routeUpdate()
    {
        return route('categories.update', ['category' => $this->category->id]);
    }

    protected function model()
    {
        return Category::class;
    }

}
