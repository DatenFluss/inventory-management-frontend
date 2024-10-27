import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserMainPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data from the API
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Redirect to login if not authenticated
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleRequestItemClick = () => {
        navigate('/items');
    };

    const handleRequestedItemsClick = () => {
        navigate('/requested-items');
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h1>Welcome, {user.name}</h1>
            <h2>Position: {user.position}</h2>
            <div className="mt-4">
                <button className="btn btn-primary mr-2" onClick={handleRequestItemClick}>
                    Request Item
                </button>
                <button className="btn btn-secondary" onClick={handleRequestedItemsClick}>
                    Requested Items
                </button>
            </div>
        </div>
    );
}

export default UserMainPage;
