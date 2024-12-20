import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Modal, Table, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
    Package, 
    Warehouse, 
    Building2, 
    User,
    ClipboardList,
    Plus,
    CheckCircle,
    XCircle,
    UserCircle,
    Mail,
    Box,
    MapPin
} from 'lucide-react';

const WarehouseOperatorDashboard = () => {
    const { userInfo } = useAuth();
    const [warehouse, setWarehouse] = useState(null);
    const [enterprise, setEnterprise] = useState(null);
    const [items, setItems] = useState([]);
    const [requests, setRequests] = useState([]);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Form state for adding new item
    const [itemForm, setItemForm] = useState({
        name: '',
        description: '',
        quantity: 0
    });

    useEffect(() => {
        fetchData();
    }, [userInfo]);

    const fetchData = async () => {
        try {
            // Fetch warehouse information
            const warehouseResponse = await api.get('/api/warehouses/operator');
            setWarehouse(warehouseResponse.data);

            // Fetch enterprise information
            const enterpriseResponse = await api.get(`/api/enterprises/${warehouseResponse.data.enterpriseId}`);
            setEnterprise(enterpriseResponse.data);

            // Fetch warehouse items
            const itemsResponse = await api.get(`/api/warehouses/${warehouseResponse.data.id}/items`);
            setItems(itemsResponse.data);

            // Fetch pending requests
            const requestsResponse = await api.get(`/api/warehouses/${warehouseResponse.data.id}/requests?status=PENDING`);
            setRequests(requestsResponse.data);
        } catch (error) {
            setError('Failed to fetch data');
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post(`/api/warehouses/${warehouse.id}/items`, itemForm);
            setShowAddItemModal(false);
            setItemForm({ name: '', description: '', quantity: 0 });
            setSuccess('Item added successfully');
            await fetchData();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add item');
        }
    };

    const handleRequest = async (requestId, approved) => {
        try {
            await api.post(`/api/requests/${requestId}/process`, null, {
                params: {
                    approved,
                    responseComments: approved ? 'Request approved' : 'Request rejected'
                }
            });
            setSuccess(`Request ${approved ? 'approved' : 'rejected'} successfully`);
            await fetchData();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to process request');
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
        <Container fluid className="py-4">
            {error && <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess('')} className="mb-4">{success}</Alert>}

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
                                Warehouse Operator
                            </Badge>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Overview Cards */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <Box size={24} className="text-primary me-3" />
                                <div>
                                    <h6 className="mb-1">Total Items</h6>
                                    <h3 className="mb-0">{items.reduce((acc, item) => acc + item.quantity, 0)}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <Package size={24} className="text-primary me-3" />
                                <div>
                                    <h6 className="mb-1">Item Types</h6>
                                    <h3 className="mb-0">{items.length}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <ClipboardList size={24} className="text-primary me-3" />
                                <div>
                                    <h6 className="mb-1">Pending Requests</h6>
                                    <h3 className="mb-0">{requests.length}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Warehouse Information */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex align-items-center">
                        <Building2 size={24} className="text-primary me-2" />
                        <h4 className="mb-0">Warehouse Information</h4>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p className="mb-2"><strong>Warehouse Name:</strong> {warehouse?.name}</p>
                            <p className="mb-2"><strong>Enterprise:</strong> {enterprise?.name}</p>
                        </Col>
                        <Col md={6}>
                            <p className="mb-2 d-flex align-items-center">
                                <MapPin size={16} className="text-primary me-2" />
                                <strong>Location:</strong> {warehouse?.location}
                            </p>
                            <p className="mb-2"><strong>Total Items:</strong> {items.reduce((acc, item) => acc + item.quantity, 0)}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Warehouse Items */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Package size={24} className="text-primary me-2" />
                            <h4 className="mb-0">Warehouse Items</h4>
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setShowAddItemModal(true)}
                        >
                            <Plus size={18} className="me-1" />
                            Add Item
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {items.length === 0 ? (
                        <div className="text-center py-4">
                            <Package size={48} className="text-muted mb-3" />
                            <h5 className="text-muted">No Items in Warehouse</h5>
                            <p className="text-muted mb-0">
                                Start adding items to your warehouse using the "Add Item" button above.
                            </p>
                        </div>
                    ) : (
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Quantity</th>
                                    <th>Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Pending Requests */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex align-items-center">
                        <ClipboardList size={24} className="text-primary me-2" />
                        <h4 className="mb-0">Pending Requests</h4>
                    </div>
                </Card.Header>
                <Card.Body>
                    {requests.length === 0 ? (
                        <div className="text-center py-4">
                            <ClipboardList size={48} className="text-muted mb-3" />
                            <h5 className="text-muted">No Pending Requests</h5>
                            <p className="text-muted mb-0">All item requests have been processed.</p>
                        </div>
                    ) : (
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Requester</th>
                                    <th>Department</th>
                                    <th>Items</th>
                                    <th>Total Quantity</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(request => (
                                    <tr key={request.id}>
                                        <td>{request.requesterName}</td>
                                        <td>{request.departmentName}</td>
                                        <td>
                                            {request.requestItems?.map(item => (
                                                <div key={item.id} className="mb-1">
                                                    {item.itemName} (Qty: {item.quantity})
                                                </div>
                                            )) || 'No items'}
                                        </td>
                                        <td>
                                            {request.requestItems?.reduce((total, item) => total + item.quantity, 0) || 0}
                                        </td>
                                        <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                                        <td>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleRequest(request.id, true)}
                                            >
                                                <CheckCircle size={16} className="me-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleRequest(request.id, false)}
                                            >
                                                <XCircle size={16} className="me-1" />
                                                Reject
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Add Item Modal */}
            <Modal show={showAddItemModal} onHide={() => setShowAddItemModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddItem}>
                        <Form.Group className="mb-3">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter item name"
                                value={itemForm.name}
                                onChange={(e) => setItemForm({
                                    ...itemForm,
                                    name: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter item description"
                                value={itemForm.description}
                                onChange={(e) => setItemForm({
                                    ...itemForm,
                                    description: e.target.value
                                })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter quantity"
                                value={itemForm.quantity}
                                onChange={(e) => setItemForm({
                                    ...itemForm,
                                    quantity: parseInt(e.target.value) || 0
                                })}
                                required
                                min="0"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowAddItemModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Add Item
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default WarehouseOperatorDashboard; 