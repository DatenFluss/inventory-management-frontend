import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <Container className="py-5">
            <div className="text-center">
                <AlertTriangle size={64} className="text-warning mb-4" />
                <h1 className="mb-4">Unauthorized Access</h1>
                <Alert variant="warning" className="mb-4">
                    You don't have permission to access this page.
                </Alert>
                <div className="d-flex justify-content-center gap-3">
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Go to Home
                    </Button>
                    <Button variant="outline-primary" onClick={() => navigate('/login')}>
                        Login
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default UnauthorizedPage; 