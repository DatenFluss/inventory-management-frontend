import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Container, Form, Button, Alert, Card, ProgressBar } from 'react-bootstrap';
import {
    User,
    Mail,
    Lock,
    UserCircle,
    CheckCircle
} from 'lucide-react';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        fullName: '',
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const formFields = [
        {
            name: 'fullName',
            label: 'Full Name',
            type: 'text',
            icon: UserCircle,
            placeholder: 'Enter your full name'
        },
        {
            name: 'username',
            label: 'Username',
            type: 'text',
            icon: User,
            placeholder: 'Choose a username'
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            icon: Mail,
            placeholder: 'Enter your email address'
        },
        {
            name: 'password',
            label: 'Password',
            type: 'password',
            icon: Lock,
            placeholder: 'Choose a secure password'
        }
    ];

    const calculateProgress = () => {
        const filledFields = Object.values(credentials).filter(value => value.trim() !== '').length;
        return (filledFields / Object.keys(credentials).length) * 100;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await api.post('/api/users/register', credentials);
            console.log('Registration successful:', response.data);

            setSuccess('Registration successful! Redirecting to login...');

            // Clear the form
            setCredentials({
                fullName: '',
                username: '',
                email: '',
                password: ''
            });

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error);
            setError(
                error.response?.data?.message ||
                error.message ||
                'Registration failed. Please try again.'
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
                        <h2 className="fw-bold">Create Account</h2>
                        <p className="text-muted">
                            Join our platform to manage your enterprise efficiently
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between mb-2">
                            <small className="text-muted">Completion Progress</small>
                            <small className="text-primary">{Math.round(calculateProgress())}%</small>
                        </div>
                        <ProgressBar now={calculateProgress()} className="mb-4" />
                    </div>

                    {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
                    {success && <Alert variant="success" className="mb-4">{success}</Alert>}

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
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        Create Account
                                    </>
                                )}
                            </Button>
                            <div className="text-center mt-3">
                                <p className="text-muted mb-0">
                                    Already have an account?{' '}
                                    <Button
                                        variant="link"
                                        className="p-0"
                                        onClick={() => navigate('/login')}
                                    >
                                        Sign in
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

export default RegisterPage;
