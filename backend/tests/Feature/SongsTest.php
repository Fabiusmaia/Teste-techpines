<?php

use App\Models\User;
use App\Models\Song;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('registers a new user', function () {
    $response = $this->postJson('/api/auth/register', [
        'name' => 'Teste',
        'email' => 'teste@example.com',
        'password' => '12345678',
        'password_confirmation' => '12345678',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure(['access_token']);
});

it('logs in a user', function () {
    $user = User::factory()->create(['password' => bcrypt('12345678')]);

    $response = $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => '12345678',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure(['access_token']);
});

it('allows anyone to create a song with approved false', function () {
    $response = $this->postJson('/api/songs', [
        'youtube_link' => 'https://www.youtube.com/watch?v=bv3593lmltY',
    ]);

    $response->assertStatus(201)
        ->assertJsonFragment(['approved' => false])
        ->assertJsonStructure([
            'id',
            'title',
            'youtube_link',
            'approved',
            'plays',
            'created_at',
            'updated_at'
        ]);
});


it('allows authenticated user to create a song', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $response = $this->postJson('/api/songs', [
        'youtube_link' => 'https://www.youtube.com/watch?v=bv3593lmltY',
        'approved' => true,
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'id',
            'title',
            'youtube_link',
            'approved',
            'plays',
            'created_at',
            'updated_at'
        ]);
});

it('retrieves top songs', function () {
    Song::factory()->count(10)->create(['approved' => true, 'plays' => 100]);

    $response = $this->getJson('/api/songs/top');
    $response->assertStatus(200)
        ->assertJsonCount(6, 'data');
});

it('retrieves other songs with pagination', function () {
    Song::factory()->count(20)->create(['approved' => true, 'plays' => 50]);

    $response = $this->getJson('/api/songs/other?page=2');
    $response->assertStatus(200)
        ->assertJsonStructure(['data', 'current_page', 'total']);
});

it('allows authenticated user to update a song', function () {
    $user = User::factory()->create();
    $song = Song::factory()->create(['approved' => false]);
    $this->actingAs($user, 'sanctum');

    $response = $this->putJson("/api/songs/{$song->id}", [
        'approved' => true
    ]);

    $response->assertStatus(200)
        ->assertJsonFragment(['approved' => true]);
});

it('allows authenticated user to delete a song', function () {
    $user = User::factory()->create();
    $song = Song::factory()->create();
    $this->actingAs($user, 'sanctum');

    $response = $this->deleteJson("/api/songs/{$song->id}");
    $response->assertStatus(200)
        ->assertJson(['message' => 'Música removida com sucesso']);
});

it('allows authenticated user to approve a song', function () {
    $user = User::factory()->create();
    $song = Song::factory()->create(['approved' => false]);
    $this->actingAs($user, 'sanctum');

    $response = $this->putJson("/api/songs/approve/{$song->id}");
    $response->assertStatus(200)
        ->assertJsonFragment(['approved' => true]);
});

it('retrieves pending songs for authenticated user', function () {
    $user = User::factory()->create();
    Song::factory()->count(3)->create(['approved' => false]);
    $this->actingAs($user, 'sanctum');

    $response = $this->getJson('/api/songs/pending');
    $response->assertStatus(200)
        ->assertJsonCount(3);
});
