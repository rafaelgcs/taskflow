<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RankingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user->current_team_id) {
            return redirect()->route('dashboard');
        }

        $team = Team::with(['users', 'boards.columns.tasks'])->find($user->current_team_id);

        $memberStats = [];
        
        // Baseline users
        foreach ($team->users as $member) {
            $memberStats[$member->id] = [
                'id' => $member->id,
                'name' => $member->name,
                'role' => $member->pivot->role,
                'completed_tasks' => 0,
                'ongoing_tasks' => 0,
                'total_tasks' => 0
            ];
        }

        // Tally tasks per user
        foreach ($team->boards as $board) {
            foreach ($board->columns as $column) {
                // Determine column nature
                $isCompletedCol = strtolower($column->name) === 'concluído';
                $isCancelledCol = strtolower($column->name) === 'cancelado';
                
                foreach ($column->tasks as $task) {
                    $ownerId = $task->assignee_id ?? $task->user_id; // Priority for assignee if exists

                    if (isset($memberStats[$ownerId])) {
                        if ($isCompletedCol) {
                            $memberStats[$ownerId]['completed_tasks'] += 1;
                        } elseif (!$isCancelledCol) {
                            $memberStats[$ownerId]['ongoing_tasks'] += 1;
                        }
                        
                        // Total tasks (ignoring cancelled for general score, or including? Let's include)
                        $memberStats[$ownerId]['total_tasks'] += 1;
                    }
                }
            }
        }

        // Sort descending by completed tasks
        $ranking = array_values($memberStats);
        usort($ranking, function($a, $b) {
            return $b['completed_tasks'] <=> $a['completed_tasks'];
        });

        // Add Rank property
        foreach ($ranking as $index => &$stat) {
            $stat['rank'] = $index + 1;
        }

        return Inertia::render('Team/Ranking', [
            'team' => [
                'id' => $team->id,
                'name' => $team->name,
            ],
            'ranking' => $ranking,
            'userTeams' => $user->teams
        ]);
    }
}
