import axios, { InternalAxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface Task {
    id?: string;          // используется в приложении
    _id?: string;         // приходит с бэкенда
    title: string;
    description: string;
    dueDate: Date | string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
}


interface AuthResponse {
    user: {
        _id: string;
        email: string;
        name: string;
    };
    token: string;
}

export const auth = {
    register: (data: { email: string; password: string; name: string }) =>
        api.post<AuthResponse>('/users/register', data),
    login: (data: { email: string; password: string }) =>
        api.post<AuthResponse>('/users/login', data),
};

export const tasks = {
    getAll: () => api.get<Task[]>('/tasks'),
    create: (data: Omit<Task, 'id'>) => api.post<Task>('/tasks', data),
    update: (id: string, data: Partial<Task>) => api.patch<Task>(`/tasks/${id}`, data),
    delete: (id: string) => api.delete(`/tasks/${id}`),
};

export default api;
