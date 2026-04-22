import React, { useRef, useState } from 'react';
import Modal from '@/Components/Modal';
import { useForm, router } from '@inertiajs/react';
import { X, ImagePlus, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import TextInput from '@/Components/TextInput';

export default function TaskModal({ show, onClose, task = null, columnId = null }) {
    const isNew = !task?.id;
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        _method: isNew ? 'post' : 'put',
        title: task?.title || '',
        description: task?.description || '',
        image: null,
        remove_image: false,
        checklist: task?.checklist ? (typeof task.checklist === 'string' ? JSON.parse(task.checklist) : task.checklist) : [],
        due_date: task?.due_date ? task.due_date.split('T')[0] : '',
        column_id: task?.column_id || columnId,
    });

    const [newCheckItem, setNewCheckItem] = useState('');
    const [previewImage, setPreviewImage] = useState(task?.image_url || null);

    const handleSave = () => {
        const routeName = isNew ? route('tasks.store') : route('tasks.update', task.id);
        
        post(routeName, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            }
        });
    };

    const handleDelete = () => {
        if (confirm("Certeza que deseja deletar esta tarefa?")) {
            router.delete(route('tasks.destroy', task.id), {
                preserveScroll: true,
                onSuccess: () => onClose()
            });
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData((prev) => ({ ...prev, image: file, remove_image: false }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData((prev) => ({ ...prev, image: null, remove_image: true }));
        setPreviewImage(null);
    };

    const addCheckItem = (e) => {
        e.preventDefault();
        if (!newCheckItem.trim()) return;
        const newItem = { id: crypto.randomUUID(), text: newCheckItem.trim(), done: false };
        setData('checklist', [...(Array.isArray(data.checklist) ? data.checklist : []), newItem]);
        setNewCheckItem('');
    };

    const toggleCheck = (id) => {
        const currentList = Array.isArray(data.checklist) ? data.checklist : [];
        const updatedList = currentList.map(item => item.id === id ? { ...item, done: !item.done } : item);
        setData('checklist', updatedList);
    };

    const removeCheck = (id) => {
        const currentList = Array.isArray(data.checklist) ? data.checklist : [];
        const updatedList = currentList.filter(item => item.id !== id);
        setData('checklist', updatedList);
    };

    const updateCheckText = (id, newText) => {
        const currentList = Array.isArray(data.checklist) ? data.checklist : [];
        const updatedList = currentList.map(item => item.id === id ? { ...item, text: newText } : item);
        setData('checklist', updatedList);
    };

    const currentChecklist = Array.isArray(data.checklist) ? data.checklist : [];

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="bg-[#121216] border border-white/10 p-8 text-gray-200 relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <div className="flex flex-col gap-6 w-full">
                    
                    {/* Title */}
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wider font-semibold">Título da Tarefa</label>
                        <input 
                            type="text" 
                            value={data.title} 
                            onChange={e => setData('title', e.target.value)}
                            className="w-full text-2xl font-bold bg-transparent border-0 border-b border-white/20 focus:ring-0 focus:border-purple-500 p-2 text-white placeholder-gray-600 transition-colors"
                            placeholder="Digite o título..."
                        />
                        {errors.title && <p className="text-pink-400 text-sm mt-1">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wider font-semibold">Descrição</label>
                        <textarea 
                            value={data.description} 
                            onChange={e => setData('description', e.target.value)}
                            className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-xl focus:ring-purple-500 focus:border-purple-500 p-3 text-sm text-gray-300 placeholder-gray-600 resize-y"
                            placeholder="Adicione detalhes a esta tarefa..."
                        />
                    </div>

                    {/* Image Cover */}
                    <div>
                        <label className="text-xs text-gray-500 mb-2 block uppercase tracking-wider font-semibold">Capa da Tarefa</label>
                        {previewImage ? (
                            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                <img src={previewImage} className="w-full h-full object-cover" alt="Capa" />
                                <button 
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white p-2 rounded-lg hover:bg-red-500/80 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <Trash2 size={16} /> Remover
                                </button>
                            </div>
                        ) : (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-24 border-2 border-dashed border-white/20 hover:border-purple-500 group rounded-xl flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-purple-400 hover:bg-purple-500/5 transition-all"
                            >
                                <ImagePlus size={24} className="mb-2" />
                                <span className="text-sm">Clique para adicionar uma imagem</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                    </div>

                    {/* Checklist */}
                    <div>
                        <label className="text-xs text-gray-500 mb-2 block uppercase tracking-wider font-semibold">Checklist</label>
                        
                        <div className="flex flex-col gap-2 mb-4">
                            {currentChecklist.map(item => (
                                <div key={item.id} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2 border border-white/5">
                                    <button onClick={() => toggleCheck(item.id)} className={`transition-colors ${item.done ? 'text-purple-400' : 'text-gray-500 hover:text-white'}`}>
                                        {item.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                    </button>
                                    <input 
                                        type="text"
                                        value={item.text}
                                        onChange={(e) => updateCheckText(item.id, e.target.value)}
                                        className={`flex-1 text-sm bg-transparent border-none focus:ring-0 px-2 py-1 outline-none ${item.done ? 'line-through text-gray-500' : 'text-gray-300'}`}
                                    />
                                    <button onClick={() => removeCheck(item.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={addCheckItem} className="flex gap-2">
                            <TextInput 
                                value={newCheckItem} 
                                onChange={e => setNewCheckItem(e.target.value)}
                                placeholder="Adicionar um item..." 
                                className="flex-1 bg-white/5 border-white/10 text-sm"
                            />
                            <button type="submit" className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 flex items-center gap-2 text-sm font-semibold transition-colors">
                                <Plus size={18} /> Adicionar
                            </button>
                        </form>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wider font-semibold">Data de Entrega</label>
                        <input 
                            type="date" 
                            value={data.due_date} 
                            onChange={e => setData('due_date', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl text-gray-300 p-2 focus:ring-purple-500 focus:border-purple-500 [color-scheme:dark]"
                        />
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-6 border-t border-white/10">
                        {!isNew ? (
                            <button onClick={handleDelete} className="text-red-400 hover:text-red-300 flex items-center gap-2 text-sm font-semibold transition-colors">
                                <Trash2 size={18} /> Excluir Tarefa
                            </button>
                        ) : <div></div>}

                        <button 
                            onClick={handleSave} 
                            disabled={processing}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50"
                        >
                            {isNew ? 'Criar Tarefa' : 'Salvar Alterações'}
                        </button>
                    </div>

                </div>
            </div>
        </Modal>
    );
}
