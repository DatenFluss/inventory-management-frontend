import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import {AuthProvider, useAuth} from './context/AuthContext';
import { AUTH_ERROR_EVENT } from './services/api';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterEnterprisePage from './pages/RegisterEnterprisePage';
import EmployeeDashboard from './components/dashboards/EmployeeDashboard';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import OwnerDashboard from './components/dashboards/OwnerDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import UnaffiliatedDashboard from './components/dashboards/UnaffiliatedDashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import NotFoundPage from './pages/NotFoundPage';
import { Alert, Button } from 'react-bootstrap';
import WarehouseOperatorDashboard from './components/dashboards/WarehouseOperatorDashboard';

const AuthErrorHandler = () => {
    const [authError, setAuthError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthError = (event) => {
            console.log('Auth error received:', event.detail);
            setAuthError(event.detail);
        };

        window.addEventListener(AUTH_ERROR_EVENT, handleAuthError);
        return () => window.removeEventListener(AUTH_ERROR_EVENT, handleAuthError);
    }, []);

    if (authError) {
        return (
            <Alert variant="danger" className="m-3">
                <Alert.Heading>Authentication Error</Alert.Heading>
                <p>
                    {authError.message}
                    <br />
                    Status: {authError.status}
                    <br />
                    URL: {authError.url}
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button 
                        variant="outline-danger"
                        onClick={() => {
                            setAuthError(null);
                            navigate('/login');
                        }}
                    >
                        Return to Login
                    </Button>
                </div>
            </Alert>
        );
    }

    return null;
};

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const { userRole, userInfo } = useAuth();
    console.log('RoleBasedRoute - Current user info:', {
        userRole,
        userInfo,
        allowedRoles,
        pathname: window.location.pathname
    });

    if (!userRole || !allowedRoles.includes(userRole)) {
        console.log('Unauthorized access attempted - Role mismatch:', {
            userRole,
            allowedRoles,
            hasRole: !!userRole,
            isAllowed: allowedRoles.includes(userRole)
        });
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

const getDashboardComponent = (role) => {
    switch (role) {
        case 'ROLE_ADMIN':
            return AdminDashboard;
        case 'ROLE_ENTERPRISE_OWNER':
            return OwnerDashboard;
        case 'ROLE_MANAGER':
            return ManagerDashboard;
        case 'ROLE_EMPLOYEE':
            return EmployeeDashboard;
        case 'ROLE_WAREHOUSE_OPERATOR':
            return WarehouseOperatorDashboard;
        default:
            return UnaffiliatedDashboard;
    }
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="d-flex flex-column min-vh-100">
                    <Navbar />
                    <AuthErrorHandler />
                    <div className="flex-grow-1">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/register-enterprise" element={<RegisterEnterprisePage />} />

                            {/* Protected Routes */}
                            <Route path="/employee-dashboard"
                                   element={
                                       <RequireAuth>
                                           <RoleBasedRoute allowedRoles={['ROLE_EMPLOYEE']}>
                                               <EmployeeDashboard />
                                           </RoleBasedRoute>
                                       </RequireAuth>
                                   }
                            />

                            <Route path="/manager-dashboard"
                                   element={
                                       <RequireAuth>
                                           <RoleBasedRoute allowedRoles={['ROLE_MANAGER']}>
                                               <ManagerDashboard />
                                           </RoleBasedRoute>
                                       </RequireAuth>
                                   }
                            />

                            <Route path="/owner-dashboard"
                                   element={
                                       <RequireAuth>
                                           <RoleBasedRoute allowedRoles={['ROLE_OWNER', 'ROLE_ENTERPRISE_OWNER']}>
                                               <OwnerDashboard />
                                           </RoleBasedRoute>
                                       </RequireAuth>
                                   }
                            />

                            <Route path="/admin-dashboard"
                                   element={
                                       <RequireAuth>
                                           <RoleBasedRoute allowedRoles={['ROLE_ADMIN']}>
                                               <AdminDashboard />
                                           </RoleBasedRoute>
                                       </RequireAuth>
                                   }
                            />

                            <Route path="/operator-dashboard"
                                   element={
                                       <RequireAuth>
                                           <RoleBasedRoute allowedRoles={['ROLE_WAREHOUSE_OPERATOR']}>
                                               <WarehouseOperatorDashboard />
                                           </RoleBasedRoute>
                                       </RequireAuth>
                                   }
                            />

                            <Route path="/unaffiliated-dashboard"
                                   element={
                                       <RequireAuth>
                                           <RoleBasedRoute allowedRoles={['ROLE_UNAFFILIATED']}>
                                               <UnaffiliatedDashboard />
                                           </RoleBasedRoute>
                                       </RequireAuth>
                                   }
                            />

                            {/* Error Routes */}
                            <Route path="/unauthorized" element={<UnauthorizedPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;