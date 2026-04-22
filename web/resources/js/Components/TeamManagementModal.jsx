import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import { router, useForm } from '@inertiajs/react';
import { Settings, Trash2, Plus, Edit2, X, Check } from 'lucide-react';
import TextInput from '@/Components/TextInput';

export default function TeamManagementModal({ show, onClose, userTeams, user }) {
    const [editingTeam, setEditingTeam] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const editForm = useForm({
        name: ''
    });

    const createForm = useForm({
        name: ''
    });

    const startEditing = (team) => {
        setEditingTeam(team.id);
        editForm.setData('name', team.name);
    };

    const submitEdit = (e, teamId) => {
        e.preventDefault();
        editForm.put(route('teams.update', teamId), {
            preserveScroll: true,
            onSuccess: () => setEditingTeam(null),
        });
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('teams.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
            },
        });
    };

    const deleteTeam = (teamId) => {
        if (confirm('Tem certeza que deseja deletar esta equipe? Tudo nela será perdido.')) {
            router.delete(route('teams.destroy', teamId), {
                preserveScroll: true
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <div className="bg-[#121216] border border-white/10 p-6 text-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Settings className="w-5 h-5 text-purple-400" />
                        Gerenciar Equipes
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {userTeams.map(team => (
                        <div key={team.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between group transition-colors hover:bg-white/10">
                            {editingTeam === team.id ? (
                                <form onSubmit={(e) => submitEdit(e, team.id)} className="flex-1 flex gap-2">
                                    <TextInput
                                        value={editForm.data.name}
                                        onChange={e => editForm.setData('name', e.target.value)}
                                        className="w-full bg-[#0a0a0f] border-white/20 h-8 px-3 text-sm text-white"
                                        autoFocus
                                    />
                                    <button type="submit" disabled={editForm.processing} className="p-1.5 bg-purple-500 rounded-lg text-white hover:bg-purple-600 transition-colors">
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button type="button" onClick={() => setEditingTeam(null)} className="p-1.5 bg-white/10 rounded-lg text-gray-300 hover:bg-white/20 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-200">{team.name}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {team.owner_id === user.id ? 'Proprietário' : 'Membro'}
                                                {team.id === user.current_team_id && ' • Ativa'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {team.owner_id === user.id && (
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {team.invite_code && (
                                                <button 
                                                    onClick={() => {
                                                        const link = `${window.location.origin}/invite/${team.invite_code}`;
                                                        navigator.clipboard.writeText(link);
                                                        alert('Link de convite copiado!');
                                                    }} 
                                                    className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                                                    title="Copiar Link de Convite"
                                                >
                                                    <svg xmlns="http://www.w3.org/-icons" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                                </button>
                                            )}
                                            <button onClick={() => startEditing(team)} className="p-2 text-gray-400 hover:text-purple-400 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => deleteTeam(team.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                    {isCreating ? (
                        <form onSubmit={submitCreate} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-2">
                            <TextInput
                                value={createForm.data.name}
                                onChange={e => createForm.setData('name', e.target.value)}
                                placeholder="Nome da nova equipe"
                                className="w-full bg-[#0a0a0f] border-white/20 text-white text-sm"
                                autoFocus
                            />
                            <button type="submit" disabled={createForm.processing} className="px-4 bg-purple-500 rounded-xl text-white hover:bg-purple-600 text-sm font-semibold transition-colors">
                                Criar
                            </button>
                            <button type="button" onClick={() => setIsCreating(false)} className="px-4 bg-white/10 rounded-xl text-gray-300 hover:bg-white/20 text-sm transition-colors">
                                Cancelar
                            </button>
                        </form>
                    ) : (
                        <button 
                            onClick={() => setIsCreating(true)}
                            className="w-full py-3 flex items-center justify-center gap-2 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all font-medium text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Criar Nova Equipe
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
