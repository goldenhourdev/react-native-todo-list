import React, { createContext, ReactNode, useContext, useState } from 'react';

export type TaskCategory = 'Urgent' | 'General';
export interface Task {
  text: string;
  dueDate: Date;
  category: TaskCategory;
}

interface TasksContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  removeTask: (index: number) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => setTasks(prev => [...prev, task]);
  const removeTask = (index: number) => setTasks(prev => prev.filter((_, i) => i !== index));

  return (
    <TasksContext.Provider value={{ tasks, addTask, removeTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used within a TasksProvider');
  return context;
}
