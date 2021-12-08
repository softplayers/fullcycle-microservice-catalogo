<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Genre;
use App\Models\CastMember;
use App\Observers\SyncModelObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        \View::addExtension('html', 'blade');
    }
}
