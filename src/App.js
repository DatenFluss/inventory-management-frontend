import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterEnterprisePage from './pages/RegisterEnterprisePage';
import EmployeeDashboard from './components/dashboards/EmployeeDashboard';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import OwnerDashboard from './components/dashboards/OwnerDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import UnaffiliatedDashboard from './components/dashboards/UnaffiliatedDashboard';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import NotFoundPage from './pages/NotFoundPage';

const RoleBasedRoute = ({ children, allowedRoles }) => {
    return (
        <RequireAuth>
            {({ userRole }) => {
                if (!allowedRoles.includes(userRole)) {
                    return <Navigate to="/unauthorized" />;
                }
                return children;
            }}
        </RequireAuth>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="d-flex flex-column min-vh-100">
                    <Navbar />
                    <div className="flex-grow-1">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/register-enterprise" element={<RegisterEnterprisePage />} />

                            {/* Protected Routes with Role-Based Access */}
                            <Route element={<RequireAuth />}>
                                {/* Employee Dashboard */}
                                <Route
                                    path="/employee-dashboard"
                                    element={
                                        <RoleBasedRoute allowedRoles={['EMPLOYEE']}>
                                            <EmployeeDashboard />
                                        </RoleBasedRoute>
                                    }
                                />

                                {/* Manager Dashboard */}
                                <Route
                                    path="/manager-dashboard"
                                    element={
                                        <RoleBasedRoute allowedRoles={['MANAGER']}>
                                            <ManagerDashboard />
                                        </RoleBasedRoute>
                                    }
                                />

                                {/* Owner Dashboard */}
                                <Route
                                    path="/owner-dashboard"
                                    element={
                                        <RoleBasedRoute allowedRoles={['OWNER']}>
                                            <OwnerDashboard />
                                        </RoleBasedRoute>
                                    }
                                />

                                {/* Admin Dashboard */}
                                <Route
                                    path="/admin-dashboard"
                                    element={
                                        <RoleBasedRoute allowedRoles={['ADMIN']}>
                                            <AdminDashboard />
                                        </RoleBasedRoute>
                                    }
                                />

                                {/* Unaffiliated Dashboard */}
                                <Route
                                    path="/unaffiliated-dashboard"
                                    element={
                                        <RoleBasedRoute allowedRoles={['UNAFFILIATED']}>
                                            <UnaffiliatedDashboard />
                                        </RoleBasedRoute>
                                    }
                                />
                            </Route>

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

const UnauthorizedPage = () => {
    return (
        <div className="container mt-5">
            <div className="alert alert-danger">
                <h4>Unauthorized Access</h4>
                <p>You don't have permission to access this page.</p>
            </div>
        </div>
    );
};

export default App;