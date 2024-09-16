import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

function HomePage() {
    return (
        <div className="bg-light py-5">
            <Container>
                <h1 className="display-4">Welcome to the Inventory Management System</h1>
                <p className="lead">
                    Manage your inventory efficiently with our state-of-the-art system.
                </p>
                <hr className="my-4" />
                <p>
                    Get started by logging in or registering a new account.
                </p>
                <p className="mt-4">
                    <Button variant="primary" as={Link} to="/login" className="me-2">
                        Login
                    </Button>
                    <Button variant="secondary" as={Link} to="/register" className="me-2">
                        Register
                    </Button>
                    <Button variant="success" as={Link} to="/register-enterprise">
                        Register Enterprise
                    </Button>
                </p>
            </Container>
        </div>
    );
}

export default HomePage;
