import React, { useState } from 'react';
import api from '../services/api';

function RegisterEnterprisePage() {
    const [enterpriseName, setEnterpriseName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const enterpriseRegistration = {
            enterpriseName: enterpriseName,
            contactEmail: contactEmail,
        };

        api.post('/api/enterprise/register', enterpriseRegistration)
            .then(response => {
                setMessage('Enterprise registration successful!');
                setEnterpriseName('');
                setContactEmail('');
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
                {/* Enterprise Name Field */}
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
                {/* Contact Email Field */}
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
                {/* Submit Button */}
                <button type="submit" className="btn btn-success">Register Enterprise</button>
            </form>
        </div>
    );
}

export default RegisterEnterprisePage;
