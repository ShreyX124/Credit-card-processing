// src/components/MerchantDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MerchantDashboard = () => {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    completedTransactions: 0,
    flaggedTransactions: 0,
    failedTransactions: 0,
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const res = await axios.get('http://localhost:5000/api/transactions', {
          headers: {
            'x-auth-token': token
          }
        });

        // Calculate statistics
        const transactions = res.data;
        const completed = transactions.filter(t => t.status === 'completed');
        const flagged = transactions.filter(t => t.status === 'flagged');
        const failed = transactions.filter(t => t.status === 'failed');
        
        const totalAmount = completed.reduce((sum, t) => sum + parseFloat(t.amount), 0);

        setStats({
          totalTransactions: transactions.length,
          completedTransactions: completed.length,
          flaggedTransactions: flagged.length,
          failedTransactions: failed.length,
          totalAmount: totalAmount.toFixed(2)
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to load transaction data');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div className="jumbotron bg-light p-4 mb-4">
        <h1 className="display-4">Merchant Dashboard</h1>
        <p className="lead">
          Monitor all transactions and view fraud detection alerts.
        </p>
      </div>

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Transactions</h5>
              <h2>{stats.totalTransactions}</h2>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Completed</h5>
              <h2>{stats.completedTransactions}</h2>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h5 className="card-title">Flagged</h5>
              <h2>{stats.flaggedTransactions}</h2>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h5 className="card-title">Failed</h5>
              <h2>{stats.failedTransactions}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Processed Amount</h5>
              <h3>${stats.totalAmount}</h3>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Transaction History</h5>
              <p>View detailed transaction logs and reports.</p>
              <Link to="/transactions" className="btn btn-primary">
                View All Transactions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;