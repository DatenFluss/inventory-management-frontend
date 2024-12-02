import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import {
    User,
    Lock,
    LogIn,
    UserCircle
} from 'lucide-react';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const formFields = [
        {
            name: 'username',
            label: 'Username',
            type: 'text',
            icon: User,
            placeholder: 'Enter your username'
        },
        {
            name: 'password',
            label: 'Password',
            type: 'password',
            icon: Lock,
            placeholder: 'Enter your password'
        }
    ];

    const getDashboardRoute = (role) => {
        console.log('Determining dashboard route for role:', role);
        
        switch (role) {
            case 'ROLE_EMPLOYEE':
                return '/employee-dashboard';
            case 'ROLE_MANAGER':
                return '/manager-dashboard';
            case 'ROLE_OWNER':
            case 'ROLE_ENTERPRISE_OWNER':
                return '/owner-dashboard';
            case 'ROLE_ADMIN':
                return '/admin-dashboard';
            case 'ROLE_WAREHOUSE_OPERATOR':
                return '/operator-dashboard';
            case 'ROLE_UNAFFILIATED':
                return '/unaffiliated-dashboard';
            default:
                console.warn('Unknown role:', role);
                return '/unauthorized';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Attempting login with credentials:', { username: credentials.username });
            const response = await api.post('/api/users/login', credentials);
            console.log('Login response:', response.data);

            if (response.data.token) {
                console.log('Token received, attempting to decode and login');
                const decoded = await login(response.data.token);
                console.log('Decoded token data:', decoded);
                
                const dashboardRoute = getDashboardRoute(decoded.role);
                console.log('Navigating to dashboard:', dashboardRoute);
                navigate(dashboardRoute);
            } else {
                setError('Invalid response from server');
                console.error('No token in response:', response.data);
            }
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error response:', error.response?.data);
            setError(
                error.response?.data?.message ||
                error.message ||
                'Login failed. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container className="py-5">
            <Card className="mx-auto border-0 shadow-sm" style={{ maxWidth: '450px' }}>
                <Card.Body className="p-4">
                    <div className="text-center mb-4">
                        <UserCircle size={48} className="text-primary mb-2" />
                        <h2 className="fw-bold">Welcome Back</h2>
                        <p className="text-muted">
                            Sign in to access your dashboard
                        </p>
                    </div>

                    {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        {formFields.map((field) => (
                            <Form.Group className="mb-3" key={field.name}>
                                <Form.Label className="d-flex align-items-center">
                                    <field.icon size={18} className="text-primary me-2" />
                                    {field.label}
                                </Form.Label>
                                <Form.Control
                                    type={field.type}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    value={credentials[field.name]}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        ))}

                        <div className="d-grid gap-2 mt-4">
                            <Button
                                variant="primary"
                                type="submit"
                                size="lg"
                                disabled={isLoading}
                                className="d-flex align-items-center justify-content-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn size={20} />
                                        Sign In
                                    </>
                                )}
                            </Button>

                            <div className="text-center mt-3">
                                <p className="text-muted mb-2">
                                    Don't have an account?{' '}
                                    <Button
                                        variant="link"
                                        className="p-0"
                                        onClick={() => navigate('/register')}
                                    >
                                        Create Account
                                    </Button>
                                </p>
                                <p className="text-muted mb-0">
                                    Want to register an enterprise?{' '}
                                    <Button
                                        variant="link"
                                        className="p-0"
                                        onClick={() => navigate('/register-enterprise')}
                                    >
                                        Register Enterprise
                                    </Button>
                                </p>
                            </div>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LoginPage;
