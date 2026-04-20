import React from 'react';
import { useStorage } from '../hooks/useStorage';
import { User, CheckCircle2, CircleDashed } from 'lucide-react';

export default function UsersView() {
  const { db } = useStorage();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '2rem' }}>
         <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Visão Geral da Equipe</h1>
         <p style={{ color: 'var(--text-muted)' }}>Acompanhe o que cada membro está fazendo neste computador local.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {db.users.map(u => {
          const uTasks = db.tasks.filter(t => t.userId === u.id);
          const done = uTasks.filter(t => t.status === 'done').length;
          const ongoing = uTasks.length - done;

          return (
            <div key={u.id} className="glass" style={{
              padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', color: '#000', fontSize: '1.5rem'
                }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-light)' }}>{u.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Membro da Instância Local</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-light)', margin: 0 }}>{uTasks.length}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Tarefas Totais</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--status-doing)', margin: 0 }}>{ongoing}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Em Andamento</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--status-done)', margin: 0 }}>{done}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Concluídas</p>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Tarefas Recentes:</h4>
                {uTasks.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Nenhuma tarefa adicionada.</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {uTasks.slice(-3).reverse().map(t => (
                      <li key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                        {t.status === 'done' ? <CheckCircle2 size={16} color="var(--status-done)" /> : <CircleDashed size={16} color="var(--status-doing)" />}
                        <span style={{ 
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          textDecoration: t.status === 'done' ? 'line-through' : 'none', color: t.status === 'done' ? 'var(--text-muted)' : 'var(--text-light)'
                        }}>
                          {t.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}

        {db.users.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>Nenhum usuário cadastrado além de você.</p>
        )}
      </div>
    </div>
  );
}
