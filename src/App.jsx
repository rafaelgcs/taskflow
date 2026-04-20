import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useStorage } from './hooks/useStorage';
import { LayoutDashboard, CheckSquare, Users, BarChart2, LogOut, PieChart as PieChartIcon } from 'lucide-react';

import Login from './pages/Login';
import KanbanBoard from './pages/KanbanBoard';
import UsersView from './pages/UsersView';
import Comparison from './pages/Comparison';
import Dashboard from './pages/Dashboard';

function ProtectedRoute({ children }) {
  const { user } = useStorage();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useStorage();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <PieChartIcon size={20} /> },
    { path: '/board', label: 'Kanban', icon: <CheckSquare size={20} /> },
    { path: '/users', label: 'Team', icon: <Users size={20} /> },
    { path: '/comparison', label: 'Ranking', icon: <BarChart2 size={20} /> },
  ];

  return (
    <div className="glass-panel" style={{ width: '250px', height: '100vh', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <LayoutDashboard className="text-primary" size={28} color="var(--primary)" />
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>TaskFlow</h2>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)',
                background: active ? 'rgba(102, 252, 241, 0.1)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--text-main)',
                border: active ? '1px solid var(--glass-border)' : '1px solid transparent',
                cursor: 'pointer', transition: 'all var(--transition-fast)',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={(e) => !active && (e.currentTarget.style.background = 'transparent')}
            >
              {item.icon}
              <span style={{ fontWeight: 500 }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {user && (
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', color: '#000', fontSize: '1.2rem'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-light)' }}>{user.name}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Membro Local</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
              padding: '0.75rem', background: 'transparent', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', transition: 'var(--transition-fast)', borderRadius: 'var(--radius-sm)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-light)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isLogin = location.pathname === '/';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {!isLogin && <Sidebar />}
      
      <main style={{ flex: 1, height: '100vh', overflowY: 'auto', padding: isLogin ? '0' : '2rem', position: 'relative' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/board" element={<ProtectedRoute><KanbanBoard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UsersView /></ProtectedRoute>} />
          <Route path="/comparison" element={<ProtectedRoute><Comparison /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}
