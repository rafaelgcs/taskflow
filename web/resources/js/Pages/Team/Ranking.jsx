import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Trophy, Medal, Star, CheckCircle2, ListTodo, Users, Crown } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export default function Ranking({ auth, team, ranking, userTeams }) {
    
    // Process members for the Chart
    const chartData = ranking.map(member => ({
        name: member.name,
        'Concluídas': member.completed_tasks,
        'Em Progresso': member.ongoing_tasks
    })).slice(0, 10); // Show top 10 on chart
    
    // Custom colors for ranks
    const getRankIcon = (rank) => {
        if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-gray-300 drop-shadow-[0_0_10px_rgba(209,213,219,0.5)]" />;
        if (rank === 3) return <Medal className="w-6 h-6 text-amber-600 drop-shadow-[0_0_10px_rgba(217,119,6,0.5)]" />;
        return <span className="text-xl font-bold text-gray-500 w-6 text-center">{rank}º</span>;
    };

    const getRankStyle = (rank) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-transparent border-l-4 border-yellow-400';
        if (rank === 2) return 'bg-gradient-to-r from-gray-400/10 to-transparent border-l-4 border-gray-300';
        if (rank === 3) return 'bg-gradient-to-r from-amber-600/10 to-transparent border-l-4 border-amber-600';
        return 'border-l-4 border-transparent hover:bg-white/5';
    };

    const totalTeamCompleted = ranking.reduce((acc, curr) => acc + curr.completed_tasks, 0);
    const totalTeamOngoing = ranking.reduce((acc, curr) => acc + curr.ongoing_tasks, 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Ranking de Produtividade - {team?.name || 'Equipe'}</h2>}
        >
            <Head title="Ranking da Equipe" />

            <div className="py-12 bg-[#0a0a0f] min-h-screen text-gray-100 font-sans p-6 rounded-tl-[30px] border-t border-l border-white/5 shadow-2xl overflow-hidden relative">
                {/* Decorative glowing orb */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/3 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8 relative z-10">
                    
                    {/* Top Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg flex items-center justify-between">
                            <div>
                                <h3 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-1">Membros Ativos</h3>
                                <span className="text-4xl font-bold text-white">{ranking.length}</span>
                            </div>
                            <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                <Users className="w-7 h-7 text-blue-400" />
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg flex items-center justify-between">
                            <div>
                                <h3 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-1">Entregas Globais</h3>
                                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">{totalTeamCompleted}</span>
                            </div>
                            <div className="h-14 w-14 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                <Trophy className="w-7 h-7 text-emerald-400" />
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg flex items-center justify-between">
                            <div>
                                <h3 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-1">Esforço Conjunto</h3>
                                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{totalTeamOngoing}</span>
                            </div>
                            <div className="h-14 w-14 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                <ListTodo className="w-7 h-7 text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Leaderboard Table */}
                        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400" /> 
                                    Quadro de Honra
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {ranking.map((member) => (
                                    <div 
                                        key={member.id} 
                                        className={`flex items-center justify-between p-4 rounded-xl border border-white/5 transition-all ${getRankStyle(member.rank)}`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-8 flex justify-center">
                                                {getRankIcon(member.rank)}
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                {/* Generic User Avatar */}
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-100 text-lg leading-tight">{member.name}</p>
                                                    <p className="text-xs text-purple-400 font-medium uppercase tracking-wider">
                                                        {member.role === 'owner' ? 'Líder' : 'Membro'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="hidden sm:flex flex-col items-center">
                                                <span className="text-sm text-gray-400">Em Andamento</span>
                                                <span className="font-bold text-xl text-gray-200">{member.ongoing_tasks}</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm text-gray-400">Ponto(s)</span>
                                                <span className="font-bold text-2xl text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                                                    {member.completed_tasks}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {ranking.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        Ninguém marcou pontos nesta equipe ainda.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Side Chart */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden p-6 flex flex-col">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 
                                Top Produtores
                            </h3>
                            
                            <div className="flex-1 min-h-[300px]">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis dataKey="name" type="category" stroke="#e5e7eb" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                            <Tooltip 
                                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                                contentStyle={{ backgroundColor: 'rgba(15, 15, 20, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                            />
                                            <Bar dataKey="Concluídas" fill="#34d399" radius={[0, 4, 4, 0]} barSize={20} />
                                            <Bar dataKey="Em Progresso" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={10} opacity={0.6} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500 italic text-sm">
                                        Sem dados suficientes para gerar o gráfico.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
