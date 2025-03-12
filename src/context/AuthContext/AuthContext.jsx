import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        return new Promise((resolve) => {
            localStorage.removeItem('user');
            setUser(null);
            resolve(); // Гарантируем, что состояние обновилось
        });
    };

    return (
        <AuthContext.Provider value={{ 
            user,
            isLoading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};