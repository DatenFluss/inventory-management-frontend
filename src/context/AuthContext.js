import React, {createContext, useState, useContext, useEffect, useCallback} from 'react';
import { jwtDecode } from 'jwt-decode';
import { updateToken } from '../services/api';
import { AUTH_ERROR_EVENT } from '../services/api';

export const AuthContext = createContext(null);

// Helper function to validate token
const validateToken = (token) => {
    if (!token) return false;
    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

// Helper function to parse user info from token
const parseUserInfo = (token) => {
    try {
        const decoded = jwtDecode(token);
        return {
            id: decoded.sub,
            fullName: decoded.fullName,
            email: decoded.email,
            username: decoded.username,
            role: decoded.role,
            enterpriseId: decoded.enterpriseId
        };
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage
    const [authState, setAuthState] = useState(() => {
        const token = localStorage.getItem('token');
        
        if (token && validateToken(token)) {
            const userInfo = parseUserInfo(token);
            if (userInfo && updateToken(token)) {
                return {
                    token,
                    userInfo,
                    role: userInfo.role
                };
            }
        }
        
        // Cleanup if anything fails
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        return {
            token: null,
            userInfo: null,
            role: null
        };
    });

    const login = useCallback(async (token) => {
        if (!token) {
            throw new Error('No token provided');
        }

        const userInfo = parseUserInfo(token);
        if (!userInfo || !userInfo.role) {
            throw new Error('Invalid token: missing user information');
        }

        // Update token in API service
        if (!updateToken(token)) {
            throw new Error('Failed to update token');
        }

        // Update state
        setAuthState({
            token,
            userInfo,
            role: userInfo.role
        });

        return userInfo;
    }, []);

    const logout = useCallback(() => {
        updateToken(null);
        setAuthState({
            token: null,
            userInfo: null,
            role: null
        });
    }, []);

    // Handle authentication errors
    useEffect(() => {
        let isHandlingError = false;
        
        const handleAuthError = () => {
            if (isHandlingError) return;
            isHandlingError = true;
            
            logout();
            
            // Reset error handling flag after a short delay
            setTimeout(() => {
                isHandlingError = false;
            }, 100);
        };

        window.addEventListener(AUTH_ERROR_EVENT, handleAuthError);
        return () => window.removeEventListener(AUTH_ERROR_EVENT, handleAuthError);
    }, [logout]);

    // Add periodic token validation
    useEffect(() => {
        if (!authState.token) return;

        const validateInterval = setInterval(() => {
            if (!validateToken(authState.token)) {
                logout();
            }
        }, 60000); // Check every minute

        return () => clearInterval(validateInterval);
    }, [authState.token, logout]);

    const value = {
        authToken: authState.token,
        userRole: authState.role,
        userInfo: authState.userInfo,
        login,
        logout,
        isAuthenticated: !!authState.token && validateToken(authState.token)
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
