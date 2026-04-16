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

  // Listen to changes (if we had multiple tabs, but here it's an electron app)
  useEffect(() => {
    const handleStorage = () => setDb(readDB());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const saveDb = (newDb) => {
    writeDB(newDb);
    setDb(newDb);
    // Dispatch custom event to notify other components inside the same tab
    window.dispatchEvent(new Event('storage'));
  };

  // Helper funcs
  const login = (userId) => {
    saveDb({ ...db, currentUser: userId });
  };

  const logout = () => {
    saveDb({ ...db, currentUser: null });
  };

  const addUser = (user) => {
    const newDb = { ...db, users: [...db.users, user] };
    saveDb(newDb);
  };

  const addTask = (task) => {
    saveDb({ ...db, tasks: [...db.tasks, task] });
  };

  const updateTask = (updatedTask) => {
    const updatedTasks = db.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    saveDb({ ...db, tasks: updatedTasks });
  };

  const updateTasks = (newTasksList) => {
    saveDb({ ...db, tasks: newTasksList });
  }

  const removeTask = (taskId) => {
    const updatedTasks = db.tasks.filter(t => t.id !== taskId);
    saveDb({ ...db, tasks: updatedTasks });
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
