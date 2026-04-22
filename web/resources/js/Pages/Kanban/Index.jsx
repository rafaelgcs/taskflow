import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, Calendar, AlignLeft, CheckSquare, Image as ImageIcon, Trash2 } from 'lucide-react';
import TaskModal from '@/Components/TaskModal';

export default function KanbanIndex({ auth, activeTeam, boards, userTeams }) {
    const board = boards[0] || { columns: [] };
    const [data, setData] = useState(board.columns);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalColumnId, setModalColumnId] = useState(null);

    useEffect(() => {
        setData(board.columns);
    }, [board]);

    const onDragEnd = (result) => {
        const { destination, source, type } = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        // Handle Column Dragging
        if (type === 'column') {
            const newColumns = Array.from(data);
            const [movedColumn] = newColumns.splice(source.index, 1);
            newColumns.splice(destination.index, 0, movedColumn);
            
            // Re-assign positions
            const formattedColumns = newColumns.map((col, idx) => ({ ...col, position: idx }));
            setData(formattedColumns);

            // Send ordered columns to backend
            const reorderPayload = formattedColumns.map(col => ({ id: col.id, position: col.position }));
            router.post(route('columns.reorder'), {
                columns: reorderPayload
            }, { preserveScroll: true, preserveState: true });
            
            return;
        }

        // Handle Task Dragging
        const sourceColIndex = data.findIndex(col => col.id.toString() === source.droppableId);
        const destColIndex = data.findIndex(col => col.id.toString() === destination.droppableId);

        const sourceCol = data[sourceColIndex];
        const destCol = data[destColIndex];

        const sourceTasks = [...(sourceCol.tasks || [])];
        const destTasks = sourceColIndex === destColIndex ? sourceTasks : [...(destCol.tasks || [])];

        const [movedTask] = sourceTasks.splice(source.index, 1);
        destTasks.splice(destination.index, 0, movedTask);

        const newData = [...data];
        newData[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
        if (sourceColIndex !== destColIndex) {
            newData[destColIndex] = { ...destCol, tasks: destTasks };
        }

        setData(newData);

        if (sourceColIndex !== destColIndex) {
            router.put(route('tasks.update', movedTask.id), {
                column_id: destCol.id
            }, { preserveScroll: true, preserveState: true });
        }
    };

    const handleOpenTask = (task) => {
        setModalColumnId(null);
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleCreateTask = (columnId) => {
        setSelectedTask(null);
        setModalColumnId(columnId);
        setShowModal(true);
    };

    const handleDeleteColumn = (columnId, name) => {
        if (confirm(`Tem certeza que deseja apagar a coluna "${name}" e todas as suas tarefas?`)) {
            router.delete(route('columns.destroy', columnId), { preserveScroll: true, preserveState: true });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-semibold text-2xl text-gray-100 leading-tight">Seu Quadro</h2>
                        <p className="text-gray-400 mt-1 text-sm">Gerencie suas atividades diárias.</p>
                    </div>
                </div>
            }
        >
            <Head title="Kanban" />

            <div className="pt-4 pb-24 sm:py-6 bg-[#0a0a0f] min-h-[calc(100vh-100px)] text-gray-100 font-sans px-2 sm:px-6 sm:rounded-tl-[40px] sm:border-t sm:border-l border-white/5 shadow-[inset_0_4px_30px_rgba(0,0,0,0.5)] relative overflow-x-auto">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="all-columns" direction="horizontal" type="column">
                        {(provided) => (
                            <div 
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="flex gap-4 sm:gap-6 min-w-max pb-8 pt-2 sm:pt-4 px-2 h-full items-start"
                            >
                                {data.map((column, index) => (
                                    <Draggable key={column.id} draggableId={`col-${column.id}`} index={index} isDragDisabled={column.name === 'A Fazer' || column.name === 'Concluído'}>
                                        {(provided, snapshot) => (
                                            <div 
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`w-[85vw] sm:w-80 flex-shrink-0 flex flex-col h-full opacity-90 transition-opacity ${(column.name !== 'A Fazer' && column.name !== 'Concluído') ? 'hover:opacity-100' : ''} ${snapshot.isDragging ? 'rotate-2 scale-105 z-50' : ''}`}
                                            >
                                                <div 
                                                    {...(column.name !== 'A Fazer' && column.name !== 'Concluído' ? provided.dragHandleProps : {})}
                                                    className={`bg-white/5 rounded-t-2xl border-t border-x border-white/10 px-4 py-3 flex items-center justify-between shadow-lg ${(column.name !== 'A Fazer' && column.name !== 'Concluído') ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color || '#a855f7' }}></div>
                                                        <h3 className="font-bold tracking-wide text-gray-200">{column.name}</h3>
                                                        <span className="text-xs font-mono bg-black/40 px-2 py-0.5 rounded-full text-purple-400 border border-purple-500/20">
                                                            {(column.tasks || []).length}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => handleCreateTask(column.id)} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1 rounded-md" title="Adicionar Tarefa">
                                                            <Plus size={16} />
                                                        </button>
                                                        {(column.name !== 'A Fazer' && column.name !== 'Concluído') && (
                                                            <button onClick={() => handleDeleteColumn(column.id, column.name)} className="text-gray-400 hover:text-red-400 transition-colors bg-white/5 p-1 rounded-md" title="Excluir Coluna">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <Droppable droppableId={column.id.toString()} type="task">
                                                    {(provided, snapshot) => (
                                                        <div
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            className={`flex-1 min-h-[150px] p-3 rounded-b-2xl border-b border-x border-white/10 transition-colors ${snapshot.isDraggingOver ? 'bg-white/10 border-purple-500/50 shadow-[inset_0_0_20px_rgba(168,85,247,0.15)]' : 'bg-black/30'}`}
                                                        >
                                                            {(column.tasks || []).map((task, index) => {
                                                                // Calculate checklist status
                                                                let totalChecks = 0;
                                                                let completedChecks = 0;
                                                                if (task.checklist) {
                                                                    const parsed = typeof task.checklist === 'string' ? JSON.parse(task.checklist) : task.checklist;
                                                                    totalChecks = parsed.length;
                                                                    completedChecks = parsed.filter(c => c.done).length;
                                                                }

                                                                const isOverdue = task.due_date && new Date(task.due_date) < new Date(new Date().setHours(0,0,0,0));
                                                                
                                                                return (
                                                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                                        {(provided, snapshot) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                style={{ ...provided.draggableProps.style }}
                                                                                className="mb-3"
                                                                            >
                                                                                <div onClick={() => handleOpenTask(task)} className={`bg-[#18181f] overflow-hidden rounded-xl shadow-lg border group relative transition-all cursor-pointer hover:-translate-y-1 ${snapshot.isDragging ? 'rotate-2 scale-105 ring-2 ring-purple-500 z-50 border-purple-500/50' : 'border-white/5 hover:border-white/20'}`}>
                                                                                    {/* Overdue Badge */}
                                                                                    {isOverdue && (
                                                                                        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-lg">Atrasada</div>
                                                                                    )}

                                                                                    {/* Top Cover Image if available */}
                                                                                    {task.image_url && (
                                                                                        <div className="w-full h-32 bg-gray-800">
                                                                                            <img src={task.image_url} className="w-full h-full object-cover" alt="Task cap" />
                                                                                        </div>
                                                                                    )}

                                                                                    <div className="p-4">
                                                                                        {/* Indicator strip matches column color */}
                                                                                        <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: column.color || '#a855f7' }}></div>
                                                                                        
                                                                                        <p className="text-sm font-semibold text-gray-100 leading-relaxed mb-1 pr-4">{task.title}</p>
                                                                                        
                                                                                        {task.description && (
                                                                                            <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed mb-3">
                                                                                                {task.description}
                                                                                            </p>
                                                                                        )}
                                                                                        
                                                                                        <div className="mt-3 flex items-center gap-3 flex-wrap">
                                                                                            {task.image_url && (
                                                                                                <ImageIcon size={14} className="text-gray-500" />
                                                                                            )}
                                                                                            {task.description && !task.image_url && (
                                                                                                <div className="flex items-center text-[10px] text-gray-500 font-medium tracking-wide gap-1">
                                                                                                    <AlignLeft size={12} /> Desc
                                                                                                </div>
                                                                                            )}
                                                                                            {totalChecks > 0 && (
                                                                                                <div className="flex items-center text-[10px] text-gray-500 font-medium gap-1 bg-white/5 px-1.5 py-0.5 rounded">
                                                                                                    <CheckSquare size={12} /> {completedChecks}/{totalChecks}
                                                                                                </div>
                                                                                            )}
                                                                                            {task.due_date && (
                                                                                                <div className={`flex items-center text-[10px] font-bold tracking-wide gap-1 px-1.5 py-0.5 rounded ${isOverdue ? 'text-red-400 bg-red-500/10' : 'text-purple-400 bg-purple-500/10'}`}>
                                                                                                    <Calendar size={12} />
                                                                                                    {new Date(task.due_date).toLocaleDateString()}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                );
                                                            })}
                                                            {provided.placeholder}
                                                            
                                                            <button 
                                                                onClick={() => handleCreateTask(column.id)}
                                                                className="mt-3 w-full bg-white/5 hover:bg-white/10 rounded-xl border border-dashed border-white/20 transition-all p-2 flex justify-center items-center gap-2 text-gray-400 hover:text-purple-400 text-sm font-medium"
                                                            >
                                                                <Plus size={16} /> Nova Tarefa
                                                            </button>
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}

                                <div className="w-[85vw] sm:w-80 flex-shrink-0 pt-[42px]">
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const name = new FormData(e.target).get('name');
                                        if (name) router.post(route('columns.store'), { board_id: board.id, name }, { preserveScroll: true, onSuccess: () => e.target.reset() });
                                    }}>
                                        <div className="bg-white/5 hover:bg-white/10 rounded-2xl border border-dashed border-white/20 hover:border-purple-500/50 transition-colors p-4 flex items-center shadow-lg group">
                                            <Plus className="w-5 h-5 text-gray-500 group-hover:text-purple-400 mr-2 transition-colors" />
                                            <input 
                                                name="name"
                                                type="text"
                                                autoComplete="off"
                                                placeholder="Adicionar Coluna" 
                                                className="bg-transparent border-none text-sm text-gray-400 group-hover:text-gray-200 font-bold focus:ring-0 w-full p-0 placeholder-gray-600 outline-none transition-colors"
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            {/* Task Creation / Edit Modal */}
            {showModal && (
                <TaskModal
                    show={showModal}
                    task={selectedTask}
                    columnId={modalColumnId}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedTask(null);
                    }}
                />
            )}
        </AuthenticatedLayout>
    );
}
