<?php

namespace App\Http\Controllers;

use App\Models\Column;
use Illuminate\Http\Request;

class ColumnController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'board_id' => 'required|exists:boards,id'
        ]);

        $doneColumn = Column::where('board_id', $request->board_id)->where('name', 'Concluído')->first();
        if ($doneColumn) {
            $newPos = $doneColumn->position;
            Column::where('board_id', $request->board_id)->where('position', '>=', $newPos)->increment('position');
        } else {
            $newPos = (Column::where('board_id', $request->board_id)->max('position') ?? -1) + 1;
        }

        Column::create([
            'name' => $request->name,
            'board_id' => $request->board_id,
            'position' => $newPos
        ]);
        
        return back();
    }

    public function update(Request $request, Column $column)
    {
        if ($request->has('name')) {
            if (in_array($column->name, ['A Fazer', 'Concluído']) && $request->name !== $column->name) {
                // Prevent renaming protected columns
                return back();
            }
            $column->update(['name' => $request->name]);
        }
        if ($request->has('position')) {
            $column->update(['position' => $request->position]);
        }
        return back();
    }

    public function reorder(Request $request)
    {
        $request->validate(['columns' => 'required|array']);
        foreach ($request->columns as $col) {
            Column::where('id', $col['id'])->update(['position' => $col['position']]);
        }
        return back();
    }

    public function destroy(Column $column)
    {
        if (in_array($column->name, ['A Fazer', 'Concluído'])) {
            return back();
        }
        $column->delete();
        return back();
    }
}
