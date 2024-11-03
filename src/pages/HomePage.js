import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import {
    BarChart2,
    Users,
    Package,
    Shield,
    Clock,
    TrendingUp
} from 'lucide-react';

const HomePage = () => {
    const features = [
        {
            icon: <BarChart2 size={32} className="text-primary mb-3" />,
            title: 'Real-time Analytics',
            description: 'Get instant insights into your inventory performance with comprehensive analytics and reporting tools.'
        },
        {
            icon: <Users size={32} className="text-primary mb-3" />,
            title: 'Team Management',
            description: 'Collaborate seamlessly with your team members. Assign roles and manage permissions efficiently.'
        },
        {
            icon: <Package size={32} className="text-primary mb-3" />,
            title: 'Inventory Tracking',
            description: 'Track your inventory in real-time. Get notifications for low stock and optimize your supply chain.'
        },
        {
            icon: <Shield size={32} className="text-primary mb-3" />,
            title: 'Secure Platform',
            description: 'Enterprise-grade security to protect your data. Role-based access control and encryption.'
        },
        {
            icon: <Clock size={32} className="text-primary mb-3" />,
            title: 'Automated Operations',
            description: 'Automate routine tasks and streamline your workflow with our intelligent system.'
        },
        {
            icon: <TrendingUp size={32} className="text-primary mb-3" />,
            title: 'Growth Insights',
            description: 'Make data-driven decisions with advanced forecasting and trend analysis tools.'
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <div className="bg-primary text-white py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col md={7}>
                            <h1 className="display-4 fw-bold mb-4">
                                Enterprise Inventory Management System
                            </h1>
                            <p className="lead mb-4">
                                Transform your business operations with our comprehensive inventory
                                management solution. Streamline your workflow, increase efficiency,
                                and make data-driven decisions with real-time insights.
                            </p>
                            <div className="d-flex gap-3">
                                <Button
                                    variant="light"
                                    size="lg"
                                    as={Link}
                                    to="/register"
                                >
                                    Get Started
                                </Button>
                                <Button
                                    variant="outline-light"
                                    size="lg"
                                    as={Link}
                                    to="/login"
                                >
                                    Sign In
                                </Button>
                            </div>
                        </Col>
                        <Col md={5} className="d-none d-md-block">
                            {/* Placeholder for illustration/image */}
                            <div className="text-center">
                                <BarChart2 size={300} className="text-white-50" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Features Section */}
            <div className="py-5 bg-light">
                <Container>
                    <h2 className="text-center mb-5">Why Choose Our Platform?</h2>
                    <Row>
                        {features.map((feature, index) => (
                            <Col md={4} key={index} className="mb-4">
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Body className="text-center p-4">
                                        {feature.icon}
                                        <Card.Title className="mb-3">{feature.title}</Card.Title>
                                        <Card.Text className="text-muted">
                                            {feature.description}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            {/* CTA Section */}
            <div className="py-5 bg-white">
                <Container className="text-center">
                    <h2 className="mb-4">Ready to Get Started?</h2>
                    <p className="lead text-muted mb-4">
                        Join thousands of businesses that trust our platform for their inventory management needs.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button
                            variant="primary"
                            size="lg"
                            as={Link}
                            to="/register-enterprise"
                        >
                            Register Enterprise
                        </Button>
                        <Button
                            variant="outline-primary"
                            size="lg"
                            as={Link}
                            to="/register"
                        >
                            Create Account
                        </Button>
                    </div>
                </Container>
            </div>

            {/* Statistics Section */}
            <div className="py-5 bg-light">
                <Container>
                    <Row className="text-center">
                        <Col md={4} className="mb-4 mb-md-0">
                            <h2 className="display-4 fw-bold text-primary">10k+</h2>
                            <p className="text-muted">Active Users</p>
                        </Col>
                        <Col md={4} className="mb-4 mb-md-0">
                            <h2 className="display-4 fw-bold text-primary">99.9%</h2>
                            <p className="text-muted">Uptime</p>
                        </Col>
                        <Col md={4}>
                            <h2 className="display-4 fw-bold text-primary">24/7</h2>
                            <p className="text-muted">Support</p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default HomePage;