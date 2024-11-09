import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import {
    Building2,
    Mail,
    User,
    UserCircle,
    Calendar,
    BriefcaseIcon,
    PlusCircle,
    Bell
} from 'lucide-react';

const UnaffiliatedDashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [invites, setInvites] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createError, setCreateError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [enterpriseForm, setEnterpriseForm] = useState({
        name: '',
        description: '',
        industry: ''
    });

    useEffect(() => {
        Promise.all([fetchUserInfo(), fetchInvites()])
            .finally(() => setIsLoading(false));
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
            setEnterpriseForm({ name: '', description: '', industry: '' });
            fetchUserInfo();
        } catch (error) {
            setCreateError(error.response?.data?.message || 'Failed to create enterprise');
        }
    };

    const handleInviteResponse = async (inviteId, accept) => {
        try {
            await api.post(`/api/enterprises/invites/${inviteId}/${accept ? 'accept' : 'decline'}`);
            await fetchInvites();
            if (accept) {
                await fetchUserInfo();
            }
        } catch (error) {
            console.error('Error handling invite:', error);
        }
    };

    if (isLoading) {
        return (
            <Container className="py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            {/* Welcome Banner */}
            <Card className="mb-4 bg-primary text-white border-0 shadow">
                <Card.Body className="py-4">
                    <Row className="align-items-center">
                        <Col md={8}>
                            <div className="d-flex align-items-center mb-3">
                                <UserCircle size={48} className="me-3" />
                                <div>
                                    <h2 className="mb-0">Hello, {userInfo?.fullName}!</h2>
                                    <div className="opacity-75 mt-1">
                                        <p className="mb-1 d-flex align-items-center">
                                            <User size={16} className="me-2" />
                                            {userInfo?.username}
                                        </p>
                                        <p className="mb-0 d-flex align-items-center">
                                            <Mail size={16} className="me-2" />
                                            {userInfo?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Badge bg="light" text="dark" className="px-3 py-2">
                                Unaffiliated User
                            </Badge>
                        </Col>
                        <Col md={4} className="text-md-end mt-3 mt-md-0">
                            <Button
                                variant="light"
                                size="lg"
                                onClick={() => setShowCreateModal(true)}
                                className="d-flex align-items-center gap-2 ms-auto"
                            >
                                <PlusCircle size={20} />
                                Create Enterprise
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Row>
                {/* Invitations Section */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white border-bottom">
                            <div className="d-flex align-items-center">
                                <Bell size={24} className="text-primary me-2" />
                                <h4 className="mb-0">Enterprise Invitations</h4>
                                {invites.length > 0 && (
                                    <Badge bg="primary" className="ms-2">{invites.length}</Badge>
                                )}
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {invites.length === 0 ? (
                                <div className="text-center py-5">
                                    <Mail size={48} className="text-muted mb-3" />
                                    <h5 className="text-muted">No Pending Invitations</h5>
                                    <p className="text-muted mb-0">
                                        You'll see enterprise invitations here when you receive them.
                                    </p>
                                </div>
                            ) : (
                                invites.map(invite => (
                                    <Card key={invite.id} className="mb-3 border">
                                        <Card.Body>
                                            <Row className="align-items-center">
                                                <Col md={8}>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <Building2 size={24} className="text-primary me-2" />
                                                        <h5 className="mb-0">{invite.enterpriseName}</h5>
                                                    </div>
                                                    <div className="text-muted mb-2">
                                                        <BriefcaseIcon size={16} className="me-2" />
                                                        Role: {invite.role}
                                                    </div>
                                                    <div className="text-muted mb-2">
                                                        <UserCircle size={16} className="me-2" />
                                                        Invited by: {invite.inviterName}
                                                    </div>
                                                    <div className="text-muted">
                                                        <Calendar size={16} className="me-2" />
                                                        Sent: {new Date(invite.createdAt).toLocaleDateString()}
                                                    </div>
                                                </Col>
                                                <Col md={4} className="text-md-end mt-3 mt-md-0">
                                                    <Button
                                                        variant="success"
                                                        className="me-2"
                                                        onClick={() => handleInviteResponse(invite.id, true)}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        onClick={() => handleInviteResponse(invite.id, false)}
                                                    >
                                                        Decline
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                ))
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Quick Actions Section */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom">
                            <h4 className="mb-0">Quick Actions</h4>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-grid gap-3">
                                <Button
                                    variant="outline-primary"
                                    className="d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => setShowCreateModal(true)}
                                >
                                    <Building2 size={20} />
                                    Create New Enterprise
                                </Button>
                                {/* Add more quick actions here if needed */}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Create Enterprise Modal */}
            <Modal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                size="lg"
            >
                <Modal.Header closeButton className="border-bottom">
                    <Modal.Title>
                        <div className="d-flex align-items-center">
                            <Building2 size={24} className="text-primary me-2" />
                            Create New Enterprise
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {createError && <Alert variant="danger">{createError}</Alert>}
                    <Form onSubmit={handleCreateEnterprise}>
                        <Form.Group className="mb-3">
                            <Form.Label>Enterprise Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter enterprise name"
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
                                placeholder="Enter industry type"
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
                                placeholder="Describe your enterprise"
                                value={enterpriseForm.description}
                                onChange={(e) => setEnterpriseForm({
                                    ...enterpriseForm,
                                    description: e.target.value
                                })}
                                required
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="outline-secondary" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Create Enterprise
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default UnaffiliatedDashboard;