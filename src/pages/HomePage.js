import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="container mt-5">
            <h1>Welcome to the Inventory Management System</h1>
            <p>
                Manage your inventory efficiently with our state-of-the-art inventory management system.
            </p>
            <div className="mt-4">
                <Link to="/login" className="btn btn-primary mr-2">
                    Login
                </Link>
                <Link to="/register" className="btn btn-secondary mr-2">
                    Register
                </Link>
                <Link to="/register-enterprise" className="btn btn-success">
                    Register Enterprise
                </Link>
            </div>
        </div>
    );
}

export default HomePage;
