import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Container, Row, Col, Card, Table, Badge, ProgressBar, Modal, Form, Button, Alert } from 'react-bootstrap';
import {
    UserCircle,
    Building2,
    Mail,
    Users,
    Briefcase,
    Package,
    User,
    LayoutGrid,
    Warehouse,
    Box
} from 'lucide-react';

const OwnerDashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [enterpriseInfo, setEnterpriseInfo] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showDepartmentModal, setShowDepartmentModal] = useState(false);
    const [showWarehouseModal, setShowWarehouseModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);

    // Form states
    const [departmentForm, setDepartmentForm] = useState({
        name: '',
        description: ''
    });

    const [warehouseForm, setWarehouseForm] = useState({
        name: '',
        description: '',
        location: ''
    });

    const [inviteForm, setInviteForm] = useState({
        email: '',
        role: 'EMPLOYEE'
    });

    // Error states
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle form submissions
    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/api/enterprises/departments', departmentForm);
            setShowDepartmentModal(false);
            setDepartmentForm({ name: '', description: '' });
            // Refresh departments list
            const response = await api.get('/api/enterprises/departments');
            setDepartments(response.data);
            setSuccess('Department created successfully');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create department');
        }
    };

    const handleCreateWarehouse = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/api/warehouses', warehouseForm);
            setShowWarehouseModal(false);
            setWarehouseForm({ name: '', description: '', location: '' });
            // Refresh warehouses list
            const response = await api.get('/api/warehouses');
            setWarehouses(response.data);
            setSuccess('Warehouse created successfully');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create warehouse');
        }
    };

    const handleSendInvite = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/api/enterprises/invites', inviteForm);
            setShowInviteModal(false);
            setInviteForm({ email: '', role: 'EMPLOYEE' });
            setSuccess('Invitation sent successfully');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send invite');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    userResponse,
                    enterpriseResponse,
                    employeesResponse,
                    departmentsResponse,
                    warehousesResponse
                ] = await Promise.all([
                    api.get('/api/users/me'),
                    api.get('/api/enterprises/current'),
                    api.get('/api/enterprises/employees'),
                    api.get('/api/enterprises/departments'),
                    api.get('/api/warehouses')
                ]);

                setUserInfo(userResponse.data);
                setEnterpriseInfo(enterpriseResponse.data);
                setEmployees(employeesResponse.data);
                setDepartments(departmentsResponse.data);
                setWarehouses(warehousesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusBadge = (status) => {
        const variants = {
            ACTIVE: 'success',
            INACTIVE: 'danger',
            PENDING: 'warning'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
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
                                Enterprise Owner
                            </Badge>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Enterprise Overview Cards */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <Users size={24} className="text-primary me-3" />
                                <div>
                                    <h6 className="mb-1">Total Employees</h6>
                                    <h3 className="mb-0">{enterpriseInfo?.totalEmployees || 0}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <LayoutGrid size={24} className="text-primary me-3" />
                                <div>
                                    <h6 className="mb-1">Departments</h6>
                                    <h3 className="mb-0">{departments.length}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <Warehouse size={24} className="text-primary me-3" />
                                <div>
                                    <h6 className="mb-1">Warehouses</h6>
                                    <h3 className="mb-0">{warehouses.length}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <Box size={24} className="text-primary me-3" />
                                <div>
                                    <h6 className="mb-1">Total Items</h6>
                                    <h3 className="mb-0">{departments.reduce((acc, dept) => acc + dept.itemCount, 0)}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Warehouses Section */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Warehouse size={24} className="text-primary me-2" />
                            <h4 className="mb-0">Warehouses</h4>
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setShowWarehouseModal(true)}
                        >
                            Add Warehouse
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Row>
                        {warehouses.map(warehouse => (
                            <Col md={4} key={warehouse.id} className="mb-3">
                                <Card className="h-100 border">
                                    <Card.Body>
                                        <h5 className="d-flex align-items-center">
                                            <Warehouse size={20} className="text-primary me-2" />
                                            {warehouse.name}
                                        </h5>
                                        <div className="text-muted mb-3">
                                            <p className="mb-1 d-flex align-items-center">
                                                <User size={16} className="me-2" />
                                                Manager: {warehouse.managerName || 'Not Assigned'}
                                            </p>
                                            <p className="mb-1">Location: {warehouse.location}</p>
                                            <p className="mb-0">Items: {warehouse.itemCount}</p>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>

            {/* Departments Section */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Briefcase size={24} className="text-primary me-2" />
                            <h4 className="mb-0">Departments</h4>
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setShowDepartmentModal(true)}
                        >
                            Add Department
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Row>
                        {departments.map(dept => (
                            <Col md={4} key={dept.id} className="mb-3">
                                <Card className="h-100 border">
                                    <Card.Body>
                                        <h5 className="d-flex align-items-center">
                                            <Building2 size={20} className="text-primary me-2" />
                                            {dept.name}
                                        </h5>
                                        <div className="text-muted mb-3">
                                            <p className="mb-1 d-flex align-items-center">
                                                <User size={16} className="me-2" />
                                                Manager: {dept.managerName}
                                            </p>
                                            <p className="mb-1">Employees: {dept.employeeCount}</p>
                                            <p className="mb-0">Items: {dept.itemCount}</p>
                                        </div>
                                        <ProgressBar
                                            now={(dept.employeeCount / enterpriseInfo?.totalEmployees) * 100}
                                            variant="primary"
                                        />
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>

            {/* Employees Table */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Users size={24} className="text-primary me-2" />
                            <h4 className="mb-0">Employees</h4>
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setShowInviteModal(true)}
                        >
                            Invite Employee
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table hover className="align-middle">
                            <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Department</th>
                                <th>Role</th>
                                <th>Items</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {employees.map(employee => (
                                <tr key={employee.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <UserCircle size={32} className="text-primary me-2" />
                                            <div>
                                                <p className="mb-0 fw-medium">{employee.username}</p>
                                                <small className="text-muted">{employee.email}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{employee.department}</td>
                                    <td>{employee.role}</td>
                                    <td>{employee.itemsCount}</td>
                                    <td>{getStatusBadge(employee.status)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Modals */}
            {/* Department Modal */}
            <Modal show={showDepartmentModal} onHide={() => setShowDepartmentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Department</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleCreateDepartment}>
                        <Form.Group className="mb-3">
                            <Form.Label>Department Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter department name"
                                value={departmentForm.name}
                                onChange={(e) => setDepartmentForm({
                                    ...departmentForm,
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
                                placeholder="Enter department description"
                                value={departmentForm.description}
                                onChange={(e) => setDepartmentForm({
                                    ...departmentForm,
                                    description: e.target.value
                                })}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowDepartmentModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Create Department
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Warehouse Modal */}
            <Modal show={showWarehouseModal} onHide={() => setShowWarehouseModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Warehouse</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleCreateWarehouse}>
                        <Form.Group className="mb-3">
                            <Form.Label>Warehouse Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter warehouse name"
                                value={warehouseForm.name}
                                onChange={(e) => setWarehouseForm({
                                    ...warehouseForm,
                                    name: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter warehouse location"
                                value={warehouseForm.location}
                                onChange={(e) => setWarehouseForm({
                                    ...warehouseForm,
                                    location: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter warehouse description"
                                value={warehouseForm.description}
                                onChange={(e) => setWarehouseForm({
                                    ...warehouseForm,
                                    description: e.target.value
                                })}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowWarehouseModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Create Warehouse
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Invite Modal */}
            <Modal show={showInviteModal} onHide={() => setShowInviteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Invite Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSendInvite}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter employee email"
                                value={inviteForm.email}
                                onChange={(e) => setInviteForm({
                                    ...inviteForm,
                                    email: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={inviteForm.role}
                                onChange={(e) => setInviteForm({
                                    ...inviteForm,
                                    role: e.target.value
                                })}
                            >
                                <option value="EMPLOYEE">Employee</option>
                                <option value="MANAGER">Manager</option>
                                <option value="WAREHOUSE_OPERATOR">Warehouse Operator</option>
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
        </Container>
    );
};

export default OwnerDashboard;