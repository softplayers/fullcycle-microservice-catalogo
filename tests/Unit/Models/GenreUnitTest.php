<?php

namespace Tests\Unit\Models;

use App\Models\Genre;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GenreUnitTest extends TestCase
{
    private $genre;

    public static function setUpBeforeClass(): void
    {
      parent::setUpBeforeClass();
    }

    public static function tearDownAfterClass(): void
    {
      parent::tearDownAfterClass();
    }

    protected function setUp(): void
    {
      parent::setUp();
      $this->genre = new Genre();
    }

    protected function tearDown(): void
    {
      parent::tearDown();
    }

    public function testIfUseTraits()
    {
      $expected = [SoftDeletes::class, Uuid::class];
      $actual = array_keys(class_uses(Genre::class));
      $this->assertEqualsCanonicalizing($expected, $actual);
    }

    public function testFillable()
    {
      $fillable = ['name', 'is_active'];
      $this->assertEqualsCanonicalizing($fillable, $this->genre->getFillable());
    }

    public function testCasts()
    {
      $expected = ['id' => 'string', 'is_active' => 'bool'];
      $this->assertEqualsCanonicalizing($expected, $this->genre->getCasts());
    }

    public function testIncrementing()
    {
      $this->assertFalse($this->genre->incrementing);
    }

    public function testDatesAttributes()
    {
      $expected = ['deleted_at', 'created_at', 'updated_at'];
      foreach ($expected as $date) {
        $this->assertContains($date, $this->genre->getDates());
      }
      $this->assertCount(count($expected), $this->genre->getDates());
    }



}
