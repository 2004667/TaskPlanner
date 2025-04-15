export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
    createdAt: Date;
}

export type TaskFormData = Omit<Task, 'createdAt' | 'completed'>;

export interface TaskContextType {
    tasks: Task[];
    addTask: (task: Omit<TaskFormData, 'id'>) => void;
    updateTask: (id: string, task: Partial<Omit<Task, 'id'>>) => void;
    deleteTask: (id: string) => void;
    toggleTaskComplete: (id: string) => void;
    editTask: (task: Task) => void;
} 