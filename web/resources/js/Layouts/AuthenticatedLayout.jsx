import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { LayoutDashboard, KanbanSquare, Users, Settings, Trophy } from 'lucide-react';
import TeamManagementModal from '@/Components/TeamManagementModal';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const userTeams = usePage().props.userTeams || [];
    const activeTeam = userTeams.find(t => t.id === user.current_team_id) || { name: 'Equipe' };

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showTeamModal, setShowTeamModal] = useState(false);

    return (
        <div className="min-h-screen bg-[#050508] text-white selection:bg-purple-500/30">
            {/* Top Navigation */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0f] border-b border-white/10 hidden sm:block">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center gap-8">
                            <Link href="/dashboard" className="flex items-center gap-3">
                                <LayoutDashboard size={28} className="text-purple-500" />
                                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">TaskFlow</span>
                            </Link>

                            <div className="hidden sm:flex space-x-2">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                                </NavLink>
                                <NavLink href={route('kanban.index')} active={route().current('kanban.index')}>
                                    <KanbanSquare className="w-4 h-4 mr-2" /> Kanban
                                </NavLink>
                                <NavLink href={route('ranking.index')} active={route().current('ranking.index')}>
                                    <Trophy className="w-4 h-4 mr-2" /> Ranking
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center space-x-6">
                            
                            {/* Team Switcher & User Menu */}
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button type="button" className="group flex items-center gap-3 rounded-full bg-white/5 border border-white/10 py-1.5 px-4 transition-all hover:bg-white/10">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-medium text-white leading-none">{user.name}</span>
                                                <span className="text-[10px] text-purple-400 leading-none mt-1">{activeTeam.name}</span>
                                            </div>
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-xs font-bold ring-2 ring-transparent group-hover:ring-purple-500/50 transition-all">
                                                {user.name.charAt(0)}
                                            </div>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="right" width="48" contentClasses="py-1 bg-[#121216] border border-white/10 rounded-xl shadow-2xl">
                                        <div className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                                            Suas Equipes
                                        </div>
                                        {userTeams.map(team => (
                                            <Dropdown.Link
                                                key={team.id}
                                                href={route('teams.switch')}
                                                method="post"
                                                as="button"
                                                data={{ team_id: team.id }}
                                                className={`flex items-center !px-4 !py-2 hover:bg-white/5 ${team.id === user.current_team_id ? 'text-purple-400 font-medium' : 'text-gray-300'}`}
                                            >
                                                {team.id === user.current_team_id && <Users className="w-3 h-3 mr-2" />}
                                                {team.name}
                                            </Dropdown.Link>
                                        ))}

                                        <div className="border-t border-white/10 my-2"></div>
                                        
                                        <button onClick={() => setShowTeamModal(true)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                                            <Settings className="w-3.5 h-3.5 mr-2" />
                                            Gerenciar Equipes
                                        </button>
                                        
                                        <Dropdown.Link href={route('profile.edit')} className="text-gray-300 hover:text-white hover:bg-white/5">
                                            Configurações
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="text-pink-400 hover:text-pink-300 hover:bg-white/5">
                                            Sair da conta
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-transparent relative z-10 pt-4">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="relative z-10 pb-20 sm:pb-0">{children}</main>

            {userTeams.length > 0 && (
                <TeamManagementModal 
                    show={showTeamModal} 
                    onClose={() => setShowTeamModal(false)}
                    userTeams={userTeams}
                    user={user}
                />
            )}

            {/* iOS-style Bottom Tab Navigation (Mobile Only) */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-t border-white/10 px-6 py-3 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-safe">
                <Link href={route('dashboard')} className={`flex flex-col items-center gap-1 ${route().current('dashboard') ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}>
                    <LayoutDashboard className="w-6 h-6" />
                    <span className="text-[10px] font-medium leading-none">Início</span>
                </Link>
                <Link href={route('kanban.index')} className={`flex flex-col items-center gap-1 ${route().current('kanban.index') ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}>
                    <KanbanSquare className="w-6 h-6" />
                    <span className="text-[10px] font-medium leading-none">Kanban</span>
                </Link>
                <Link href={route('ranking.index')} className={`flex flex-col items-center gap-1 ${route().current('ranking.index') ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}>
                    <Trophy className="w-6 h-6" />
                    <span className="text-[10px] font-medium leading-none">Ranking</span>
                </Link>
                <Dropdown>
                    <Dropdown.Trigger>
                        <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-transparent">
                                {user.name.charAt(0)}
                            </div>
                            <span className="text-[10px] font-medium leading-none">Perfil</span>
                        </button>
                    </Dropdown.Trigger>

                    <Dropdown.Content align="top-right" width="48" contentClasses="py-1 bg-[#121216] border border-white/10 rounded-xl shadow-2xl mb-2">
                        <div className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                            Suas Equipes
                        </div>
                        {userTeams.map(team => (
                            <Dropdown.Link
                                key={team.id}
                                href={route('teams.switch')}
                                method="post"
                                as="button"
                                data={{ team_id: team.id }}
                                className={`flex items-center !px-4 !py-2 hover:bg-white/5 ${team.id === user.current_team_id ? 'text-purple-400 font-medium' : 'text-gray-300'}`}
                            >
                                {team.id === user.current_team_id && <Users className="w-3 h-3 mr-2" />}
                                {team.name}
                            </Dropdown.Link>
                        ))}

                        <div className="border-t border-white/10 my-2"></div>
                        
                        <button onClick={() => setShowTeamModal(true)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                            <Settings className="w-3.5 h-3.5 mr-2" />
                            Gerenciar Equipes
                        </button>
                        
                        <Dropdown.Link href={route('profile.edit')} className="text-gray-300 hover:text-white hover:bg-white/5">
                            Configurações
                        </Dropdown.Link>
                        <Dropdown.Link href={route('logout')} method="post" as="button" className="text-pink-400 hover:text-pink-300 hover:bg-white/5">
                            Sair da conta
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </div>
    );
}
