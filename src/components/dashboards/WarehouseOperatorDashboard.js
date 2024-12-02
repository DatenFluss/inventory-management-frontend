import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Modal, Table } from 'react-bootstrap';
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
    XCircle
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
            await api.post(`/api/requests/${requestId}/process`, {
                approved,
                responseComments: approved ? 'Request approved' : 'Request rejected'
            });
            setSuccess(`Request ${approved ? 'approved' : 'rejected'} successfully`);
            await fetchData();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to process request');
        }
    };

    return (
        <Container fluid className="py-4">
            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
            {success && <Alert variant="success" className="mb-4">{success}</Alert>}

            {/* User and Enterprise Info */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-3">
                                <User size={24} className="text-primary me-2" />
                                <h5 className="mb-0">Operator Information</h5>
                            </div>
                            <p className="mb-1"><strong>Name:</strong> {userInfo?.fullName}</p>
                            <p className="mb-1"><strong>Email:</strong> {userInfo?.email}</p>
                            <p className="mb-0"><strong>Role:</strong> Warehouse Operator</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-3">
                                <Building2 size={24} className="text-primary me-2" />
                                <h5 className="mb-0">Enterprise Information</h5>
                            </div>
                            <p className="mb-1"><strong>Name:</strong> {enterprise?.name}</p>
                            <p className="mb-0"><strong>Email:</strong> {enterprise?.contactEmail}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-3">
                                <Warehouse size={24} className="text-primary me-2" />
                                <h5 className="mb-0">Warehouse Information</h5>
                            </div>
                            <p className="mb-1"><strong>Name:</strong> {warehouse?.name}</p>
                            <p className="mb-1"><strong>Location:</strong> {warehouse?.location}</p>
                            <p className="mb-0"><strong>Items:</strong> {warehouse?.itemCount || 0}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Warehouse Items */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Package size={24} className="text-primary me-2" />
                            <h5 className="mb-0">Warehouse Items</h5>
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
                                    <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Pending Requests */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex align-items-center">
                        <ClipboardList size={24} className="text-primary me-2" />
                        <h5 className="mb-0">Pending Requests</h5>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Requester</th>
                                <th>Department</th>
                                <th>Items</th>
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
                                        {request.requestItems.map(item => (
                                            <div key={item.id}>
                                                {item.name} (Qty: {item.quantity})
                                            </div>
                                        ))}
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
                                min="0"
                                placeholder="Enter quantity"
                                value={itemForm.quantity}
                                onChange={(e) => setItemForm({
                                    ...itemForm,
                                    quantity: parseInt(e.target.value)
                                })}
                                required
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