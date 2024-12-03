import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Container, Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { UserCircle, Building2, Package, Mail, Clock, CheckCircle, XCircle, Inbox, ShoppingCart } from 'lucide-react';

const EmployeeDashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [enterpriseInfo, setEnterpriseInfo] = useState(null);
    const [managerInfo, setManagerInfo] = useState(null);
    const [itemsInUse, setItemsInUse] = useState([]);
    const [itemRequests, setItemRequests] = useState([]);
    const [pendingInvites, setPendingInvites] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // First get user info
            const userResponse = await api.get('/api/users/me');
            setUserInfo(userResponse.data);

            // Then fetch other data
            const [itemsResponse, requestsResponse, invitesResponse] = await Promise.all([
                api.get('/api/items/in-use'),
                api.get('/api/requests'),
                api.get('/api/department-invites/my')
            ]);

            setItemsInUse(itemsResponse.data.items || []);
            setItemRequests(requestsResponse.data.requests || []);
            setPendingInvites(invitesResponse.data || []);

            // If user has an enterpriseId, fetch enterprise info directly
            if (userResponse.data?.enterpriseId) {
                try {
                    const enterpriseResponse = await api.get('/api/enterprises/current');
                    setEnterpriseInfo(enterpriseResponse.data);
                } catch (error) {
                    console.error('Error fetching enterprise info:', error);
                }
            }

            // If user has a department, fetch department and manager info
            if (userResponse.data?.departmentId) {
                try {
                    const [departmentResponse, managerResponse, teamMembersResponse] = await Promise.all([
                        api.get(`/api/departments/${userResponse.data.departmentId}`),
                        api.get('/api/users/manager'),
                        api.get(`/api/departments/${userResponse.data.departmentId}/employees`)
                    ]);

                    setManagerInfo(managerResponse.data);
                    setTeamMembers(teamMembersResponse.data);
                } catch (error) {
                    console.error('Error fetching department/manager info:', error);
                }
            } else {
                setManagerInfo(null);
                setTeamMembers([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInviteResponse = async (inviteId, accept) => {
        try {
            const action = accept ? 'accept' : 'reject';
            await api.put(`/api/department-invites/${inviteId}/${action}`);
            
            setSuccess(`Successfully ${action}ed the invite`);
            
            // If accepted, refresh all data to update department info
            if (accept) {
                await fetchData();
            } else {
                // If rejected, just remove from pending invites
                setPendingInvites(pendingInvites.filter(invite => invite.id !== inviteId));
            }
        } catch (error) {
            console.error(`Error ${accept ? 'accepting' : 'rejecting'} invite:`, error);
            setError(`Failed to ${accept ? 'accept' : 'reject'} the invite. Please try again.`);
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

            {/* Enterprise & Department Info */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white border-bottom">
                            <div className="d-flex align-items-center">
                                <Building2 size={24} className="text-primary me-2" />
                                <h4 className="mb-0">Enterprise Info</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {enterpriseInfo ? (
                                <div>
                                    <h5>{enterpriseInfo.name}</h5>
                                    <p className="text-muted mb-0">{enterpriseInfo.description || 'No description available'}</p>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <Building2 size={48} className="text-muted mb-3" />
                                    <h5 className="text-muted">No Enterprise Info</h5>
                                    <p className="text-muted mb-0">Enterprise information is not available.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white border-bottom">
                            <div className="d-flex align-items-center">
                                <UserCircle size={24} className="text-primary me-2" />
                                <h4 className="mb-0">Department & Manager</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {userInfo?.departmentId ? (
                                <div>
                                    <div className="mb-4">
                                        <h5 className="mb-1">Department</h5>
                                        <p className="text-muted mb-0">{userInfo.departmentName || 'Department name not available'}</p>
                                    </div>
                                    {managerInfo ? (
                                        <div>
                                            <h5 className="mb-1">Manager</h5>
                                            <div className="d-flex align-items-center">
                                                <UserCircle size={32} className="text-primary me-2" />
                                                <div>
                                                    <p className="mb-0 fw-medium">{managerInfo.fullName}</p>
                                                    <p className="text-muted mb-0">{managerInfo.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h5 className="mb-1">Manager</h5>
                                            <p className="text-muted mb-0">No manager assigned</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <UserCircle size={48} className="text-muted mb-3" />
                                    <h5 className="text-muted">Not in a Department</h5>
                                    <p className="text-muted mb-0">
                                        You are not currently assigned to any department.
                                        {pendingInvites.length > 0 && (
                                            <span> Check your pending invites below.</span>
                                        )}
                                    </p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Add Team Members Section after Department & Manager Card */}
            {userInfo?.departmentId && (
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white border-bottom">
                        <div className="d-flex align-items-center">
                            <UserCircle size={24} className="text-primary me-2" />
                            <h4 className="mb-0">Team Members</h4>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {teamMembers.length === 0 ? (
                            <div className="text-center py-4">
                                <UserCircle size={48} className="text-muted mb-3" />
                                <h5 className="text-muted">No Team Members</h5>
                                <p className="text-muted mb-0">There are no other members in your department yet.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className="align-middle">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teamMembers.map(member => (
                                            <tr key={member.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <UserCircle size={32} className="text-primary me-2" />
                                                        <div>
                                                            <p className="mb-0 fw-medium">{member.fullName}</p>
                                                            <small className="text-muted">{member.username}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{member.email}</td>
                                                <td>
                                                    <Badge bg="secondary">
                                                        {member.roleName.replace('ROLE_', '')}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}

            {/* Department Invites Section (only show if not in a department) */}
            {!userInfo?.departmentId && pendingInvites.length > 0 && (
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white border-bottom">
                        <div className="d-flex align-items-center">
                            <Mail size={24} className="text-primary me-2" />
                            <h4 className="mb-0">Department Invites</h4>
                            <Badge bg="primary" className="ms-2">{pendingInvites.length}</Badge>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {pendingInvites.map(invite => (
                            <Card key={invite.id} className="mb-3 border">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 className="mb-2">{invite.departmentName}</h5>
                                            <p className="text-muted mb-0">
                                                <Clock size={16} className="me-2" />
                                                Sent {new Date(invite.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleInviteResponse(invite.id, true)}
                                            >
                                                <CheckCircle size={16} className="me-2" />
                                                Accept
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleInviteResponse(invite.id, false)}
                                            >
                                                <XCircle size={16} className="me-2" />
                                                Decline
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </Card.Body>
                </Card>
            )}

            {/* Items in Use Section */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex align-items-center">
                        <Package size={24} className="text-primary me-2" />
                        <h4 className="mb-0">Items in Use</h4>
                    </div>
                </Card.Header>
                <Card.Body>
                    {itemsInUse.length === 0 ? (
                        <div className="text-center py-5">
                            <Package size={48} className="text-muted mb-3" />
                            <h5 className="text-muted">No Items in Use</h5>
                            <p className="text-muted mb-0">
                                You don't have any items checked out at the moment.
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle">
                                <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Warehouse</th>
                                        <th>Checked Out</th>
                                        <th>Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsInUse.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.warehouseName}</td>
                                            <td>{new Date(item.checkedOutAt).toLocaleDateString()}</td>
                                            <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Item Requests Section */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex align-items-center">
                        <ShoppingCart size={24} className="text-primary me-2" />
                        <h4 className="mb-0">Item Requests</h4>
                    </div>
                </Card.Header>
                <Card.Body>
                    {itemRequests.length === 0 ? (
                        <div className="text-center py-5">
                            <Inbox size={48} className="text-muted mb-3" />
                            <h5 className="text-muted">No Active Requests</h5>
                            <p className="text-muted mb-0">
                                You don't have any pending item requests at the moment.
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Warehouse</th>
                                        <th>Requested Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemRequests.map(request => (
                                        <tr key={request.id}>
                                            <td>{request.itemName}</td>
                                            <td>{request.warehouseName}</td>
                                            <td>{new Date(request.requestedAt).toLocaleDateString()}</td>
                                            <td>
                                                <Badge bg={request.status === 'PENDING' ? 'warning' : 'success'}>
                                                    {request.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EmployeeDashboard;
