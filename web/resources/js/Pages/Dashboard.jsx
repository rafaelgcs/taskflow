import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Activity, CheckCircle2, Clock, Users, Briefcase } from 'lucide-react';

export default function Dashboard({ auth, team, userTeams }) {
    // Process Kanban Data
    let totalTasks = 0;
    let accomplishedTasks = 0;
    let pendingTasks = 0;
    
    // Safety check in case boards or columns don't exist
    const hasData = team && team.boards && team.boards.length > 0;
    const columnsData = [];

    if (hasData) {
        team.boards.forEach(board => {
            board.columns.forEach(column => {
                const columnTaskCount = column.tasks ? column.tasks.length : 0;
                totalTasks += columnTaskCount;
                
                if (column.name.toLowerCase() === 'concluído') accomplishedTasks += columnTaskCount;
                else if (column.name.toLowerCase() !== 'cancelado') pendingTasks += columnTaskCount;

                columnsData.push({
                    name: column.name,
                    value: columnTaskCount,
                    fill: column.color || '#8b5cf6' 
                });
            });
        });
    }

    const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];
    const pieData = [
        { name: 'Concluído', value: accomplishedTasks },
        { name: 'Em Aberto', value: pendingTasks }
    ].filter(d => d.value > 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Dashboard de {team?.name || 'Equipe'}</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-[#0a0a0f] min-h-screen text-gray-100 font-sans p-6 rounded-tl-[30px] border-t border-l border-white/5 shadow-2xl overflow-hidden relative">
                {/* Decorative glowing orb */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6 relative z-10">
                    
                    {/* Top Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <Activity className="text-purple-400 w-6 h-6" />
                                <h3 className="text-sm uppercase tracking-wider text-gray-400 font-semibold">Total de Tarefas</h3>
                            </div>
                            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{totalTasks}</span>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <CheckCircle2 className="text-emerald-400 w-6 h-6" />
                                <h3 className="text-sm uppercase tracking-wider text-gray-400 font-semibold">Concluídas</h3>
                            </div>
                            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">{accomplishedTasks}</span>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <Clock className="text-amber-400 w-6 h-6" />
                                <h3 className="text-sm uppercase tracking-wider text-gray-400 font-semibold">Pendentes</h3>
                            </div>
                            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">{pendingTasks}</span>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <Users className="text-blue-400 w-6 h-6" />
                                <h3 className="text-sm uppercase tracking-wider text-gray-400 font-semibold">Membros</h3>
                            </div>
                            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">{team?.users?.length || 1}</span>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                                <Briefcase className="w-5 h-5 text-gray-400" />
                                <span>Progresso da Equipe</span>
                            </h3>
                            <div className="h-64 w-full">
                                {pieData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: 'rgba(15, 15, 20, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500 text-sm italic">O quadro de tarefas está vazio.</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                                <Activity className="w-5 h-5 text-gray-400" />
                                <span>Distribuição do Quadro</span>
                            </h3>
                            <div className="h-64 w-full">
                                {columnsData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={columnsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                                contentStyle={{ backgroundColor: 'rgba(15, 15, 20, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                            />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
                                                {columnsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500 text-sm italic">Nenhuma coluna configurada ainda.</div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
