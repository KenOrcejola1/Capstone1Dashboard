<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use Illuminate\Http\Request;

class ChapterController extends Controller
{
    public function index(Request $request)
    {
        $query = Chapter::query()->where('is_active', true)->orderBy('name');

        if ($request->boolean('with_officers')) {
            $query->with(['activeOfficers.user']);
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        return response()->json(Chapter::with(['activeOfficers.user'])->findOrFail($id));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:chapters,name',
            'description' => 'nullable|string|max:500',
        ]);

        $chapter = Chapter::create($validated);

        return response()->json($chapter, 201);
    }

    public function update(Request $request, $id)
    {
        $chapter = Chapter::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:chapters,name,' . $chapter->id,
            'description' => 'nullable|string|max:500',
        ]);

        $chapter->update($validated);

        return response()->json($chapter);
    }

    public function destroy($id)
    {
        $chapter = Chapter::findOrFail($id);
        $chapter->update(['is_active' => false]);

        return response()->json(['message' => 'Chapter deactivated successfully']);
    }
}
