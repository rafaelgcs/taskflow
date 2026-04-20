import React from 'react';
import { useStorage } from '../hooks/useStorage';
import { Trophy, Medal, Target } from 'lucide-react';

export default function Comparison() {
  const { db } = useStorage();

  // Calculate stats for all users
  const userStats = db.users.map(u => {
    const tasks = db.tasks.filter(t => t.userId === u.id);
    const done = tasks.filter(t => t.status === 'done').length;
    const doing = tasks.filter(t => t.status === 'doing').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const total = tasks.length;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
    
    // Simple mock score calculation
    const score = (done * 10) + (doing * 5) + (todo * 1);

    return { ...u, total, done, doing, todo, completionRate, score };
  });

  // Sort by score descending
  userStats.sort((a, b) => b.score - a.score);

  const maxScore = Math.max(...userStats.map(u => u.score), 1); // Avoid division by zero

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '2rem' }}>
         <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
           <Trophy color="#F59E0B" size={32} />
           Comparativo de Usuários (Ranking)
         </h1>
         <p style={{ color: 'var(--text-muted)' }}>Veja quem está sendo mais produtivo e completando as metas!</p>
      </header>

      <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        
        {userStats.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Nenhum dado disponível.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {userStats.map((u, index) => {
              
              const isTop1 = index === 0 && u.score > 0;
              const isTop2 = index === 1 && u.score > 0;
              const isTop3 = index === 2 && u.score > 0;

              return (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  
                  {/* Rank Badge */}
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', 
                    background: isTop1 ? '#F59E0B' : isTop2 ? '#94A3B8' : isTop3 ? '#D97706' : 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', color: isTop1 || isTop2 || isTop3 ? '#000' : 'var(--text-muted)',
                    flexShrink: 0
                  }}>
                    {isTop1 ? <Trophy size={18} /> : isTop2 || isTop3 ? <Medal size={18} /> : `#${index + 1}`}
                  </div>

                  {/* Info and Bar */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-light)' }}>{u.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Score: {u.score} pts</span>
                    </div>

                    <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div className="animate-fade-in" style={{ 
                        height: '100%', 
                        width: `${(u.score / maxScore) * 100}%`, 
                        background: 'linear-gradient(90deg, var(--primary) 0%, #3B82F6 100%)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 1s ease-out'
                      }} />
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span><Target size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {u.completionRate}% Concluídas</span>
                      <span>Tarefas: {u.done} <span style={{color: 'var(--status-done)'}}>Prontas</span> / {u.total} Totais</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
