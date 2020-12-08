<?php

namespace Tests\Feature\Models;

use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Ramsey\Uuid\Uuid;


class VideoTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
      factory(Video::class, 1)->create();
      $videos = Video::all();
      $this->assertCount(1, $videos);

      $expected = [
        'id', 
        'title', 
        'description', 
        'year_launched',
        'opened',
        'rating',
        'duration',
        'created_at',
        'updated_at',
        'deleted_at'
      ];
      $actual = array_keys($videos->first()->getAttributes());
      $this->assertEqualsCanonicalizing($expected, $actual);
    }

    public function testCreate()
    {
      $data = [
        'title' => 'teste1',
        'description' => 'description_test',
        'year_launched' => 2000,
        'rating' => '18',
        'duration' => 90
      ];
      $video = Video::create($data);
      $video->refresh();

      $this->assertTrue(Uuid::isValid($video->id));
      foreach($data as $key => $value) {
        $this->assertEquals($value, $video->{$key});
      }
      $this->assertFalse($video->opened);
    }

    public function testUpdate()
    {
      $video = factory(Video::class)->create([
        'description' => 'test_description'
      ])->first();

      $data = [
        'title' => 'test_title_updated',
        'description' => 'test_description_updated',
        'year_launched' => 2020,
        'rating' => '10',
        'duration' => 30,
        'opened' => false
      ];

      $video->update($data);

      foreach($data as $key => $value) {
        $this->assertEquals($value, $video->{$key});
      }
    }

    public function testDelete()
    {
      $video = factory(Video::class)->create()->first();
      $video_list = Video::all();
      $this->assertCount(1, $video_list);

      $video->delete();
      $video_list = Video::all();
      $this->assertCount(0, $video_list); 
    }

}
