// src/components/Registration.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import '../styles/CardStyles.css'; // Import card styles
import '../styles/FormStyles.css'; // Import form styles
import '../styles/ButtonStyles.css'; // Import button styles
import '../styles/TextStyles.css'; // Import text styles

function Registration({ login }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('customer');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(username)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, userType }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error response text:', errorText);
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (parseErr) {
                    throw new Error('Server returned an invalid response: ' + errorText);
                }
                throw new Error(errorData.msg || 'Registration failed');
            }

            const data = await response.json();
            console.log('Registration response:', data);

            if (!data.token || !data.user) {
                throw new Error('Invalid response from server: token or user data missing');
            }

            login(data.token, { username: data.user.username, userType: data.user.userType });
            const redirectPath = data.user.userType === 'customer' ? '/customer/dashboard' : '/merchant/dashboard';
            navigate(redirectPath);
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed. Please try again.');
        }
    };

    try {
        return (
            <div className="card p-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h2 className="mb-4">Register</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="example@domain.com"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Account Type</label>
                        <select
                            className="form-select"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                        >
                            <option value="customer">Customer</option>
                            <option value="merchant">Merchant</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Register
                    </button>
                </form>
            </div>
        );
    } catch (renderError) {
        console.error('Render error in Registration:', renderError);
        return <div className="text-center mt-5 text-danger">Error rendering registration page. Please try again.</div>;
    }
}

export default Registration;