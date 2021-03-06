<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;

class CategoryUnitTest extends TestCase
{
    private $category;

    protected function setUp(): void
    {
      parent::setUp();
      $this->category = new Category();
    }

    protected function tearDown(): void
    {
      parent::tearDown();
    }

    public function testIfUseTraits()
    {
      $expected = [SoftDeletes::class, Uuid::class];
      $actual = array_keys(class_uses(Category::class));
      $this->assertEqualsCanonicalizing($expected, $actual);
    }

    public function testFillable()
    {
      $fillable = ['name', 'description', 'is_active'];
      $this->assertEqualsCanonicalizing($fillable, $this->category->getFillable());
    }

    public function testCasts()
    {
      $expected = ['id' => 'string', 'is_active' => 'bool'];
      $this->assertEqualsCanonicalizing($expected, $this->category->getCasts());
    }

    public function testIncrementing()
    {
      $this->assertFalse($this->category->incrementing);
    }

    public function testDatesAttributes()
    {
      $expected = ['deleted_at', 'created_at', 'updated_at'];
      foreach ($expected as $date) {
        $this->assertContains($date, $this->category->getDates());
      }
      $this->assertCount(count($expected), $this->category->getDates());
    }



}
