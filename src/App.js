import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterEnterprisePage from './pages/RegisterEnterprisePage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="content">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/register-enterprise" element={<RegisterEnterprisePage />} />

                    {/* Protected Routes */}
                    <Route element={<RequireAuth />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        {/* Add other protected routes here */}
                    </Route>

                    {/* Catch-all Route */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;
