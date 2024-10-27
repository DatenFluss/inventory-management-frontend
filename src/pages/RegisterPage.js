import React, { useState } from 'react';
import api from '../services/api';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const registrationData = {
            username: username,
            password: password,
            email: email,
        };

        api.post('/api/users/register', registrationData)
            .then(response => {
                setMessage('Registration successful! Please log in.');
                // Redirect to login page
                // history.push('/login');

                // Or clear the form fields
                setUsername('');
                setPassword('');
                setEmail('');
            })
            .catch(error => {
                if (error.response) {
                    // Server responded with a status other than 2xx
                    setMessage(`Registration failed: ${error.response.data.message || error.response.data}`);
                } else if (error.request) {
                    // Request was made but no response received
                    setMessage('Registration failed: No response from server.');
                } else {
                    // Something else happened
                    setMessage(`Registration failed: ${error.message}`);
                }
                console.error('Registration error:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h2>User Registration</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                {/* Email */}
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                {/* Password */}
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {/* Submit Button */}
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;
