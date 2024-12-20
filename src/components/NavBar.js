import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
    const { authToken, userRole, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        try {
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                {!authToken ? (
                    <Navbar.Brand as={Link} to="/">Enterprise Manager</Navbar.Brand>
                ) : (
                    <Navbar.Brand>Enterprise Manager</Navbar.Brand>
                )}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* Home button removed */}
                    </Nav>
                    <Nav>
                        {!authToken ? (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        ) : (
                            <Button
                                variant="outline-light"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;