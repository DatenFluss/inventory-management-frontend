import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserMainPage from './pages/UserMainPage';
import RegisterEnterprisePage from './pages/RegisterEnterprisePage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    return (
        <Router>
            {/* Apply Flexbox styles to the main container */}
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                {/* Flex-grow-1 allows this div to expand and push the footer to the bottom */}
                <div className="flex-grow-1">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/register-enterprise" element={<RegisterEnterprisePage />} />

                        {/* Protected Routes */}
                        <Route element={<RequireAuth />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/main" element={<UserMainPage />} />
                        </Route>

                        {/* Catch-all Route */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
