import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const existingToken = localStorage.getItem('token');
    const [authToken, setAuthToken] = useState(existingToken);

    const setToken = (token) => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        setAuthToken(token);
    };

    return (
        <AuthContext.Provider value={{ authToken, setAuthToken: setToken }}>
            {children}
        </AuthContext.Provider>
    );
}
