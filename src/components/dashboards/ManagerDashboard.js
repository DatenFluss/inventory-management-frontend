import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManagerDashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [enterpriseInfo, setEnterpriseInfo] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [subordinates, setSubordinates] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    userResponse,
                    enterpriseResponse,
                    requestsResponse,
                    subordinatesResponse
                ] = await Promise.all([
                    api.get('/api/users/me'),
                    api.get('/api/enterprises/current'),
                    api.get('/api/items/pending-requests'),
                    api.get('/api/users/subordinates')
                ]);

                setUserInfo(userResponse.data);
                setEnterpriseInfo(enterpriseResponse.data);
                setPendingRequests(requestsResponse.data);
                setSubordinates(subordinatesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleRequestAction = async (requestId, action) => {
        try {
            await api.post(`/api/items/requests/${requestId}/${action}`);
            // Refresh pending requests
            const response = await api.get('/api/items/pending-requests');
            setPendingRequests(response.data);
        } catch (error) {
            console.error(`Error ${action} request:`, error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Manager Dashboard</h2>

            {/* Personal Info Section */}
            <section className="mb-4">
                <h3>Personal Information</h3>
                {userInfo && (
                    <div className="card p-3">
                        <p>Name: {userInfo.username}</p>
                        <p>Email: {userInfo.email}</p>
                        <p>Role: Manager</p>
                    </div>
                )}
            </section>

            {/* Enterprise Info Section */}
            <section className="mb-4">
                <h3>Enterprise Information</h3>
                {enterpriseInfo && (
                    <div className="card p-3">
                        <p>Name: {enterpriseInfo.name}</p>
                        <p>Department: {enterpriseInfo.department}</p>
                    </div>
                )}
            </section>

            {/* Pending Requests Section */}
            <section className="mb-4">
                <h3>Pending Requests</h3>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Item</th>
                            <th>Request Date</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pendingRequests.map(request => (
                            <tr key={request.id}>
                                <td>{request.employeeName}</td>
                                <td>{request.itemName}</td>
                                <td>{request.requestDate}</td>
                                <td>
                                    <button
                                        className="btn btn-success btn-sm me-2"
                                        onClick={() => handleRequestAction(request.id, 'approve')}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRequestAction(request.id, 'reject')}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Subordinates Section */}
            <section className="mb-4">
                <h3>Team Members</h3>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Items In Use</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {subordinates.map(employee => (
                            <tr key={employee.id}>
                                <td>{employee.username}</td>
                                <td>{employee.email}</td>
                                <td>{employee.itemsInUse}</td>
                                <td>{employee.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default ManagerDashboard;