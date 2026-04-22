<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $team = \App\Models\Team::create([
            'name' => 'My First Team',
            'owner_id' => $user->id,
        ]);

        $team->users()->attach($user->id, ['role' => 'owner']);

        $board = \App\Models\Board::create([
            'name' => 'Personal Board',
            'team_id' => $team->id,
        ]);

        \App\Models\Column::insert([
            ['name' => 'A Fazer', 'board_id' => $board->id, 'position' => 0],
            ['name' => 'Em Progresso', 'board_id' => $board->id, 'position' => 1],
            ['name' => 'Concluído', 'board_id' => $board->id, 'position' => 2],
            ['name' => 'Cancelado', 'board_id' => $board->id, 'position' => 3],
        ]);

        $user->update(['current_team_id' => $team->id]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
