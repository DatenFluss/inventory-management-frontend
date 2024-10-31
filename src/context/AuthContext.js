import React, { createContext, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(null);
    const [enterpriseId, setEnterpriseId] = useState(null);

    const login = (token) => {
        localStorage.setItem('token', token);
        setAuthToken(token);

        // Decode token to get user info
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
        setEnterpriseId(decoded.enterpriseId);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setUserRole(null);
        setEnterpriseId(null);
    };

    // Helper function to determine which dashboard to show
    const getDashboardRoute = () => {
        if (!enterpriseId) return '/unaffiliated-dashboard';

        switch (userRole) {
            case 'EMPLOYEE': return '/employee-dashboard';
            case 'MANAGER': return '/manager-dashboard';
            case 'OWNER': return '/owner-dashboard';
            case 'ADMIN': return '/admin-dashboard';
            default: return '/unaffiliated-dashboard';
        }
    };

    return (
        <AuthContext.Provider value={{
            authToken,
            userRole,
            enterpriseId,
            login,
            logout,
            getDashboardRoute
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);