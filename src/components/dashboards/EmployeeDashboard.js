import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { UserCircle, Building2, Package } from 'lucide-react';

const EmployeeDashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [enterpriseInfo, setEnterpriseInfo] = useState(null);
    const [managerInfo, setManagerInfo] = useState(null);
    const [items, setItems] = useState([]);
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    userResponse,
                    enterpriseResponse,
                    managerResponse,
                    itemsResponse,
                    requestsResponse,
                ] = await Promise.all([
                    api.get('/api/users/me'),
                    api.get('/api/enterprises/current'),
                    api.get('/api/users/manager'),
                    api.get('/api/items/my-items'),
                    api.get('/api/items/my-requests'),
                ]);

                setUserInfo(userResponse.data);
                setEnterpriseInfo(enterpriseResponse.data);
                setManagerInfo(managerResponse.data);
                setItems(itemsResponse.data);
                setRequests(requestsResponse.data);
            } catch (err) {
                setError(err.message || 'Failed to fetch data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading...</p>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Welcome Banner */}
            <Card className="mb-4 bg-primary text-white border-0 shadow">
                <Card.Body className="py-4">
                    <Row className="align-items-center">
                        <Col md={8}>
                            <div className="d-flex align-items-center mb-3">
                                <UserCircle size={48} className="me-3" />
                                <div>
                                    <h2 className="mb-0">Hello, {userInfo?.fullName}!</h2>
                                    <p className="opacity-75 mt-1 mb-0">{userInfo?.email}</p>
                                </div>
                            </div>
                            <Badge bg="light" text="dark" className="px-3 py-2">
                                Employee
                            </Badge>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Sections */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header>
                            <div className="d-flex align-items-center">
                                <Building2 size={24} className="text-primary me-2" />
                                <h5 className="mb-0">Enterprise Information</h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <p>Name: {enterpriseInfo?.name}</p>
                            {/* Add more details if available */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header>
                            <div className="d-flex align-items-center">
                                <UserCircle size={24} className="text-primary me-2" />
                                <h5 className="mb-0">Manager Information</h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <p>Name: {managerInfo?.username}</p>
                            <p>Email: {managerInfo?.email}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Items Table */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header>
                    <div className="d-flex align-items-center">
                        <Package size={24} className="text-primary me-2" />
                        <h5 className="mb-0">Items in Use</h5>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Table hover responsive>
                        <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Status</th>
                            <th>Assigned Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>
                                    <Badge bg="info">{item.status}</Badge>
                                </td>
                                <td>{item.assignedDate}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Requests Table */}
            <Card className="border-0 shadow-sm">
                <Card.Header>
                    <h5 className="mb-0">Item Requests</h5>
                </Card.Header>
                <Card.Body>
                    <Table hover responsive>
                        <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Request Date</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requests.map((request) => (
                            <tr key={request.id}>
                                <td>{request.itemName}</td>
                                <td>{request.requestDate}</td>
                                <td>
                                    <Badge bg="warning">{request.status}</Badge>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EmployeeDashboard;
