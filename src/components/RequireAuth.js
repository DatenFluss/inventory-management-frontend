import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const RequireAuth = ({ children }) => {
    const { authToken, logout } = useAuth();
    const location = useLocation();

    // Validate token
    if (authToken) {
        try {
            const decoded = jwtDecode(authToken);
            if (decoded.exp * 1000 < Date.now()) {
                // Token is expired
                logout();
                return <Navigate to="/login" state={{ from: location }} replace />;
            }
        } catch (error) {
            // Invalid token
            logout();
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
    } else {
        // No token
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAuth;
