// frontend/src/components/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch user data from the backend
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token being sent:', token);
                if (!token) {
                    throw new Error('No token found in localStorage');
                }

                const response = await axios.get('http://localhost:5000/api/auth/profile', { // Changed port to 5000
                    headers: { 'x-auth-token': token }
                });
                console.log('API Response:', response.data);
                setUserData(response.data.user);
                setTransactions(response.data.transactions);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError(error.message || 'Failed to fetch profile data');
            }
        };

        fetchUserData();
    }, []);

    if (error) {
        return <div className="text-center mt-5 text-danger">Error: {error}</div>;
    }

    if (!userData) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="profile-container">
            <h2 className="mb-4">Profile</h2>
            <div className="card p-4 mb-4">
                <h4>User Information</h4>
                <p><strong>Username:</strong> {userData.username}</p>
                <p><strong>Role:</strong> {userData.user_type}</p>
            </div>
            <h3 className="mb-3">Transaction History</h3>
            {transactions.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Amount</th>
                                <th>Timestamp</th>
                                <th>Status</th>
                                <th>Fraud Flag</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td>${tx.amount}</td>
                                    <td>{new Date(tx.created_at).toLocaleString()}</td>
                                    <td>{tx.status}</td>
                                    <td>{tx.fraud_flag ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No transactions found.</p>
            )}
        </div>
    );
};

export default Profile;