import React, { useMemo } from 'react';
import { useStorage } from '../hooks/useStorage';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { AlertTriangle, Clock, CalendarClock, Trophy } from 'lucide-react';
import { isBefore, isToday, startOfDay, parseISO } from 'date-fns';

export default function Dashboard() {
  const { user, db } = useStorage();

  const userTasks = db.tasks.filter(t => t.userId === user.id);

  // Stats
  const doneCount = userTasks.filter(t => t.status === 'done').length;
  const doingCount = userTasks.filter(t => t.status === 'doing').length;
  const todoCount = userTasks.filter(t => t.status === 'todo').length;

  const pieData = [
    { name: 'A Fazer', value: todoCount, color: 'var(--status-todo)' },
    { name: 'Em Andamento', value: doingCount, color: 'var(--status-doing)' },
    { name: 'Concluído', value: doneCount, color: 'var(--status-done)' }
  ];

  // Overdue and Today calculations
  const todayStart = startOfDay(new Date());
  
  const alertTasks = useMemo(() => {
    return userTasks.filter(t => t.status !== 'done' && t.dueDate).map(t => {
      const d = parseISO(t.dueDate);
      if (isBefore(d, todayStart)) return { ...t, alertType: 'overdue' };
      if (isToday(d)) return { ...t, alertType: 'today' };
      return null;
    }).filter(Boolean);
  }, [userTasks, todayStart]);

  const overdue = alertTasks.filter(t => t.alertType === 'overdue');
  const todayDue = alertTasks.filter(t => t.alertType === 'today');

  // Multi-user mock data for BarChart
  const barData = db.users.map(u => {
    const tasks = db.tasks.filter(t => t.userId === u.id);
    return {
      name: u.name,
      'A Fazer': tasks.filter(t => t.status === 'todo').length,
      'Fazendo': tasks.filter(t => t.status === 'doing').length,
      'Concluídas': tasks.filter(t => t.status === 'done').length
    };
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '2rem' }}>
         <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Visão Geral</h1>
         <p style={{ color: 'var(--text-muted)' }}>Bem-vindo de volta, {user.name}. Confira suas métricas.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', flex: 1, overflowY: 'auto', paddingBottom: '2rem' }}>
        
        {/* Left Column - Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Top Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total de Tarefas</p>
                    <h2 style={{ fontSize: '2rem', margin: 0 }}>{userTasks.length}</h2>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Tarefas Concluídas</p>
                    <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--status-done)' }}>{doneCount}</h2>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', borderTop: overdue.length > 0 ? '3px solid #EF4444' : 'none' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems:'center', gap: '0.5rem' }}>
                        <AlertTriangle size={16} color="#EF4444" /> Atrasadas
                    </p>
                    <h2 style={{ fontSize: '2rem', margin: 0, color: '#EF4444' }}>{overdue.length}</h2>
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', minHeight: '320px' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Sua Distribuição</h3>
                    {userTasks.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', margin: 'auto' }}>Sem dados suficientes.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Comparativo Geral</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--bg-surface)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff' }} />
                            <Bar dataKey="Concluídas" stackId="a" fill="var(--status-done)" />
                            <Bar dataKey="Fazendo" stackId="a" fill="var(--status-doing)" />
                            <Bar dataKey="A Fazer" stackId="a" fill="var(--status-todo)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>

        {/* Right Column - Reminders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CalendarClock size={20} color="var(--primary)" /> Lembretes Urgentes
                </h3>

                {alertTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
                        <Trophy size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>Tudo em dia!</p>
                        <p style={{ fontSize: '0.8rem' }}>Nenhuma tarefa atrasada ou agendada para hoje.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {overdue.map(t => (
                            <div key={t.id} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <AlertTriangle size={14} color="#EF4444" />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#EF4444' }}>ATRASADA</span>
                                </div>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-light)', fontSize: '1rem' }}>{t.title}</h4>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vencia em: {new Date(t.dueDate).toLocaleDateString('pt-BR')}</span>
                            </div>
                        ))}

                        {todayDue.map(t => (
                            <div key={t.id} style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <Clock size={14} color="#F59E0B" />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#F59E0B' }}>PARA HOJE</span>
                                </div>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-light)', fontSize: '1rem' }}>{t.title}</h4>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
