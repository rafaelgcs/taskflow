<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function switch(Request $request)
    {
        $request->validate(['team_id' => 'required|exists:teams,id']);
        
        $team = clone $request->user()->teams()->where('teams.id', $request->team_id)->firstOrFail();
        $request->user()->update(['current_team_id' => $team->id]);
        
        return back();
    }
    
    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $team = Team::create([
            'name' => $request->name, 
            'owner_id' => $request->user()->id,
            'invite_code' => \Illuminate\Support\Str::random(10)
        ]);
        $team->users()->attach($request->user()->id, ['role' => 'owner']);
        
        $board = \App\Models\Board::create(['name' => 'General Board', 'team_id' => $team->id]);
        \App\Models\Column::insert([
            ['name' => 'A Fazer', 'board_id' => $board->id, 'position' => 0],
            ['name' => 'Em Progresso', 'board_id' => $board->id, 'position' => 1],
            ['name' => 'Concluído', 'board_id' => $board->id, 'position' => 2],
        ]);
        
        $request->user()->update(['current_team_id' => $team->id]);
        return back();
    }

    public function update(Request $request, Team $team)
    {
        $request->validate(['name' => 'required|string|max:255']);
        
        // Authorization: Ensure user is owner or part of team.
        if ($request->user()->teams()->where('teams.id', $team->id)->exists()) {
            $team->update(['name' => $request->name]);
        }
        
        return back();
    }

    public function destroy(Request $request, Team $team)
    {
        // Simple auth
        if ($team->owner_id === $request->user()->id) {
            $team->delete();
            // Assign next available team
            $next = $request->user()->teams()->first();
            $request->user()->update(['current_team_id' => $next ? $next->id : null]);
        }
        return back();
    }

    public function join(Request $request, $code)
    {
        $team = Team::where('invite_code', $code)->firstOrFail();
        
        // Prevent duplicate attaches
        if (!$team->users()->where('users.id', $request->user()->id)->exists()) {
            $team->users()->attach($request->user()->id, ['role' => 'member']);
        }
        
        $request->user()->update(['current_team_id' => $team->id]);
        return redirect()->route('kanban.index');
    }
}
