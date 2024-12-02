import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { updateToken } from '../services/api';
import { Alert, Button, Card, Container } from 'react-bootstrap';

const InviteHandler = ({ inviteId }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleInviteResponse = async (action) => {
        setLoading(true);
        setError('');

        try {
            console.log('Sending invite response:', action);
            const response = await api.post(`/api/enterprises/invites/${inviteId}/${action}`);
            console.log('Invite response:', response.data);
            
            if (action === 'accept') {
                if (response.data.token) {
                    console.log('Received new token');
                    
                    // Update API headers first
                    updateToken(response.data.token);
                    console.log('Updated API headers');
                    
                    // Then login with the new token
                    await login(response.data.token);
                    console.log('Logged in with new token');
                    
                    // Redirect based on role
                    const role = response.data.role;
                    console.log('User role:', role);
                    
                    let targetPath;
                    switch (role) {
                        case 'EMPLOYEE':
                            targetPath = '/employee-dashboard';
                            break;
                        case 'MANAGER':
                            targetPath = '/manager-dashboard';
                            break;
                        case 'WAREHOUSE_OPERATOR':
                            targetPath = '/operator-dashboard';
                            break;
                        default:
                            targetPath = '/';
                    }
                    
                    console.log('Redirecting to:', targetPath);
                    navigate(targetPath);
                } else {
                    console.error('No token in response:', response.data);
                    throw new Error('No token received after accepting invite');
                }
            } else {
                console.log('Invite declined, redirecting to home');
                navigate('/');
            }
        } catch (error) {
            console.error('Error handling invite:', error);
            console.error('Error details:', error.response?.data);
            setError(error.response?.data?.message || 'Failed to process invite');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Card className="mx-auto" style={{ maxWidth: '500px' }}>
                <Card.Body className="text-center">
                    <h3 className="mb-4">Enterprise Invitation</h3>
                    {error && (
                        <Alert variant="danger">
                            {error}
                            <br />
                            <small>Please try logging out and back in if the problem persists.</small>
                        </Alert>
                    )}
                    <div className="d-flex justify-content-center gap-3">
                        <Button
                            variant="success"
                            onClick={() => handleInviteResponse('accept')}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Accept Invite'}
                        </Button>
                        <Button
                            variant="outline-danger"
                            onClick={() => handleInviteResponse('decline')}
                            disabled={loading}
                        >
                            Decline
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default InviteHandler; 