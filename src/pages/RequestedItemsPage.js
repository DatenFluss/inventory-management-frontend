import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RequestedItemsPage() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchUserRequests = async () => {
            try {
                const response = await axios.get('/api/requests', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchUserRequests();
    }, []);

    return (
        <div className="container mt-5">
            <h1>Your Requested Items</h1>
            <ul className="list-group">
                {requests.map((request) => (
                    <li className="list-group-item" key={request.id}>
                        <h5>{request.inventoryItem.name}</h5>
                        <p>Quantity: {request.quantity}</p>
                        <p>Status: {request.status}</p>
                        <p>Requested On: {new Date(request.requestDate).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RequestedItemsPage;
