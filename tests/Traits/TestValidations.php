<?php
declare(strict_types=1);

namespace Tests\Traits;

use Illuminate\Foundation\Testing\TestResponse;

trait TestValidations
{
    /*
    protected abstract function routeStore();
    protected abstract function routeUpdate();
    */

    protected function assertInvalidInStoreAction(
        array $data,
        string $rule,
        $ruleParams = []
    ) {
        $response = $this->json('POST', $this->routeStore(), $data);
        $fields = array_keys($data);
        $this->assertInvalidFields($response, $fields, $rule, $ruleParams);
    }
    
    protected function assertInvalidInUpdateAction(
        array $data,
        string $rule,
        $ruleParams = []
    ) {
        $response = $this->json('PUT', $this->routeUpdate(), $data);
        $fields = array_keys($data);
        $this->assertInvalidFields($response, $fields, $rule, $ruleParams);
    }
    
    protected function assertInvalidFields(
        TestResponse $response,
        array $fields,
        string $rule,
        array $ruleParams = []
    ) {
        $response
        ->assertStatus(422)
        ->assertJsonValidationErrors($fields);

        foreach ($fields as $field) {
        $fieldName = str_replace('_', ' ', $field);
        $response->assertJsonFragment([
                \Lang::get("validation.{$rule}", ['attribute' => $fieldName] + $ruleParams)
            ]);
        }
    }

}