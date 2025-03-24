// src/components/Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/CardStyles.css'; // Import card styles
import '../styles/FormStyles.css'; // Import form styles
import '../styles/ButtonStyles.css'; // Import button styles
import '../styles/TextStyles.css'; // Import text styles

const Login = ({ login }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { username, password } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });

            login(res.data.token, {
                id: res.data.user.id,
                username: res.data.user.username,
                userType: res.data.user.userType
            });

        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0">Login</h4>
                    </div>
                    <div className="card-body">
                        {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={onSubmit}>
                            <div className="form-group mb-3">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="username"
                                    value={username}
                                    onChange={onChange}
                                    required
                                />
                                <small className="form-text text-muted">
                                    Demo accounts: customer@example.com / merchant@example.com
                                </small>
                            </div>

                            <div className="form-group mb-3">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                />
                                <small className="form-text text-muted">
                                    Demo passwords: customer123 / merchant123
                                </small>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                                <Link to="/register" className="text-muted">
                                    New user? Register here
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;