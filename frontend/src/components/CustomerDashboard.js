// src/components/CustomerDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CardStyles.css'; // Import card styles
import '../styles/ButtonStyles.css'; // Import button styles
import '../styles/TextStyles.css'; // Import text styles

const CustomerDashboard = () => {
    const username = localStorage.getItem('username');

    return (
        <div>
            <div className="jumbotron bg-light p-4 mb-4">
                <h1 className="display-4">Welcome, {username}!</h1>
                <p className="lead">
                    This is your customer dashboard for the Credit Card Processing System.
                </p>
                <hr className="my-4" />
                <p>From here you can make payments and view your transaction history.</p>
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Make a Payment</h5>
                            <p className="card-text">
                                Process a new credit card payment securely through our system.
                            </p>
                            <Link to="/payment" className="btn btn-primary">
                                Go to Payment Form
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Transaction History</h5>
                            <p className="card-text">
                                View your past transaction history and payment statuses.
                            </p>
                            <Link to="/transactions" className="btn btn-info">
                                View Transactions
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;