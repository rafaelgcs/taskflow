import { useState, useEffect } from 'react';

// Chave base do banco
const DB_KEY = 'taskflow_desktop_db';

const defaultDB = {
  users: [],       // { id, name, avatarUrl }
  tasks: [],       // { id, userId, status, title, description, image, checklist }
  currentUser: null
};

// Singleton-like function to perform safe local storage reads
const readDB = () => {
  try {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : defaultDB;
  } catch (e) {
    console.error("Local Storage is disabled or full", e);
    return defaultDB;
  }
};

const writeDB = (data) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// Initialize DB if empty
if (!localStorage.getItem(DB_KEY)) {
  writeDB(defaultDB);
}

// Hook that can be consumed by the components
export function useStorage() {
  const [db, setDb] = useState(readDB());

  // Single source of truth mutation
  const mutateDB = (updater) => {
    const currentDb = readDB(); // Garante o state original verdadeiro em tempo real
    const newDb = typeof updater === 'function' ? updater(currentDb) : updater;
    writeDB(newDb);
    window.dispatchEvent(new Event('storage'));
  };

  // Listen to changes from mutations
  useEffect(() => {
    const handleStorage = () => setDb(readDB());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Helper funcs
  const login = (userId) => {
    mutateDB(prev => ({ ...prev, currentUser: userId }));
  };

  const logout = () => {
    mutateDB(prev => ({ ...prev, currentUser: null }));
  };

  const addUser = (user) => {
    mutateDB(prev => ({ ...prev, users: [...prev.users, user] }));
  };

  const addTask = (task) => {
    mutateDB(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
  };

  const updateTask = (updatedTask) => {
    mutateDB(prev => {
      const updatedTasks = prev.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
      return { ...prev, tasks: updatedTasks };
    });
  };

  const updateTasks = (newTasksList) => {
    mutateDB(prev => ({ ...prev, tasks: newTasksList }));
  }

  const removeTask = (taskId) => {
    mutateDB(prev => {
      const updatedTasks = prev.tasks.filter(t => t.id !== taskId);
      return { ...prev, tasks: updatedTasks };
    });
  };

  // Current logged in user object
  const user = db.users.find(u => u.id === db.currentUser);

  return {
    db,
    user,
    login,
    logout,
    addUser,
    addTask,
    updateTask,
    updateTasks,
    removeTask
  };
}
