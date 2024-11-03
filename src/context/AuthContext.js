import React, {createContext, useState, useContext, useEffect, useCallback} from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return decoded.role;
            } catch (error) {
                console.error('Error decoding initial token:', error);
                localStorage.removeItem('token');
                return null;
            }
        }
        return null;
    });

    const login = useCallback(async (token) => {
        console.log('AuthProvider - Login called with token');

        try {
            const decoded = jwtDecode(token);
            console.log('AuthProvider - Decoded token:', decoded);

            localStorage.setItem('token', token);
            setAuthToken(token);
            setUserRole(decoded.role);

            return decoded;
        } catch (error) {
            console.error('Error in login:', error);
            localStorage.removeItem('token');
            setAuthToken(null);
            setUserRole(null);
            throw new Error('Invalid token received');
        }
    }, []);

    const logout = useCallback(() => {
        console.log('AuthProvider - Logout called');
        try {
            localStorage.removeItem('token');
            setAuthToken(null);
            setUserRole(null);
        } catch (error) {
            console.error('Error during logout:', error);
            // Even if there's an error, we want to clear the state
            setAuthToken(null);
            setUserRole(null);
        }
    }, []);

    // Verify token on mount and token change
    useEffect(() => {
        if (authToken) {
            try {
                const decoded = jwtDecode(authToken);
                const currentTime = Date.now() / 1000;
                if (decoded.exp && decoded.exp < currentTime) {
                    console.log('Token expired, logging out');
                    logout();
                } else {
                    setUserRole(decoded.role);
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                logout();
            }
        }
    }, [authToken, logout]);

    const value = {
        authToken,
        userRole,
        login,
        logout,
        isAuthenticated: !!authToken
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
