// src/components/TransactionHistory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config'; // Add this import

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const res = await axios.get(`${API_BASE_URL}/api/transactions`, {
          headers: {
            'x-auth-token': token
          }
        });
        
        setTransactions(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Get status badge class
  const getStatusBadge = status => {
    switch(status) {
      case 'completed':
        return 'bg-success';
      case 'flagged':
        return 'bg-warning text-dark';
      case 'failed':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  // Format date
  const formatDate = dateString => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Transaction History</h2>
      
      {transactions.length === 0 ? (
        <div className="alert alert-info">
          No transactions found.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                {userType === 'merchant' && <th>Customer</th>}
                <th>Date</th>
                <th>Amount</th>
                <th>Card</th>
                <th>Status</th>
                <th>Fraud Flag</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  {userType === 'merchant' && <td>{transaction.customer_email}</td>}
                  <td>{formatDate(transaction.created_at)}</td>
                  <td>${parseFloat(transaction.amount).toFixed(2)}</td>
                  <td>{transaction.card_number}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td>
                    {transaction.fraud_flag ? (
                      <span className="badge bg-danger">Flagged</span>
                    ) : (
                      <span className="badge bg-success">Clear</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;