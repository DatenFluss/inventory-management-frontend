import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';

const UnaffiliatedDashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [invites, setInvites] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createError, setCreateError] = useState('');
    const [enterpriseForm, setEnterpriseForm] = useState({
        name: '',
        description: '',
        industry: ''
    });

    useEffect(() => {
        fetchUserInfo();
        fetchInvites();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await api.get('/api/users/me');
            setUserInfo(response.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const fetchInvites = async () => {
        try {
            const response = await api.get('/api/enterprises/invites');
            setInvites(response.data);
        } catch (error) {
            console.error('Error fetching invites:', error);
        }
    };

    const handleCreateEnterprise = async (e) => {
        e.preventDefault();
        setCreateError('');

        try {
            await api.post('/api/enterprises', enterpriseForm);
            setShowCreateModal(false);
            // Refresh user info as they should now be an owner
            fetchUserInfo();
        } catch (error) {
            setCreateError(error.response?.data?.message || 'Failed to create enterprise');
        }
    };

    const handleInviteResponse = async (inviteId, accept) => {
        try {
            await api.post(`/api/enterprises/invites/${inviteId}/${accept ? 'accept' : 'decline'}`);
            // Refresh invites
            fetchInvites();
            if (accept) {
                // Refresh user info as they should now be affiliated
                fetchUserInfo();
            }
        } catch (error) {
            console.error('Error handling invite:', error);
        }
    };

    return (
        <Container className="py-5">
            {/* User Info Section */}
            <Card className="mb-4">
                <Card.Body>
                    <Card.Title>Welcome, {userInfo?.username}!</Card.Title>
                    <Card.Text>
                        Email: {userInfo?.email}
                        <br />
                        Status: Unaffiliated
                    </Card.Text>
                </Card.Body>
            </Card>

            <Row>
                {/* Inbox Section */}
                <Col md={8}>
                    <Card>
                        <Card.Header>
                            <h4 className="mb-0">Enterprise Invitations</h4>
                        </Card.Header>
                        <Card.Body>
                            {invites.length === 0 ? (
                                <Alert variant="info">No pending invitations</Alert>
                            ) : (
                                invites.map(invite => (
                                    <Card key={invite.id} className="mb-3">
                                        <Card.Body>
                                            <h5>{invite.enterpriseName}</h5>
                                            <p>Role: {invite.role}</p>
                                            <p>Invited by: {invite.inviterName}</p>
                                            <p>Sent: {new Date(invite.createdAt).toLocaleDateString()}</p>
                                            <div>
                                                <Button
                                                    variant="success"
                                                    className="me-2"
                                                    onClick={() => handleInviteResponse(invite.id, true)}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleInviteResponse(invite.id, false)}
                                                >
                                                    Decline
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Create Enterprise Section */}
                <Col md={4}>
                    <Card>
                        <Card.Header>
                            <h4 className="mb-0">Create Enterprise</h4>
                        </Card.Header>
                        <Card.Body>
                            <p>Start your own enterprise and manage your resources effectively.</p>
                            <Button
                                variant="primary"
                                onClick={() => setShowCreateModal(true)}
                            >
                                Create Enterprise
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Create Enterprise Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Enterprise</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {createError && <Alert variant="danger">{createError}</Alert>}
                    <Form onSubmit={handleCreateEnterprise}>
                        <Form.Group className="mb-3">
                            <Form.Label>Enterprise Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={enterpriseForm.name}
                                onChange={(e) => setEnterpriseForm({
                                    ...enterpriseForm,
                                    name: e.target.value
                                })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Industry</Form.Label>
                            <Form.Control
                                type="text"
                                value={enterpriseForm.industry}
                                onChange={(e) => setEnterpriseForm({
                                    ...enterpriseForm,
                                    industry: e.target.value
                                })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={enterpriseForm.description}
                                onChange={(e) => setEnterpriseForm({
                                    ...enterpriseForm,
                                    description: e.target.value
                                })}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Create Enterprise
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default UnaffiliatedDashboard;