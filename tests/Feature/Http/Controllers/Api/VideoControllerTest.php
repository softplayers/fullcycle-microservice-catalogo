<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\VideoController;
use App\Models\Category;
use App\Models\Video;
use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Tests\Exceptions\TestException;
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
            'categories_id' => '',
            'genres_id' => '',
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

    public function testInvalidCategoriesIdField()
    {
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

    public function testInvalidGenresIdField()
    {
        $data = [
            'genres_id' => 'a'
        ];

        $this->assertInvalidInStoreAction($data, 'array');
        $this->assertInvalidInUpdateAction($data, 'array');

        $data = [
            'genres_id' => [100]
        ];

        $this->assertInvalidInStoreAction($data, 'exists');
        $this->assertInvalidInUpdateAction($data, 'exists');

        $genre = factory(Genre::class)->create();
        $genre->delete();
        $data = [
            'genres_id' => [$genre->id]
        ];
        $this->assertInvalidInStoreAction($data, 'exists');
        $this->assertInvalidInUpdateAction($data, 'exists');

    }

    public function testSave()
    {
        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($category->id);

        $data = [
            [
                'send_data' => $this->sendData + [
                    'categories_id' => [$category->id], 
                    'genres_id' => [$genre->id],
                ],
                'test_data' => $this->sendData + ['opened' => false],
            ],
            
            [
                'send_data' => $this->sendData + [
                    'categories_id' => [$category->id], 
                    'genres_id' => [$genre->id],
                    'opened' => true
                ],
                'test_data' => $this->sendData + ['opened' => true],
            ],
            
            [
                'send_data' => $this->sendData + [
                    'categories_id' => [$category->id], 
                    'genres_id' => [$genre->id],
                    'rating' => Video::RATING_LIST[1]
                ],
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
            $this->assertHasCategory(
                $response->json('id'), 
                $value['send_data']['categories_id'][0]
            );
            $this->assertHasGenre(
                $response->json('id'), 
                $value['send_data']['genres_id'][0]
            );

            $response = $this->assertUpdate(
                $value['send_data'], 
                $value['test_data'] + ['deleted_at' => null]
            );
            $response->assertJsonStructure([
                'created_at', 
                'updated_at'
            ]);
            $this->assertHasCategory(
                $response->json('id'), 
                $value['send_data']['categories_id'][0]
            );
            $this->assertHasGenre(
                $response->json('id'), 
                $value['send_data']['genres_id'][0]
            );
        }
    }

    protected function assertHasCategory($videoId, $categoryId) 
    {
        $this->assertDataBaseHas('category_video', [
            'video_id' => $videoId,
            'category_id' => $categoryId
        ]);
    }

    protected function assertHasGenre($videoId, $genreId) 
    {
        $this->assertDataBaseHas('genre_video', [
            'video_id' => $videoId,
            'genre_id' => $genreId
        ]);
    }

    public function testSyncCategories() 
    {
        $categoriesId = factory(Category::class, 3)->create()->pluck('id')->toArray();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($categoriesId);
        $genreId = $genre->id;

        $response = $this->json(
            'POST', 
            $this->routeStore(), 
            $this->sendData + [
                'genres_id' => [$genreId],
                'categories_id' => [$categoriesId[0]],
            ]
        );
        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoriesId[0],
            'video_id' => $response->json('id')
        ]);

        $response = $this->json(
            'PUT', 
            route('videos.update', ['video' => $response->json('id')]), 
            $this->sendData + [
                'genres_id' => [$genreId],
                'categories_id' => [$categoriesId[1], $categoriesId[2]],
            ]
        );
        $this->assertDatabaseMissing('category_video', [
            'category_id' => $categoriesId[0],
            'video_id' => $response->json('id')
        ]);
        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoriesId[1],
            'video_id' => $response->json('id')
        ]);
        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoriesId[2],
            'video_id' => $response->json('id')
        ]);
    }

    public function testSyncGenre() 
    {
        $genres = factory(Genre::class, 3)->create();
        $genresId = $genres->pluck('id')->toArray();
        $categoryId = factory(Category::class)->create()->id;
        $genres->each(function ($genre) use ($categoryId) {
            $genre->categories()->sync($categoryId);
        });

        $response = $this->json(
            'POST',
            $this->routeStore(),
            $this->sendData + [
                'categories_id' => [$categoryId],
                'genres_id' => [$genresId[0]]
            ]
        );
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genresId[0],
            'video_id' => $response->json('id'),
        ]);

        $response = $this->json(
            'PUT',
            route('videos.update', ['video' => $response->json('id')]),
            $this->sendData + [
                'categories_id' => [$categoryId],
                'genres_id' => [$genresId[1], $genresId[2]]
            ]
        );
        $this->assertDatabaseMissing('genre_video', [
            'genre_id' => $genresId[0],
            'video_id' => $response->json('id'),
        ]);
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genresId[1],
            'video_id' => $response->json('id'),
        ]);
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genresId[2],
            'video_id' => $response->json('id'),
        ]);
    }

    public function testRollbackStore() 
    {
        $controller = \Mockery::mock(VideoController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

        $controller
            ->shouldReceive('validate')
            ->withAnyArgs()
            ->andReturn($this->sendData);

        $controller
            ->shouldReceive('rulesStore')
            ->withAnyArgs()
            ->andReturn([]);

        $controller->shouldReceive('handleRelations')
            ->once()
            ->andThrow(new TestException());

        $request = \Mockery::mock(Request::class);
        $request->shouldReceive('get')
            ->withAnyArgs()
            ->andReturnNull();

        try {
            $controller->store($request);
        } catch(TestException $exception) {
            $this->assertCount(1, Video::all());
        }
    }

    public function testRollbackUpdate() 
    {
        $controller = \Mockery::mock(VideoController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

        $controller
            ->shouldReceive('findOrFail')
            ->withAnyArgs()
            ->andReturn($this->video);

        $controller
            ->shouldReceive('validate')
            ->withAnyArgs()
            ->andReturn(['name' => 'test']);

        $controller
            ->shouldReceive('rulesUpdate')
            ->withAnyArgs()
            ->andReturn([]);

        $controller->shouldReceive('handleRelations')
            ->once()
            ->andThrow(new TestException());

        $request = \Mockery::mock(Request::class);
        $request->shouldReceive('get')
            ->withAnyArgs()
            ->andReturnNull();

        try {
            $controller->update($request, 1);
        } catch(TestException $exception) {
            $this->assertCount(1, Video::all());
        }
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
