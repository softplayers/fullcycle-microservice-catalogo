<?php

namespace Tests\Unit\Models;

use App\Models\Video;
use App\Models\Traits\Uuid;
use App\Models\Traits\UploadFiles;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;

class VideoUnitTest extends TestCase
{
    private $video;

    protected function setUp(): void
    {
      parent::setUp();
      $this->video = new Video();
    }

    protected function tearDown(): void
    {
      parent::tearDown();
    }

    public function testIfUseTraits()
    {
      $expected = [SoftDeletes::class, Uuid::class, UploadFiles::class];
      $actual = array_keys(class_uses(Video::class));
      $this->assertEqualsCanonicalizing($expected, $actual);
    }

    public function testFillable()
    {
      $fillable = [
        'title',
        'description',
        'year_launched',
        'opened',
        'rating',
        'duration',
        'video_file',
        'thumb_file',
        'banner_file',
        'trailer_file',
      ];
      $this->assertEqualsCanonicalizing($fillable, $this->video->getFillable());
    }

    public function testCasts()
    {
      $expected = [
        'id' => 'string',
        'opened' => 'boolean',
        'year_launched' => 'integer',
        'duration' => 'integer'
      ];
      $this->assertEqualsCanonicalizing($expected, $this->video->getCasts());
    }

    public function testIncrementing()
    {
      $this->assertFalse($this->video->incrementing);
    }

    public function testDatesAttributes()
    {
      $expected = ['deleted_at', 'created_at', 'updated_at'];
      foreach ($expected as $date) {
        $this->assertContains($date, $this->video->getDates());
      }
      $this->assertCount(count($expected), $this->video->getDates());
    }

}
