import React, { createContext, useContext, useState, useCallback } from 'react';
import { Task, TaskFormData, TaskContextType } from '../types';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const addTask = useCallback((taskData: Omit<TaskFormData, 'id'>) => {
        const newTask: Task = {
            ...taskData,
            id: Date.now().toString(),
            completed: false,
            createdAt: new Date(),
        };
        setTasks((prev) => [...prev, newTask]);
    }, []);

    const updateTask = useCallback((id: string, updatedTask: Partial<Omit<Task, 'id'>>) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, ...updatedTask } : task
            )
        );
    }, []);

    const deleteTask = useCallback((id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    }, []);

    const toggleTaskComplete = useCallback((id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    }, []);

    const editTask = (task: Task) => {
        setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === task.id ? task : t))
        );
    };

    const value = {
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        editTask
    };

    return (
        <TaskContext.Provider
            value={value}
        >
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
}; 