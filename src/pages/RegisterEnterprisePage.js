import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import {
    Building2,
    MapPin,
    Mail,
    User,
    Lock,
    Briefcase,
    CheckCircle,
    UserCircle
} from 'lucide-react';
import api from '../services/api';

const RegisterEnterprisePage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        enterpriseName: '',
        address: '',
        contactEmail: '',
        ownerFullName: '',
        ownerUsername: '',
        ownerPassword: '',
        ownerEmail: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const formFields = [
        // Enterprise Section
        {
            section: 'enterprise',
            fields: [
                { name: 'enterpriseName', label: 'Enterprise Name', type: 'text', icon: Building2, placeholder: 'Enter your enterprise name' },
                { name: 'address', label: 'Address', type: 'text', icon: MapPin, placeholder: 'Enter enterprise address' },
                { name: 'contactEmail', label: 'Contact Email', type: 'email', icon: Mail, placeholder: 'Enter enterprise contact email' },
            ]
        },
        // Owner Section
        {
            section: 'owner',
            fields: [
                { name: 'ownerFullName', label: 'Full Name', type: 'text', icon: UserCircle, placeholder: 'Enter owner\'s full name' },
                { name: 'ownerUsername', label: 'Username', type: 'text', icon: User, placeholder: 'Choose owner username' },
                { name: 'ownerEmail', label: 'Email', type: 'email', icon: Mail, placeholder: 'Enter owner email address' },
                { name: 'ownerPassword', label: 'Password', type: 'password', icon: Lock, placeholder: 'Choose a strong password' },
            ]
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateProgress = () => {
        const filledFields = Object.values(formData).filter(value => value.trim() !== '').length;
        return (filledFields / Object.keys(formData).length) * 100;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/api/enterprises/register', formData);
            setSuccess('Enterprise registration successful! Redirecting to login...');

            // Reset form
            setFormData({
                enterpriseName: '',
                address: '',
                contactEmail: '',
                ownerFullName: '',
                ownerUsername: '',
                ownerPassword: '',
                ownerEmail: ''
            });

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Enterprise registration failed. Please try again.');
            console.error('Enterprise registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <Briefcase size={48} className="text-primary mb-2" />
                                <h2 className="fw-bold">Register Your Enterprise</h2>
                                <p className="text-muted">
                                    Create an enterprise account to start managing your business
                                </p>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <small className="text-muted">Registration Progress</small>
                                    <small className="text-primary">{Math.round(calculateProgress())}%</small>
                                </div>
                                <ProgressBar now={calculateProgress()} className="mb-4" />
                            </div>

                            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
                            {success && <Alert variant="success" className="mb-4">{success}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                {formFields.map((section, sectionIndex) => (
                                    <div key={section.section} className="mb-4">
                                        <h5 className="mb-3 border-bottom pb-2">
                                            {section.section === 'enterprise' ? 'Enterprise Details' : 'Owner Details'}
                                        </h5>
                                        <Row>
                                            {section.fields.map((field) => (
                                                <Col md={field.name.includes('enterprise') ? 12 : 6} key={field.name}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="d-flex align-items-center">
                                                            <field.icon size={18} className="text-primary me-2" />
                                                            {field.label}
                                                        </Form.Label>
                                                        <Form.Control
                                                            type={field.type}
                                                            name={field.name}
                                                            placeholder={field.placeholder}
                                                            value={formData[field.name]}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
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
                                                Register Enterprise
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate('/')}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterEnterprisePage;
