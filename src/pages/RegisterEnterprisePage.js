import React, { useState } from 'react';
import api from '../services/api';

function RegisterEnterprisePage() {
    const [enterpriseName, setEnterpriseName] = useState('');
    const [address, setAddress] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [ownerUsername, setOwnerUsername] = useState('');
    const [ownerPassword, setOwnerPassword] = useState('');
    const [ownerEmail, setOwnerEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const enterpriseRegistration = {
            enterpriseName: enterpriseName,
            address: address,
            contactEmail: contactEmail,
            ownerUsername: ownerUsername,
            ownerPassword: ownerPassword,
            ownerEmail: ownerEmail,
        };

        api.post('/api/enterprise/register', enterpriseRegistration)
            .then(response => {
                setMessage('Enterprise registration successful!');
                // Reset form fields if needed
            })
            .catch(error => {
                setMessage('Enterprise registration failed.');
                console.error('Enterprise registration error:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h2>Register Enterprise</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                {/* Enterprise Name */}
                <div className="form-group">
                    <label>Enterprise Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={enterpriseName}
                        onChange={(e) => setEnterpriseName(e.target.value)}
                        required
                    />
                </div>
                {/* Address */}
                <div className="form-group">
                    <label>Address:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                {/* Contact Email */}
                <div className="form-group">
                    <label>Contact Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                    />
                </div>
                {/* Owner Username */}
                <div className="form-group">
                    <label>Owner Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={ownerUsername}
                        onChange={(e) => setOwnerUsername(e.target.value)}
                        required
                    />
                </div>
                {/* Owner Password */}
                <div className="form-group">
                    <label>Owner Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={ownerPassword}
                        onChange={(e) => setOwnerPassword(e.target.value)}
                        required
                    />
                </div>
                {/* Owner Email */}
                <div className="form-group">
                    <label>Owner Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        required
                    />
                </div>
                {/* Submit Button */}
                <button type="submit" className="btn btn-success">Register Enterprise</button>
            </form>
        </div>
    );
}

export default RegisterEnterprisePage;
