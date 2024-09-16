import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const { setAuthToken } = useContext(AuthContext);
    const history = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const loginRequest = {
            username: username,
            password: password,
        };

        api.post('/api/auth/signin', loginRequest)
            .then(response => {
                const token = response.data.token;
                setAuthToken(token);
                history.push('/dashboard');
            })
            .catch(error => {
                setError('Invalid username or password');
                console.error('Login error:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
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
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
