<?php

namespace Tests\Feature\Models;

use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Ramsey\Uuid\Uuid;


class CastMemberTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
      factory(CastMember::class, 1)->create();
      $castMembers = CastMember::all();
      $this->assertCount(1, $castMembers);

      $expected = [
        'id', 
        'name', 
        'type', 
        'created_at',
        'updated_at',
        'deleted_at'
      ];
      $actual = array_keys($castMembers->first()->getAttributes());
      $this->assertEqualsCanonicalizing($expected, $actual);
    }

    public function testCreate()
    {
      $castMember = CastMember::create(['name' => 'teste1', 'type' => 1]);
      $castMember->refresh();

      $this->assertTrue(Uuid::isValid($castMember->id));
      $this->assertEquals('teste1', $castMember->name);
      $this->assertEquals(1, $castMember->type);

      $castMember = CastMember::create([
        'name' => 'teste1',
        'type' => 2
      ]);
      $this->assertEquals(2, $castMember->type);
    }

    public function testUpdate()
    {
      $castMember = factory(CastMember::class)->create([
        'type' => 1
      ])->first();

      $data = [
        'name' => 'test_name_updated',
        'type' => 2,
      ];

      $castMember->update($data);

      foreach($data as $key => $value) {
        $this->assertEquals($value, $castMember->{$key});
      }
    }

    public function testDelete()
    {
      $castMember = factory(CastMember::class)->create()->first();
      $castMember_list = CastMember::all();
      $this->assertCount(1, $castMember_list);

      $castMember->delete();
      $castMember_list = CastMember::all();
      $this->assertCount(0, $castMember_list); 
    }

}
