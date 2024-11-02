import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {AuthProvider, useAuth} from './context/AuthContext';
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
    const { userRole } = useAuth();
    console.log('RoleBasedRoute rendered - userRole:', userRole, 'allowedRoles:', allowedRoles);

    if (!userRole || !allowedRoles.includes(userRole)) {
        console.log('Unauthorized access attempted');
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
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

                            {/* Protected Routes */}
                            <Route path="/employee-dashboard"
                                   element={
                                       <RequireAuth>
                                           <RoleBasedRoute allowedRoles={['EMPLOYEE']}>
                                               <EmployeeDashboard />
                                           </RoleBasedRoute>
                                       </RequireAuth>
                                   }
                            />

                            <Route path="/manager-dashboard"
                                   element={
                                       <RequireAuth>
                                           <RoleBasedRoute allowedRoles={['MANAGER']}>
                                               <ManagerDashboard />
                                           </RoleBasedRoute>
                                       </RequireAuth>
                                   }
                            />

                            <Route path="/owner-dashboard"
                                   element={
                                       <RequireAuth>
                                           <RoleBasedRoute allowedRoles={['OWNER']}>
                                               <OwnerDashboard />
                                           </RoleBasedRoute>
                                       </RequireAuth>
                                   }
                            />

                            <Route path="/admin-dashboard"
                                   element={
                                       <RequireAuth>
                                           <RoleBasedRoute allowedRoles={['ADMIN']}>
                                               <AdminDashboard />
                                           </RoleBasedRoute>
                                       </RequireAuth>
                                   }
                            />

                            <Route path="/unaffiliated-dashboard"
                                   element={
                                       <RequireAuth>
                                           <RoleBasedRoute allowedRoles={['UNAFFILIATED']}>
                                               <UnaffiliatedDashboard />
                                           </RoleBasedRoute>
                                       </RequireAuth>
                                   }
                            />

                            {/* Error Routes */}
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