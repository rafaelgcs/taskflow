<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user->current_team_id) {
            $team = $user->teams()->first();
            if ($team) {
                $user->update(['current_team_id' => $team->id]);
            }
        }

        $team = Team::with(['users', 'boards.columns.tasks'])->find($user->current_team_id);

        return Inertia::render('Dashboard', [
            'team' => $team,
            'userTeams' => $user->teams,
        ]);
    }
}
