<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class GenreControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;

    private $genre;

    protected function setUp(): void
    {
        parent::setUp();
        $this->genre = factory(Genre::class)->create();
    }

    public function testIndex()
    {
        $response = $this->get(route('genres.index'));

        $response
            ->assertStatus(200)
            ->assertJson([$this->genre->toArray()]);
    }

    public function testShow()
    {
        $response = $this->get(route('genres.show', ['genre' => $this->genre->id]));

        $response
            ->assertStatus(200)
            ->assertJson($this->genre->toArray());
    }

    public function testInvalidData()
    {
        $data = [
            'name' => '',
            'categories_id' => ''
        ];
        $this->assertInvalidInStoreAction($data, 'required');
        $this->assertInvalidInUpdateAction($data, 'required');

        $data = [
            'name' => str_repeat('a', 256),
        ];
        $this->assertInvalidInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidInUpdateAction($data, 'max.string', ['max' => 255]);

        $data = [
            'is_active' => 'a'
        ];
        $this->assertInvalidInStoreAction($data, 'boolean');
        $this->assertInvalidInUpdateAction($data, 'boolean');

        $data = [
            'categories_id' => 'a'
        ];
        $this->assertInvalidInStoreAction($data, 'array');
        $this->assertInvalidInUpdateAction($data, 'array');

        $data = [
            'categories_id' => [100]
        ];
        $this->assertInvalidInStoreAction($data, 'exists');
        $this->assertInvalidInUpdateAction($data, 'exists');

        $category = factory(Category::class)->create();
        $category->delete();
        $data = [
            'categories_id' => [$category->id]
        ];
        $this->assertInvalidInStoreAction($data, 'exists');
        $this->assertInvalidInUpdateAction($data, 'exists');
    }

    public function testStore()
    {
        $category = factory(Category::class)->create();
        $data = ['name' => 'test'];
        $response = $this->assertStore(
            $data + ['categories_id' => [$category->id]], 
            $data + ['is_active' => true, 'deleted_at' => null]
        );
        $response->assertJsonStructure(['created_at', 'updated_at']);
        $this->assertHasCategory($response->json('id'), $category->id);

        $data = [
            'name' => 'test',
            'is_active' => false
        ];
        $this->assertStore(
            $data + ['categories_id' => [$category->id]], 
            $data + ['is_active' => false],
        );
    }


    public function testUpdate()
    {
        $category = factory(Category::class)->create();
        $data = [
            'name' => 'test',
            'is_active' => true
        ];
        $response = $this->assertUpdate(
            $data + ['categories_id' => [$category->id]], 
            $data + ['deleted_at' => null]
        );
        $response->assertJsonStructure(['created_at', 'updated_at']);
        $this->assertHasCategory($response->json('id'), $category->id);
    }    

    protected function assertHasCategory($genreId, $categoryId) 
    {
        $this->assertDataBaseHas('category_genre', [
            'genre_id' => $genreId,
            'category_id' => $categoryId
        ]);
    }

    public function testDestroy()
    {
        $genre = factory(Genre::class)->create();

        $response = $this->json('DELETE', route('genres.destroy', ['genre' => $genre->id]));

        $response
            ->assertStatus(204);

        $this->assertNull(Genre::find($genre->id));
        $this->assertNotNull(Genre::withTrashed()->find($genre->id));
    }

    protected function routeStore()
    {
        return route('genres.store');
    }

    protected function routeUpdate()
    {
        return route('genres.update', ['genre' => $this->genre->id]);
    }

    protected function model()
    {
        return Genre::class;
    }

}

