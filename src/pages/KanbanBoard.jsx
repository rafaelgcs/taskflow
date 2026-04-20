import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useStorage } from '../hooks/useStorage';
import { Plus, Image as ImageIcon, CheckSquare, CalendarClock } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import TaskModal from '../components/TaskModal';
import { isBefore, isToday, startOfDay, parseISO } from 'date-fns';

const COLUMNS = {
  todo: { id: 'todo', title: 'A Fazer', color: 'var(--status-todo)' },
  doing: { id: 'doing', title: 'Em Andamento', color: 'var(--status-doing)' },
  done: { id: 'done', title: 'Concluído', color: 'var(--status-done)' }
};

export default function KanbanBoard() {
  const { user, db, addTask, updateTasks } = useStorage();
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Filter tasks for current user
  const userTasks = db.tasks.filter(t => t.userId === user.id);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId || source.index !== destination.index) {
      const draggedTaskId = result.draggableId;
      const newTasks = [...db.tasks];
      const taskIndex = newTasks.findIndex(t => t.id === draggedTaskId);
      
      if (taskIndex > -1) {
        const updatedTask = { ...newTasks[taskIndex], status: destination.droppableId };
        newTasks[taskIndex] = updatedTask;

        const othersT = newTasks.filter(t => t.userId !== user.id);
        const myT = newTasks.filter(t => t.userId === user.id);
        
        const [moved] = myT.splice(myT.findIndex(t => t.id === draggedTaskId), 1);
        
        const destColTasks = myT.filter(t => t.status === destination.droppableId);
        let insertIndex = myT.length; 
        if (destColTasks[destination.index]) {
            const targetId = destColTasks[destination.index].id;
            insertIndex = myT.findIndex(t => t.id === targetId);
        }
        
        myT.splice(insertIndex, 0, moved);
        updateTasks([...othersT, ...myT]);
      }
    }
  };

  const handleAddNewTask = (statusId) => {
    const newTask = {
      id: uuidv4(),
      userId: user.id,
      status: statusId,
      title: 'Nova Tarefa',
      description: '',
      image: null,
      checklist: [],
      dueDate: null
    };
    addTask(newTask);
    setSelectedTask(newTask); // Open modal immediately
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Seu Quadro</h1>
          <p style={{ color: 'var(--text-muted)' }}>Gerencie suas atividades diárias.</p>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.values(COLUMNS).map(column => {
            const columnTasks = userTasks.filter(t => t.status === column.id);

            return (
              <div key={column.id} style={{ 
                flex: '0 0 320px', display: 'flex', flexDirection: 'column', 
                background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)',
                padding: '1rem', border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: column.color }} />
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{column.title}</h3>
                    <span style={{ 
                      background: 'var(--bg-base)', padding: '0.1rem 0.6rem', 
                      borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: 'var(--text-muted)' 
                    }}>
                      {columnTasks.length}
                    </span>
                  </div>
                  <button onClick={() => handleAddNewTask(column.id)} className="btn-icon">
                    <Plus size={18} />
                  </button>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ 
                        flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem',
                        minHeight: '150px',
                        background: snapshot.isDraggingOver ? 'rgba(255,255,255,0.02)' : 'transparent',
                        borderRadius: 'var(--radius-sm)', transition: 'var(--transition-fast)'
                      }}
                    >
                      {columnTasks.map((task, index) => {
                        const completedChecks = task.checklist?.filter(c => c.done).length || 0;
                        const totalChecks = task.checklist?.length || 0;
                        
                        let isOverdue = false;
                        let isDueToday = false;
                        if (task.dueDate && task.status !== 'done') {
                            const dateObj = parseISO(task.dueDate);
                            const todayStart = startOfDay(new Date());
                            if (isBefore(dateObj, todayStart)) isOverdue = true;
                            if (isToday(dateObj)) isDueToday = true;
                        }

                        return (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedTask(task)}
                                className="glass"
                                style={{
                                  padding: '1rem', cursor: 'pointer',
                                  boxShadow: snapshot.isDragging ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                                  borderLeft: `3px solid ${column.color}`,
                                  position: 'relative',
                                  outline: isOverdue ? '1px solid #EF4444' : isDueToday ? '1px solid #F59E0B' : 'none',
                                  ...provided.draggableProps.style
                                }}
                              >
                                {isOverdue && <div style={{ position: 'absolute', top: -10, left: 10, background: '#EF4444', color: '#FFF', fontSize: '0.65rem', padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 'bold', boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>ATRASADA</div>}
                                {isDueToday && <div style={{ position: 'absolute', top: -10, left: 10, background: '#F59E0B', color: '#000', fontSize: '0.65rem', padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 'bold', boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)' }}>PARA HOJE</div>}

                                {task.image && (
                                  <div style={{ 
                                    width: '100%', height: '120px', backgroundImage: `url(${task.image})`,
                                    backgroundSize: 'cover', backgroundPosition: 'center',
                                    borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', marginTop: (isOverdue || isDueToday) ? '0.5rem' : '0'
                                  }} />
                                )}
                                
                                <h4 style={{ margin: (isOverdue || isDueToday) && !task.image ? '0.5rem 0 0.5rem 0' : '0 0 0.5rem 0', color: 'var(--text-light)', fontSize: '1rem' }}>
                                  {task.title}
                                </h4>
                                
                                {task.description && (
                                  <p style={{ 
                                    fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0',
                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                  }}>
                                    {task.description}
                                  </p>
                                )}

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                  {task.image && <ImageIcon size={14} color="var(--text-muted)" />}
                                  {totalChecks > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                      <CheckSquare size={14} /> {completedChecks}/{totalChecks}
                                    </div>
                                  )}
                                  {task.dueDate && (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: isOverdue ? '#EF4444' : isDueToday ? '#F59E0B' : 'var(--text-muted)' }}>
                                        <CalendarClock size={14} /> {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                      </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>

      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
      )}
    </div>
  );
}
