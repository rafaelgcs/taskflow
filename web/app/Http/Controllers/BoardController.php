<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BoardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user->current_team_id) return redirect('/dashboard');
        
        $team = clone $user->teams()->where('teams.id', $user->current_team_id)->first();
        if (!$team) return redirect('/dashboard');
        
        $boards = $team->boards()->with(['columns' => function($q) {
            $q->orderBy('position');
        }, 'columns.tasks'])->get();
        
        return Inertia::render('Kanban/Index', [
            'activeTeam' => $team,
            'boards' => $boards,
            'userTeams' => $user->teams,
        ]);
    }

    public function store(Request $request)
    {
        $board = Board::create([
            'name' => $request->name ?? 'New Board',
            'team_id' => $request->user()->current_team_id
        ]);
        return back();
    }
}
