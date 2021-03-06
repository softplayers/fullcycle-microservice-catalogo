<?php

namespace Tests\Feature\Models;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Ramsey\Uuid\Uuid;


class CategoryTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
      factory(Category::class, 1)->create();
      $categories = Category::all();
      $this->assertCount(1, $categories);

      $expected = [
        'id', 
        'name', 
        'description', 
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
      $category = Category::create(['name' => 'teste1']);
      $category->refresh();

      $this->assertTrue(Uuid::isValid($category->id));
      $this->assertEquals('teste1', $category->name);
      $this->assertNull($category->description);
      $this->assertTrue($category->is_active);

      $category = Category::create([
        'name' => 'teste1',
        'description' => null
      ]);
      $this->assertNull($category->description);

      $category = Category::create([
        'name' => 'teste1',
        'description' => 'test_description'
      ]);
      $this->assertEquals('test_description', $category->description);

      $category = Category::create([
        'name' => 'teste1',
        'is_active' => false
      ]);
      $this->assertFalse($category->is_active);

      $category = Category::create([
        'name' => 'teste1',
        'is_active' => true
      ]);
      $this->assertTrue($category->is_active);

    }

    public function testUpdate()
    {
      /** @var Category $category */
      $category = factory(Category::class)->create([
        'description' => 'test_description'
      ])->first();

      $data = [
        'name' => 'test_name_updated',
        'description' => 'test_description_updated',
        'is_active' => true,
      ];

      $category->update($data);

      foreach($data as $key => $value) {
        $this->assertEquals($value, $category->{$key});
      }
    }

    public function testDelete()
    {
      $category = factory(Category::class)->create()->first();
      $category_list = Category::all();
      $this->assertCount(1, $category_list);

      $category->delete();
      $category_list = Category::all();
      $this->assertCount(0, $category_list); 
    }

}
