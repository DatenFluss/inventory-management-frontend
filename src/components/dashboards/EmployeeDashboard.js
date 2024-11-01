import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EmployeeDashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [enterpriseInfo, setEnterpriseInfo] = useState(null);
    const [managerInfo, setManagerInfo] = useState(null);
    const [items, setItems] = useState([]);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // Fetch all required data
        const fetchData = async () => {
            try {
                const [
                    userResponse,
                    enterpriseResponse,
                    managerResponse,
                    itemsResponse,
                    requestsResponse
                ] = await Promise.all([
                    api.get('/api/users/me'),
                    api.get('/api/enterprises/current'),
                    api.get('/api/users/manager'),
                    api.get('/api/items/my-items'),
                    api.get('/api/items/my-requests')
                ]);

                setUserInfo(userResponse.data);
                setEnterpriseInfo(enterpriseResponse.data);
                setManagerInfo(managerResponse.data);
                setItems(itemsResponse.data);
                setRequests(requestsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Employee Dashboard</h2>

            {/* User Info Section */}
            <section className="mb-4">
                <h3>Personal Information</h3>
                {userInfo && (
                    <div className="card p-3">
                        <p>Name: {userInfo.username}</p>
                        <p>Email: {userInfo.email}</p>
                        {/* Add more user info */}
                    </div>
                )}
            </section>

            {/* Enterprise Info Section */}
            <section className="mb-4">
                <h3>Enterprise Information</h3>
                {enterpriseInfo && (
                    <div className="card p-3">
                        <p>Name: {enterpriseInfo.name}</p>
                        {/* Add more enterprise info */}
                    </div>
                )}
            </section>

            {/* Manager Info Section */}
            <section className="mb-4">
                <h3>Manager Information</h3>
                {managerInfo && (
                    <div className="card p-3">
                        <p>Name: {managerInfo.username}</p>
                        <p>Email: {managerInfo.email}</p>
                        {/* Add more manager info */}
                    </div>
                )}
            </section>

            {/* Items Section */}
            <section className="mb-4">
                <h3>Items in Use</h3>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Status</th>
                            <th>Assigned Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.status}</td>
                                <td>{item.assignedDate}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Requests Section */}
            <section className="mb-4">
                <h3>Item Requests</h3>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Request Date</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requests.map(request => (
                            <tr key={request.id}>
                                <td>{request.itemName}</td>
                                <td>{request.requestDate}</td>
                                <td>{request.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default EmployeeDashboard;