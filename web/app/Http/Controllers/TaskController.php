<?php

namespace App\Http\Controllers;

use App\Models\Column;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'column_id' => 'required|exists:columns,id'
        ]);

        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'column_id' => $request->column_id,
            'due_date' => $request->due_date,
            'user_id' => $request->user()->id
        ];

        if ($request->has('checklist')) {
            $data['checklist'] = is_string($request->checklist) ? json_decode($request->checklist, true) : $request->checklist;
        }

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('tasks', 'public');
        }

        Task::create($data);
        return back();
    }

    public function update(Request $request, Task $task)
    {
        // Handling moving between columns
        if ($request->has('column_id')) {
            $task->update(['column_id' => $request->column_id]);
        }
        
        // Handling content updates
        if ($request->has('title')) {
            $data = $request->only('title', 'description', 'due_date', 'assignee_id');
            
            if ($request->has('checklist')) {
                $data['checklist'] = is_string($request->checklist) ? json_decode($request->checklist, true) : $request->checklist;
            }

            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($task->image_path) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($task->image_path);
                }
                $data['image_path'] = $request->file('image')->store('tasks', 'public');
            } elseif ($request->boolean('remove_image')) {
                if ($task->image_path) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($task->image_path);
                }
                $data['image_path'] = null;
            }
            
            $task->update($data);
        }
        
        return back();
    }
    
    public function destroy(Task $task)
    {
        $task->delete();
        return back();
    }
}
