<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class VideoControllerTest extends TestCase
{
    use DatabaseMigrations;
    use TestValidations;
    use TestSaves;

    private $video;
    private $sendData;

    protected function setUp(): void
    {
        parent::setUp();
        $this->video = factory(Video::class)->create();
        $this->sendData = [
            'title' => 'title',
            'description' => 'description',
            'year_launched' => 2010,
            'rating' => Video::RATING_LIST[0],
            'duration' => 90,
        ];
    }

    public function testIndex()
    {
        $response = $this->get(route('videos.index'));

        $response
            ->assertStatus(200)
            ->assertJson([$this->video->toArray()]);
    }

    public function testShow()
    {
        $response = $this->get(route('videos.show', ['video' => $this->video->id]));

        $response
            ->assertStatus(200)
            ->assertJson($this->video->toArray());
    }

    public function testInvalidRequired()
    {
        $data = [
            'title' => '',
            'description' => '',
            'year_launched' => '',
            'rating' => '',
            'duration' => '',
        ];

        $this->assertInvalidInStoreAction($data, 'required');
        $this->assertInvalidInUpdateAction($data, 'required');
    }

    public function testInvalidMax()
    {
        $data = [
            'title' => str_repeat('a', 256)
        ];

        $this->assertInvalidInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidInUpdateAction($data, 'max.string', ['max' => 255]);
    }

    public function testInvalidInteger()
    {
        $data = [
            'duration' => 's'
        ];

        $this->assertInvalidInStoreAction($data, 'integer');
        $this->assertInvalidInUpdateAction($data, 'integer');
    }

    public function testInvalidYearLaunchedField()
    {
        $data = [
            'year_launched' => 'a'
        ];

        $this->assertInvalidInStoreAction($data, 'date_format', ['format' => 'Y']);
        $this->assertInvalidInUpdateAction($data, 'date_format', ['format' => 'Y']);
    }

    public function testInvalidOpenedField()
    {
        $data = [
            'opened' => 'x'
        ];

        $this->assertInvalidInStoreAction($data, 'boolean');
        $this->assertInvalidInUpdateAction($data, 'boolean');
    }

    public function testInvalidRatingField()
    {
        $data = [
            'rating' => 0
        ];

        $this->assertInvalidInStoreAction($data, 'in');
        $this->assertInvalidInUpdateAction($data, 'in');
    }

    public function testStore()
    {
        $data = [
            [
                'send_data' => $this->sendData,
                'test_data' => $this->sendData + ['opened' => false],
            ],
            
            [
                'send_data' => $this->sendData + ['opened' => true],
                'test_data' => $this->sendData + ['opened' => true],
            ],
            
            [
                'send_data' => $this->sendData + ['rating' => Video::RATING_LIST[1]],
                'test_data' => $this->sendData + ['rating' => Video::RATING_LIST[1]]
            ],
        ];

        foreach ($data as $key => $value) {
            $response = $this->assertStore(
                $value['send_data'],
                $value['test_data'] + ['deleted_at' => null]
            );
            $response->assertJsonStructure([
                'created_at', 
                'updated_at'
            ]);
            $response = $this->assertUpdate(
                $value['send_data'], 
                $value['test_data'] + ['deleted_at' => null]
            );
            $response->assertJsonStructure([
                'created_at', 
                'updated_at'
            ]);
        }
    }

    public function testUpdate()
    {
        $response = $this->assertUpdate($this->sendData, $this->sendData + ['opened' => false]);
        $response->assertJsonStructure(['created_at', 'updated_at']);
        $this->assertUpdate(
            $this->sendData + ['opened' => true], 
            $this->sendData + ['opened' => true]
        );
        $this->assertUpdate(
            $this->sendData + ['rating' => Video::RATING_LIST[1]], 
            $this->sendData + ['rating' => Video::RATING_LIST[1]]
        );
    }    

    public function testDestroy()
    {
        $response = $this->json('DELETE', route('videos.destroy', ['video' => $this->video->id]));

        $response
            ->assertStatus(204);

        $this->assertNull(Video::find($this->video->id));
        $this->assertNotNull(Video::withTrashed()->find($this->video->id));
    }

    protected function routeStore()
    {
        return route('videos.store');
    }

    protected function routeUpdate()
    {
        return route('videos.update', ['video' => $this->video->id]);
    }

    protected function model()
    {
        return Video::class;
    }

}
