import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Alert, Modal, Form } from 'react-bootstrap';
import api from '../../services/api';
import {
    UserCircle,
    Building2,
    Mail,
    User,
    Users,
    Package,
    ClipboardList,
    CheckCircle,
    XCircle,
    Box,
    UserPlus,
    Clock,
    Plus
} from 'lucide-react';

const ManagerDashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [enterpriseInfo, setEnterpriseInfo] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [subordinates, setSubordinates] = useState([]);
    const [sentInvites, setSentInvites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showRequestItemsModal, setShowRequestItemsModal] = useState(false);
    const [showWarehouseSelectionModal, setShowWarehouseSelectionModal] = useState(false);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [departmentId, setDepartmentId] = useState(null);
    const [departmentItems, setDepartmentItems] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [warehouseItems, setWarehouseItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showReturnItemsModal, setShowReturnItemsModal] = useState(false);
    const [itemsToReturn, setItemsToReturn] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [userResponse, departmentResponse] = await Promise.all([
                api.get('/api/users/me'),
                api.get('/api/departments/my')
            ]);

            setUserInfo(userResponse.data);
            setEnterpriseInfo(departmentResponse.data);
            
            // Set department ID from department response
            const deptId = departmentResponse.data?.userDepartment?.id;
            setDepartmentId(deptId);

            // Only fetch invites, team members, requests, and department items if we have a department ID
            if (deptId) {
                const [invitesResponse, employeesResponse, requestsResponse, departmentItemsResponse] = await Promise.all([
                    api.get(`/api/department-invites/department/${deptId}/pending`),
                    api.get(`/api/departments/${deptId}/employees`),
                    api.get(`/api/employee-requests/department/${deptId}`),
                    api.get(`/api/inventory/department/${deptId}/items`)
                ]);
                setSentInvites(invitesResponse.data || []);
                setSubordinates(employeesResponse.data || []);
                setPendingRequests(requestsResponse.data || []);
                setDepartmentItems(departmentItemsResponse.data?.items || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestAction = async (requestId, approved) => {
        try {
            await api.post(`/api/employee-requests/${requestId}/process`, null, {
                params: { approved }
            });
            setSuccess(`Request ${approved ? 'approved' : 'rejected'} successfully`);
            // Refresh pending requests
            if (departmentId) {
                const response = await api.get(`/api/employee-requests/department/${departmentId}`);
                setPendingRequests(response.data || []);
            }
        } catch (error) {
            setError(`Error ${approved ? 'approving' : 'rejecting'} request`);
            console.error(`Error processing request:`, error);
        }
    };

    const fetchAvailableEmployees = async () => {
        try {
            const response = await api.get('/api/departments/available-employees');
            setAvailableEmployees(response.data);
        } catch (error) {
            setError('Failed to fetch available employees');
            console.error('Error fetching available employees:', error);
        }
    };

    const handleShowInviteModal = async () => {
        await fetchAvailableEmployees();
        setShowInviteModal(true);
    };

    const handleInviteEmployee = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/api/department-invites/department/${departmentId}/invite/${selectedEmployee}`);
            setShowInviteModal(false);
            setSelectedEmployee('');
            setSuccess('Invite sent successfully');
            fetchData();
        } catch (error) {
            setError('Failed to send invite');
            console.error('Error sending invite:', error);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await api.get(`/api/enterprises/${userInfo.enterpriseId}/warehouses`);
            setWarehouses(response.data);
        } catch (error) {
            setError('Failed to fetch warehouses');
            console.error('Error fetching warehouses:', error);
        }
    };

    const fetchWarehouseItems = async (warehouseId) => {
        try {
            const response = await api.get(`/api/warehouses/${warehouseId}/items`);
            setWarehouseItems(response.data);
        } catch (error) {
            setError('Failed to fetch warehouse items');
            console.error('Error fetching warehouse items:', error);
        }
    };

    const handleWarehouseSelect = async (warehouseId) => {
        const warehouse = warehouses.find(w => w.id === parseInt(warehouseId));
        setSelectedWarehouse(warehouse);
        await fetchWarehouseItems(warehouseId);
        setShowWarehouseSelectionModal(false);
        setShowRequestItemsModal(true);
    };

    const handleRequestItems = async (e) => {
        e.preventDefault();
        try {
            // Filter out items with zero or undefined quantity
            const validItems = selectedItems.filter(item => item.requestQuantity && item.requestQuantity > 0);
            
            if (validItems.length === 0) {
                setError('Please select at least one item with a valid quantity');
                return;
            }

            const requestData = {
                warehouseId: selectedWarehouse.id,
                departmentId: departmentId,
                requestItems: validItems.map(item => ({
                    itemId: item.id,
                    quantity: parseInt(item.requestQuantity)
                }))
            };

            await api.post('/api/requests', requestData);
            setSuccess('Items requested successfully');
            setShowRequestItemsModal(false);
            setSelectedWarehouse(null);
            setSelectedItems([]);
            
            // Fetch updated data including requests and department items
            await fetchData();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to request items');
            console.error('Error requesting items:', error);
        }
    };

    const handleItemQuantityChange = (itemId, quantity) => {
        setSelectedItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === itemId);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === itemId
                        ? { ...item, requestQuantity: parseInt(quantity) || 0 }
                        : item
                );
            }
            const item = warehouseItems.find(item => item.id === itemId);
            return [...prevItems, { ...item, requestQuantity: parseInt(quantity) || 0 }];
        });
    };

    const handleReturnItems = async (e) => {
        e.preventDefault();
        try {
            const validItems = itemsToReturn.filter(item => item.returnQuantity && item.returnQuantity > 0);
            
            if (validItems.length === 0) {
                setError('Please select at least one item with a valid quantity');
                return;
            }

            // Find the original department items to get their warehouse IDs
            const returnData = validItems.map(item => {
                const originalItem = departmentItems.find(deptItem => deptItem.id === item.id);
                if (!originalItem || !originalItem.warehouseId) {
                    throw new Error(`Cannot return item ${item.name} - missing warehouse information`);
                }
                return {
                    itemId: item.id,
                    quantity: parseInt(item.returnQuantity),
                    warehouseId: originalItem.warehouseId
                };
            });

            await api.post(`/api/inventory/department/${departmentId}/return-items`, returnData);
            setSuccess('Items returned successfully');
            setShowReturnItemsModal(false);
            setItemsToReturn([]);
            
            // Refresh data
            await fetchData();
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Failed to return items');
            console.error('Error returning items:', error);
        }
    };

    const handleReturnQuantityChange = (itemId, quantity) => {
        setItemsToReturn(prevItems => {
            const existingItem = prevItems.find(item => item.id === itemId);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === itemId
                        ? { ...item, returnQuantity: parseInt(quantity) || 0 }
                        : item
                );
            }
            const item = departmentItems.find(item => item.id === itemId);
            return [...prevItems, { ...item, returnQuantity: parseInt(quantity) || 0 }];
        });
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
            {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')} className="mb-4">
                    {success}
                </Alert>
            )}
            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
                    {error}
                </Alert>
            )}

            {/* Welcome Banner */}
            <Card className="mb-4 bg-primary text-white border-0 shadow">
                <Card.Body className="py-4">
                    <Row className="align-items-center">
                        <Col md={8}>
                            <div className="d-flex align-items-center mb-3">
                                <UserCircle size={48} className="me-3" />
                                <div>
                                    <h2 className="mb-0">Hello, {userInfo?.fullName || 'Manager'}!</h2>
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
                                Department Manager
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
                                <Users size={24} className="text-primary me-3" />
                                <div>
                                    <h6 className="mb-1">Team Members</h6>
                                    <h3 className="mb-0">{subordinates.length}</h3>
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
                                    <h3 className="mb-0">{pendingRequests.filter(request => request.status === 'PENDING').length}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <Box size={24} className="text-primary me-3" />
                                <div>
                                    <h6 className="mb-1">Department Items</h6>
                                    <h3 className="mb-0">{enterpriseInfo?.userDepartment?.itemCount || 0}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Department Information */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex align-items-center">
                        <Building2 size={24} className="text-primary me-2" />
                        <h4 className="mb-0">Department Information</h4>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p className="mb-2"><strong>Department Name:</strong> {enterpriseInfo?.userDepartment?.name}</p>
                            <p className="mb-2"><strong>Enterprise:</strong> {enterpriseInfo?.name}</p>
                        </Col>
                        <Col md={6}>
                            <p className="mb-2"><strong>Employee Count:</strong> {enterpriseInfo?.userDepartment?.employeeCount}</p>
                            <p className="mb-2"><strong>Item Count:</strong> {enterpriseInfo?.userDepartment?.itemCount}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Team Members */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Users size={24} className="text-primary me-2" />
                            <h4 className="mb-0">Team Members</h4>
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleShowInviteModal}
                            className="d-flex align-items-center gap-2"
                        >
                            <UserPlus size={16} />
                            Invite Employee
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {subordinates.length === 0 && sentInvites.length === 0 ? (
                        <div className="text-center py-4">
                            <Users size={48} className="text-muted mb-3" />
                            <h5 className="text-muted">No Team Members Yet</h5>
                            <p className="text-muted mb-0">
                                Team members will appear here once they are assigned to your department.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Current Team Members */}
                            {subordinates.length > 0 && (
                                <div className="mb-4">
                                    <h5 className="mb-3">Current Members</h5>
                                    <Row>
                                        {subordinates.map(employee => (
                                            <Col md={4} key={employee.id} className="mb-3">
                                                <Card className="h-100 border">
                                                    <Card.Body>
                                                        <div className="d-flex align-items-center mb-3">
                                                            <UserCircle size={32} className="text-primary me-2" />
                                                            <div>
                                                                <h6 className="mb-0">{employee.fullName}</h6>
                                                                <small className="text-muted">{employee.email}</small>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center text-muted mb-2">
                                                            <Package size={16} className="me-2" />
                                                            Items in use: {employee.itemsInUse || 0}
                                                        </div>
                                                        <div className="d-flex align-items-center text-muted mb-2">
                                                            <User size={16} className="me-2" />
                                                            Role: {employee.roleName.replace('ROLE_', '')}
                                                        </div>
                                                        <div className="d-flex align-items-center text-muted">
                                                            <Clock size={16} className="me-2" />
                                                            Member since: {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}

                            {/* Sent Invites */}
                            {sentInvites.length > 0 && (
                                <div>
                                    <h5 className="mb-3">Pending Invites</h5>
                                    <Row>
                                        {sentInvites.map(invite => (
                                            <Col md={4} key={invite.id} className="mb-3">
                                                <Card className="h-100 border">
                                                    <Card.Body>
                                                        <div className="d-flex align-items-center mb-3">
                                                            <UserCircle size={32} className="text-warning me-2" />
                                                            <div>
                                                                <h6 className="mb-0">{invite.userName}</h6>
                                                                <small className="text-muted">{invite.userEmail}</small>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center text-muted mb-2">
                                                            <Clock size={16} className="me-2" />
                                                            Sent: {new Date(invite.createdAt).toLocaleDateString()}
                                                        </div>
                                                        <Badge bg="warning">Pending Response</Badge>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* Invite Employee Modal */}
            <Modal show={showInviteModal} onHide={() => setShowInviteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Invite Employee to Department</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleInviteEmployee}>
                        <Form.Group className="mb-3">
                            <Form.Label>Select Employee</Form.Label>
                            <Form.Select
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                required
                            >
                                <option value="">Choose an employee...</option>
                                {availableEmployees.map(employee => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.fullName} ({employee.email})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowInviteModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Send Invite
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Pending Requests */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex align-items-center">
                        <Package size={24} className="text-primary me-2" />
                        <h4 className="mb-0">Employee Item Requests</h4>
                    </div>
                </Card.Header>
                <Card.Body>
                    {pendingRequests.length === 0 ? (
                        <div className="text-center py-4">
                            <Package size={48} className="text-muted mb-3" />
                            <h5 className="text-muted">No Employee Requests</h5>
                            <p className="text-muted mb-0">There are no item requests from employees yet.</p>
                        </div>
                    ) : (
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Requester</th>
                                    <th>Items</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingRequests.map(request => (
                                    <tr key={request.id}>
                                        <td>{request.requesterName}</td>
                                        <td>
                                            {request.requestItems?.map(item => (
                                                <div key={item.id} className="mb-1">
                                                    {item.itemName} - Qty: {item.quantity}
                                                    {item.comments && <small className="text-muted d-block">Note: {item.comments}</small>}
                                                </div>
                                            )) || 'No items'}
                                        </td>
                                        <td>
                                            <Badge bg={
                                                request.status === 'PENDING' ? 'warning' :
                                                request.status === 'APPROVED' ? 'success' :
                                                'danger'
                                            }>
                                                {request.status}
                                            </Badge>
                                        </td>
                                        <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                                        <td>
                                            {request.status === 'PENDING' && (
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => handleRequestAction(request.id, true)}
                                                    >
                                                        <CheckCircle size={16} className="me-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleRequestAction(request.id, false)}
                                                    >
                                                        <XCircle size={16} className="me-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Department Stock Items */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Package size={24} className="text-primary me-2" />
                            <h4 className="mb-0">Department Stock Items</h4>
                        </div>
                        <div className="d-flex gap-2">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                    fetchWarehouses();
                                    setShowWarehouseSelectionModal(true);
                                }}
                            >
                                <Plus size={18} className="me-1" />
                                Request Items
                            </Button>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                    setItemsToReturn([]);
                                    setShowReturnItemsModal(true);
                                }}
                            >
                                Return Items
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    {departmentItems.length === 0 ? (
                        <div className="text-center py-4">
                            <Package size={48} className="text-muted mb-3" />
                            <h5 className="text-muted">No Items in Stock</h5>
                            <p className="text-muted mb-0">
                                Start by requesting items from warehouses using the "Request Items" button above.
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
                                {departmentItems.map(item => (
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

            {/* Warehouse Selection Modal */}
            <Modal show={showWarehouseSelectionModal} onHide={() => setShowWarehouseSelectionModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Warehouse</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Choose Warehouse</Form.Label>
                            <Form.Select
                                onChange={(e) => handleWarehouseSelect(e.target.value)}
                                required
                            >
                                <option value="">Select a warehouse...</option>
                                {warehouses.map(warehouse => (
                                    <option key={warehouse.id} value={warehouse.id}>
                                        {warehouse.name} - {warehouse.location}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Request Items Modal */}
            <Modal show={showRequestItemsModal} onHide={() => setShowRequestItemsModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Request Items from {selectedWarehouse?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleRequestItems}>
                        <div className="table-responsive">
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Available Quantity</th>
                                        <th>Request Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {warehouseItems.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    max={item.quantity}
                                                    onChange={(e) => handleItemQuantityChange(item.id, e.target.value)}
                                                    value={selectedItems.find(i => i.id === item.id)?.requestQuantity || ''}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <Button variant="secondary" onClick={() => setShowRequestItemsModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={selectedItems.length === 0 || selectedItems.every(item => !item.requestQuantity)}
                            >
                                Submit Request
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Return Items Modal */}
            <Modal show={showReturnItemsModal} onHide={() => setShowReturnItemsModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Return Items to Warehouse</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleReturnItems}>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Available Quantity</th>
                                    <th>Return Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departmentItems.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                max={item.quantity}
                                                onChange={(e) => handleReturnQuantityChange(item.id, e.target.value)}
                                                value={itemsToReturn.find(i => i.id === item.id)?.returnQuantity || ''}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <Button variant="secondary" onClick={() => setShowReturnItemsModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Return Items
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ManagerDashboard;