<?php

namespace Database\Factories;

use App\Models\Song;
use Illuminate\Database\Eloquent\Factories\Factory;

class SongFactory extends Factory
{
    protected $model = Song::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence(3),
            'youtube_link' => 'https://www.youtube.com/watch?v=bv3593lmltY',
            'approved' => false,
            'plays' => $this->faker->numberBetween(0, 1000),
        ];
    }
}