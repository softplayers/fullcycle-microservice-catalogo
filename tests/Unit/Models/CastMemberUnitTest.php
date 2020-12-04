<?php

namespace Tests\Unit\Models;

use App\Models\CastMember;
use App\Models\Genre;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CastMemberUnitTest extends TestCase
{
    private $castMember;

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
      $this->castMember = new CastMember();
    }

    protected function tearDown(): void
    {
      parent::tearDown();
    }

    public function testIfUseTraits()
    {
      $expected = [SoftDeletes::class, Uuid::class];
      $actual = array_keys(class_uses(CastMember::class));
      $this->assertEqualsCanonicalizing($expected, $actual);
    }

    public function testFillable()
    {
      $fillable = ['name', 'type'];
      $this->assertEqualsCanonicalizing($fillable, $this->castMember->getFillable());
    }

    public function testCasts()
    {
      $expected = ['id' => 'string', 'type' => 'integer'];
      $this->assertEqualsCanonicalizing($expected, $this->castMember->getCasts());
    }

    public function testIncrementing()
    {
      $this->assertFalse($this->castMember->incrementing);
    }

    public function testDatesAttributes()
    {
      $expected = ['deleted_at', 'created_at', 'updated_at'];
      foreach ($expected as $date) {
        $this->assertContains($date, $this->castMember->getDates());
      }
      $this->assertCount(count($expected), $this->castMember->getDates());
    }

}
