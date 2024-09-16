import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function RequireAuth() {
    const { authToken } = useContext(AuthContext);
    const location = useLocation();

    if (!authToken) {
        // Redirect unauthenticated users to the login page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Render child routes for authenticated users.
    return <Outlet />;
}

export default RequireAuth;
