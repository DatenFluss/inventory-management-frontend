import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const getDashboardRoute = (role) => {
        console.log('Determining dashboard route for role:', role);

        switch (role) {
            case 'EMPLOYEE':
                return '/employee-dashboard';
            case 'MANAGER':
                return '/manager-dashboard';
            case 'OWNER':
                return '/owner-dashboard';
            case 'ADMIN':
                return '/admin-dashboard';
            case 'UNAFFILIATED':
                return '/unaffiliated-dashboard';
            default:
                console.warn('Unknown role:', role);
                return '/unaffiliated-dashboard'; // fallback route
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/api/users/login', credentials);

            if (response.data.token) {
                const decoded = await login(response.data.token);

                // Get the dashboard route based on role
                const dashboardRoute = getDashboardRoute(decoded.role);
                navigate(dashboardRoute);
            } else {
                setError('Invalid response from server');
                console.error('No token in response:', response.data);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(
                error.response?.data?.message ||
                error.message ||
                'Login failed. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Card className="mx-auto" style={{ maxWidth: '400px' }}>
                <Card.Header as="h4" className="text-center">Login</Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    username: e.target.value
                                })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    password: e.target.value
                                })}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LoginPage;