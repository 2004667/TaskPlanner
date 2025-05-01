import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth } from '../services/api';

interface User {
    _id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const login = useCallback(async (email: string, password: string) => {
        try {
            const response = await auth.login({ email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));  // Сохраняем пользователя в localStorage
            setToken(token);
            setUser(user);
        } catch (error) {
            console.error('Ошибка при логине:', error);
            throw error;
        }
    }, []);

    const register = useCallback(async (name: string, email: string, password: string) => {
        try {
            const response = await auth.register({ name, email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));  // Сохраняем пользователя в localStorage
            setToken(token);
            setUser(user);
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');  // Удаляем пользователя из localStorage
        setToken(null);
        setUser(null);
    }, []);

    // Автоматическая проверка токена и пользователя на старте
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
            setToken(null);
        }
    }, []);

    const value: AuthContextType = {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
