import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireAuth = ({ children }) => {
    const { authToken } = useAuth();
    const location = useLocation();

    if (!authToken) {
        console.log('RequireAuth - No token, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log('RequireAuth - Authenticated, rendering children');
    return children;
};

export default RequireAuth;
