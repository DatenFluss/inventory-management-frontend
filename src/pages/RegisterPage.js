import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const history = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const registerRequest = {
            username: username,
            email: email,
            password: password,
        };

        api.post('/api/auth/signup', registerRequest)
            .then(response => {
                console.log('Registration successful:', response);
                history.push('/login');
            })
            .catch(error => {
                setError('Registration failed. Please try again.');
                console.error('Registration error:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h2>Register</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                {/* Username Field */}
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
                {/* Email Field */}
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
                {/* Password Field */}
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
                <button type="submit" className="btn btn-secondary">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;
