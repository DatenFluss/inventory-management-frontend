import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Container, Row, Col, Card, Table, Badge, ProgressBar } from 'react-bootstrap';
import {
    UserCircle,
    Building2,
    Mail,
    Users,
    Briefcase,
    Package,
    User,
    LayoutGrid,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const OwnerDashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [enterpriseInfo, setEnterpriseInfo] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    userResponse,
                    enterpriseResponse,
                    employeesResponse,
                    //departmentsResponse
                ] = await Promise.all([
                    api.get('/api/users/me'),
                    api.get('/api/enterprises/current'),
                    api.get('/api/enterprises/employees'),
                    //api.get('/api/enterprises/departments')
                ]);

                setUserInfo(userResponse.data);
                setEnterpriseInfo(enterpriseResponse.data);
                setEmployees(employeesResponse.data);
                //setDepartments(departmentsResponse.data);
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
                <Col md={4}>
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
                <Col md={4}>
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
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <Package size={24} className="text-primary me-3" />
                                <div>
                                    <h6 className="mb-1">Total Items</h6>
                                    <h3 className="mb-0">{departments.reduce((acc, dept) => acc + dept.itemCount, 0)}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Departments Section */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex align-items-center">
                        <Briefcase size={24} className="text-primary me-2" />
                        <h4 className="mb-0">Departments</h4>
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
                    <div className="d-flex align-items-center">
                        <Users size={24} className="text-primary me-2" />
                        <h4 className="mb-0">Employees</h4>
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
        </Container>
    );
};

export default OwnerDashboard;