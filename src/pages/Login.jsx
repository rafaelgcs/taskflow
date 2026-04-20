import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { v4 as uuidv4 } from 'uuid';
import { UserPlus, LogIn, LayoutDashboard } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { db, login, addUser } = useStorage();
  
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isRegister) {
      const newUser = { id: uuidv4(), name: name.trim(), avatarUrl: '' };
      addUser(newUser);
      login(newUser.id);
      navigate('/dashboard');
    } else {
      // Find user
      const user = db.users.find(u => u.name.toLowerCase() === name.trim().toLowerCase());
      if (user) {
        login(user.id);
        navigate('/dashboard');
      } else {
        alert("Usuário não encontrado. Crie uma conta ou tente novamente.");
      }
    }
  };

  return (
    <div style={{
      width: '100%', height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'radial-gradient(circle at center, var(--bg-surface) 0%, var(--bg-base) 100%)'
    }}>
      <div className="glass animate-fade-in" style={{
        padding: '3rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '420px',
        display: 'flex', flexDirection: 'column', gap: '2rem'
      }}>
        
        <div style={{ textAlign: 'center' }}>
          <LayoutDashboard size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>
            TaskFlow
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {isRegister ? 'Crie seu perfil local' : 'Acesse seu painel'}
          </p>
        </div>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
              Nome de Usuário
            </label>
            <input 
              type="text" 
              placeholder="Ex: Rafael" 
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ fontSize: '1rem', width: '100%' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
            {isRegister ? <><UserPlus size={20} /> Cadastrar e Entrar</> : <><LogIn size={20} /> Entrar no Painel</>}
          </button>
        </form>

        {db.users.length > 0 && !isRegister && (
          <div style={{ marginTop: '-0.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Contas existentes neste PC:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {db.users.map(u => (
                <span 
                  key={u.id} 
                  onClick={() => setName(u.name)}
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', 
                    borderRadius: 'var(--radius-full)', fontSize: '0.8rem', cursor: 'pointer',
                    border: '1px solid var(--border-color)', color: 'var(--text-light)' 
                  }}
                >
                  {u.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isRegister ? 'Já possui uma conta local?' : 'Ainda não tem conta local?'}
            {' '}
            <button 
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              style={{ 
                background: 'none', border: 'none', color: 'var(--primary)', 
                cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' 
              }}
            >
              {isRegister ? 'Fazer Login' : 'Criar Conta'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
