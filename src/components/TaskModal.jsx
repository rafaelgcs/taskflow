import React, { useState, useRef } from 'react';
import { useStorage } from '../hooks/useStorage';
import { X, ImagePlus, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function TaskModal({ task, onClose }) {
  const { updateTask, removeTask } = useStorage();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [image, setImage] = useState(task.image);
  const [checklist, setChecklist] = useState(task.checklist || []);
  const [newCheckItem, setNewCheckItem] = useState('');
  const [dueDate, setDueDate] = useState(task.dueDate || null);

  const handleSave = () => {
    updateTask({
      ...task,
      title,
      description,
      image,
      checklist,
      dueDate
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Certeza que deseja deletar esta tarefa?")) {
      removeTask(task.id);
      onClose();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Imagem muito grande! Max 2MB para IndexedDB Local.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addCheckItem = (e) => {
    e.preventDefault();
    if (!newCheckItem.trim()) return;
    setChecklist([...checklist, { id: uuidv4(), text: newCheckItem.trim(), done: false }]);
    setNewCheckItem('');
  };

  const toggleCheck = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const removeCheck = (id) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
        borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
        position: 'relative'
      }}>
        
        <button onClick={onClose} className="btn-icon" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <X size={24} />
        </button>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>Título da Tarefa</label>
          <input 
            type="text" value={title} onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', fontSize: '1.5rem', fontWeight: 600, background: 'transparent', padding: '0.5rem', border: '1px solid transparent', borderBottomColor: 'var(--border-color)' }}
            placeholder="Digite o título..."
          />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>Descrição</label>
          <textarea 
            value={description} onChange={e => setDescription(e.target.value)}
            style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
            placeholder="Adicione mais detalhes a esta tarefa..."
          />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Capa da Tarefa</label>
          {image ? (
            <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Capa da tarefa" />
              <button 
                onClick={() => setImage(null)}
                className="btn btn-secondary"
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.5rem' }}
              >
                <Trash2 size={16} /> Remover
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%', height: '100px', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                color: 'var(--text-muted)', transition: 'var(--transition-fast)'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <ImagePlus size={24} style={{ marginBottom: '0.5rem' }} />
              <span>Clique para adicionar uma imagem</span>
            </div>
          )}
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Checklist</label>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {checklist.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                <button onClick={() => toggleCheck(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.done ? 'var(--primary)' : 'var(--text-muted)' }}>
                  {item.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <span style={{ flex: 1, textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--text-muted)' : 'var(--text-light)' }}>
                  {item.text}
                </span>
                <button onClick={() => removeCheck(item.id)} className="btn-icon">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={addCheckItem} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" value={newCheckItem} onChange={e => setNewCheckItem(e.target.value)}
              placeholder="Adicionar um item..." style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-secondary"><Plus size={18} /> Adicionar</button>
          </form>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Data de Entrega</label>
          <input 
            type="date" 
            value={dueDate || ''} 
            onChange={e => setDueDate(e.target.value)}
            style={{ width: '100%', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-light)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <button onClick={handleDelete} className="btn btn-secondary" style={{ color: '#EF4444' }}>
            <Trash2 size={18} /> Excluir Tarefa
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            Salvar Alterações
          </button>
        </div>

      </div>
    </div>
  );
}
