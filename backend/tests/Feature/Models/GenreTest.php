<?php

namespace Tests\Feature\Models;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Ramsey\Uuid\Uuid;

class GenreTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
      factory(Genre::class, 1)->create();
      $categories = Genre::all();
      $this->assertCount(1, $categories);

      $expected = [
        'id', 
        'name', 
        'is_active',
        'created_at',
        'updated_at',
        'deleted_at'
      ];
      $actual = array_keys($categories->first()->getAttributes());
      $this->assertEqualsCanonicalizing($expected, $actual);
    }

    public function testCreate()
    {
      $genre = Genre::create(['name' => 'teste1']);
      $genre->refresh();

      $this->assertTrue(Uuid::isValid($genre->id));
      $this->assertEquals('teste1', $genre->name);
      $this->assertTrue($genre->is_active);

      $genre = Genre::create([
        'name' => 'teste1',
        'is_active' => false
      ]);
      $this->assertFalse($genre->is_active);

      $genre = Genre::create([
        'name' => 'teste1',
        'is_active' => true
      ]);
      $this->assertTrue($genre->is_active);

    }

    public function testUpdate()
    {
      /** @var Genre $genre */
      $genre = factory(Genre::class)->create()->first();

      $data = [
        'name' => 'test_name_updated',
        'is_active' => true,
      ];

      $genre->update($data);

      foreach($data as $key => $value) {
        $this->assertEquals($value, $genre->{$key});
      }
    }

    public function testDelete()
    {
      $genre = factory(Genre::class)->create()->first();
      $genre_list = Genre::all();
      $this->assertCount(1, $genre_list);

      $genre->delete();
      $genre_list = Genre::all();
      $this->assertCount(0, $genre_list); 
    }

}
