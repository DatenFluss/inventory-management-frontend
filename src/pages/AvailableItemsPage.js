import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AvailableItemsPage() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchAvailableItems = async () => {
            try {
                const response = await axios.get('/api/items', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchAvailableItems();
    }, []);

    // Implement the UI to display items and allow item requests
    // For now, we'll display the item names and quantities

    return (
        <div className="container mt-5">
            <h1>Available Items</h1>
            <div className="row">
                {items.map((item) => (
                    <div className="col-md-4 mb-4" key={item.id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{item.name}</h5>
                                <p className="card-text">Quantity: {item.quantity}</p>
                                <p className="card-text">{item.description}</p>
                                
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AvailableItemsPage;
