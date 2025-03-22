// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Registration from './components/Registration'; // Add this import
import CustomerDashboard from './components/CustomerDashboard';
import MerchantDashboard from './components/MerchantDashboard';
import Navbar from './components/Navbar';
import PaymentForm from './components/PaymentForm';
import TransactionHistory from './components/TransactionHistory';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    
    if (token && storedUserType) {
      setIsAuthenticated(true);
      setUserType(storedUserType);
    }
    
    setLoading(false);
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', user.userType);
    localStorage.setItem('username', user.username);
    setIsAuthenticated(true);
    setUserType(user.userType);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUserType(null);
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} userType={userType} logout={logout} />
      <div className="container mt-4">
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                userType === 'customer' ? (
                  <Navigate to="/customer/dashboard" />
                ) : (
                  <Navigate to="/merchant/dashboard" />
                )
              ) : (
                <Login login={login} />
              )
            } 
          />
          <Route 
            path="/register" 
            element={<Registration login={login} />}
          />
          <Route 
            path="/customer/dashboard" 
            element={
              <ProtectedRoute 
                isAuthenticated={isAuthenticated} 
                userType={userType}
                requiredUserType="customer"
              >
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/merchant/dashboard" 
            element={
              <ProtectedRoute 
                isAuthenticated={isAuthenticated} 
                userType={userType}
                requiredUserType="merchant"
              >
                <MerchantDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute 
                isAuthenticated={isAuthenticated} 
                userType={userType}
                requiredUserType="customer"
              >
                <PaymentForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <ProtectedRoute 
                isAuthenticated={isAuthenticated} 
                userType={userType}
              >
                <TransactionHistory />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;