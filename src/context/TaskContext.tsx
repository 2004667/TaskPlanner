import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Task, TaskFormData, TaskContextType } from '../types';
import { tasks as tasksApi } from '../services/api';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const normalizeTask = (task: any): Task => ({
        ...task,
        id: task._id,
        dueDate: new Date(task.dueDate),
    });

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await tasksApi.getAll();
                setTasks(response.data.map(normalizeTask));
            } catch (error) {
                console.error('Ошибка при загрузке задач:', error);
            }
        };
        fetchTasks();
    }, []);

    const addTask = useCallback(async (taskData: Omit<TaskFormData, 'id'>) => {
        try {
            const response = await tasksApi.create({
                ...taskData,
                completed: false,
                dueDate: new Date(taskData.dueDate).toISOString(),
            });
            setTasks((prev) => [...prev, normalizeTask(response.data)]);
        } catch (error) {
            console.error('Ошибка при добавлении задачи:', error);
        }
    }, []);

    const updateTask = useCallback(async (id: string, updatedTask: Partial<Omit<Task, 'id'>>) => {
        try {
            const normalizedTask = {
                ...updatedTask,
                dueDate: updatedTask.dueDate instanceof Date
                    ? updatedTask.dueDate.toISOString()
                    : new Date(updatedTask.dueDate!).toISOString(),
            };

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === id ? { ...task, ...updatedTask } : task
                )
            );

            const response = await tasksApi.update(id, normalizedTask);
            const updated = normalizeTask(response.data);

            setTasks((prev) =>
                prev.map((task) => (task.id === id ? updated : task))
            );
        } catch (error) {
            console.error('Ошибка при обновлении задачи:', error);
        }
    }, []);


    const deleteTask = useCallback(async (id: string) => {
        try {
            await tasksApi.delete(id);
            setTasks((prev) => prev.filter((task) => task.id !== id));
        } catch (error) {
            console.error('Ошибка при удалении задачи:', error);
        }
    }, []);

    const toggleTaskComplete = useCallback((id: string) => {
        setTasks((prev) => {
            const updatedTasks = prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            const updatedTask = updatedTasks.find((task) => task.id === id);
            if (updatedTask) {
                updateTask(id, { completed: updatedTask.completed });
            }
            return updatedTasks;
        });
    }, [tasks, updateTask]);

    const editTask = useCallback((updatedTask: Task) => {
        if (!updatedTask.id) {
            console.error('editTask: ID задачи не найден');
            return;
        }

        const { id, ...rest } = updatedTask;

        const updatedData = {
            ...rest,
            dueDate: new Date(updatedTask.dueDate),
        };

        updateTask(id, updatedData);
    }, [updateTask]);


    const value: TaskContextType = {
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        editTask,
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};
