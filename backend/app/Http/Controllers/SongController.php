<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Song;

class SongController extends Controller
{
    private function extractVideoId($url)
    {
        $patterns = [
            '/youtube\.com\/watch\?v=([^&]+)/',
            '/youtu\.be\/([^?]+)/',
            '/youtube\.com\/embed\/([^?]+)/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return $matches[1];
            }
        }
        return null;
    }

    private function getVideoInfo($videoId)
    {
        $url = "https://www.youtube.com/watch?v=" . $videoId;
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_USERAGENT => 'Mozilla/5.0',
        ]);
        $response = curl_exec($ch);
        curl_close($ch);

        if (!preg_match('/<title>(.+?) - YouTube<\/title>/', $response, $titleMatches)) {
            throw new \Exception("Não foi possível encontrar o título do vídeo");
        }
        $title = html_entity_decode($titleMatches[1], ENT_QUOTES);

        if (preg_match('/"viewCount":\s*"(\d+)"/', $response, $viewMatches)) {
            $plays = (int)$viewMatches[1];
        } else if (preg_match('/\"viewCount\"\s*:\s*{.*?\"simpleText\"\s*:\s*\"([\d,\.]+)\"/', $response, $viewMatches)) {
            $plays = (int)str_replace(['.', ','], '', $viewMatches[1]);
        } else {
            $plays = 0;
        }

        return [
            'title' => $title,
            'plays' => $plays,
            'thumb' => 'https://img.youtube.com/vi/' . $videoId . '/hqdefault.jpg',
        ];
    }

    public function topSongs()
    {
        $topSongs = Song::where('approved', true)
            ->orderBy('plays', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'current_page' => 1,
            'data' => $topSongs,
            'total' => $topSongs->count(),
        ]);
    }

    public function otherSongs(Request $request)
    {
        $page = $request->input('page', 1);
        $pageSize = 5;

        $topIds = Song::where('approved', true)
            ->orderBy('plays', 'desc')
            ->limit(5)
            ->pluck('id')
            ->toArray();

        $query = Song::where('approved', true)
            ->whereNotIn('id', $topIds)
            ->orderBy('plays', 'desc');

        $total = $query->count();

        $songs = $query
            ->skip(($page - 1) * $pageSize)
            ->take($pageSize)
            ->get();

        return response()->json([
            'current_page' => $page,
            'data' => $songs,
            'total' => $total,
        ]);
    }

    public function pending()
    {
        $songs = Song::where('approved', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($songs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'youtube_link' => 'required|url',
            'approved' => 'boolean',
        ]);

        $videoId = $this->extractVideoId($request->youtube_link);
        if (!$videoId) {
            return response()->json(['error' => 'URL do YouTube inválida'], 422);
        }

        $videoInfo = $this->getVideoInfo($videoId);

        $song = Song::create([
            'title' => $videoInfo['title'],
            'youtube_link' => $request->youtube_link,
            'approved' => $request->input('approved', false),
            'plays' => $videoInfo['plays'],
            'thumb' => $videoInfo['thumb'],
        ]);

        return response()->json($song, 201);
    }

    public function update(Request $request, $id)
    {
        $song = Song::findOrFail($id);

        $request->validate([
            'youtube_link' => 'url',
            'approved' => 'boolean',
        ]);

        $updateData = [];

        if ($request->filled('youtube_link')) {
            $videoId = $this->extractVideoId($request->youtube_link);
            if (!$videoId) {
                return response()->json(['error' => 'URL do YouTube inválida'], 422);
            }
            $videoInfo = $this->getVideoInfo($videoId);
            $updateData['title'] = $videoInfo['title'];
            $updateData['plays'] = $videoInfo['plays'];
            $updateData['thumb'] = $videoInfo['thumb'];
            $updateData['youtube_link'] = $request->youtube_link;
        }

        if ($request->filled('approved')) {
            $updateData['approved'] = $request->approved;
        }

        $song->update($updateData);

        return response()->json($song);
    }

    public function destroy($id)
    {
        $song = Song::findOrFail($id);
        $song->delete();

        return response()->json(['message' => 'Música removida com sucesso']);
    }

    public function approve($id)
    {
        $song = Song::findOrFail($id);
        $song->approved = true;
        $song->save();

        return response()->json($song);
    }
}
