// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/GlobalStyles.css';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import CustomerDashboard from './components/CustomerDashboard';
import MerchantDashboard from './components/MerchantDashboard';
import Navbar from './components/Navbar';
import PaymentForm from './components/PaymentForm';
import TransactionHistory from './components/TransactionHistory';
import Profile from './components/Profile';
import Registration from './components/Registration';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');

    if (token && storedUserType) {
      setIsAuthenticated(true);
      setUserType(storedUserType);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : 'dark-mode';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const login = (token, user) => {
    console.log('Login called with:', { token, user });
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

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <Router>
      <div className={`app-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Conditionally render Navbar only for authenticated users */}
        {isAuthenticated && (
          <Navbar
            isAuthenticated={isAuthenticated}
            userType={userType}
            logout={logout}
            theme={theme}
            toggleTheme={toggleTheme}
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}
        <div className="main-content">
          {isAuthenticated && (
            <div className="app-header">
              <h2 className="app-title">Credit Card Processing MVP</h2>
            </div>
          )}
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
                    <LandingPage />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to={userType === 'customer' ? '/customer/dashboard' : '/merchant/dashboard'} />
                  ) : (
                    <Login login={login} />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  isAuthenticated ? (
                    <Navigate to={userType === 'customer' ? '/customer/dashboard' : '/merchant/dashboard'} />
                  ) : (
                    <Registration login={login} />
                  )
                }
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
              <Route
                path="/profile"
                element={
                  <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    userType={userType}
                  >
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;