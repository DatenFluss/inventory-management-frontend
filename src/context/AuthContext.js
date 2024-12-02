import React, {createContext, useState, useContext, useEffect, useCallback} from 'react';
import { jwtDecode } from 'jwt-decode';
import { updateToken } from '../services/api';
import { AUTH_ERROR_EVENT } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                    return null;
                }
                return token;
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                return null;
            }
        }
        return null;
    });
    const [userRole, setUserRole] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const login = useCallback(async (token) => {
        console.log('AuthProvider - Login called');

        try {
            const decoded = jwtDecode(token);
            console.log('AuthProvider - Decoded token:', {
                sub: decoded.sub,
                role: decoded.role,
                exp: decoded.exp,
                currentTime: Date.now() / 1000
            });

            if (!decoded.role) {
                console.error('No role found in token');
                throw new Error('Invalid token: no role found');
            }

            // Extract user information from token
            const userInfo = {
                id: decoded.sub,
                fullName: decoded.fullName,
                email: decoded.email,
                username: decoded.username,
                role: decoded.role,
                enterpriseId: decoded.enterpriseId
            };

            console.log('AuthProvider - User info extracted:', userInfo);

            // Update token in API service first
            updateToken(token);
            
            // Then update local storage and state
            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            
            setAuthToken(token);
            setUserRole(decoded.role);
            setUserInfo(userInfo);

            console.log('AuthProvider - Login complete');
            return decoded;
        } catch (error) {
            console.error('Error in login:', error);
            updateToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            setAuthToken(null);
            setUserRole(null);
            setUserInfo(null);
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        console.log('AuthProvider - Logout called');
        updateToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setAuthToken(null);
        setUserRole(null);
        setUserInfo(null);
        console.log('AuthProvider - Logout complete');
    }, []);

    // Handle authentication errors
    useEffect(() => {
        const handleAuthError = (event) => {
            console.log('AuthProvider - Auth error event received:', event.detail);
            logout();
        };

        window.addEventListener(AUTH_ERROR_EVENT, handleAuthError);
        return () => window.removeEventListener(AUTH_ERROR_EVENT, handleAuthError);
    }, [logout]);

    // Initialize user info from localStorage on mount
    useEffect(() => {
        console.log('AuthProvider - Initializing from localStorage');
        const token = localStorage.getItem('token');
        const storedUserInfo = localStorage.getItem('userInfo');
        
        if (token && storedUserInfo) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    console.log('AuthProvider - Token expired, logging out');
                    logout();
                    return;
                }

                const parsedUserInfo = JSON.parse(storedUserInfo);
                console.log('AuthProvider - Parsed user info:', parsedUserInfo);
                updateToken(token);
                setUserInfo(parsedUserInfo);
                setUserRole(parsedUserInfo.role);
                setAuthToken(token);
                console.log('AuthProvider - Initialization complete');
            } catch (error) {
                console.error('Error parsing stored user info:', error);
                logout();
            }
        }
    }, [logout]);

    const value = {
        authToken,
        userRole,
        userInfo,
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
