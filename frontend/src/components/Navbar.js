// frontend/src/components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTachometerAlt, FaCreditCard, FaHistory, FaUser, FaSignOutAlt } from 'react-icons/fa';
import '../styles/NavbarStyles.css';

const Navbar = ({ isAuthenticated, userType, logout, theme, toggleTheme, toggleSidebar, isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  // Helper function to determine if a link is active
  const isActive = (path) => location.pathname === path;

  // Handler to collapse the sidebar after navigation
  const handleNavClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Sidebar */}
      {isAuthenticated && (
        <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          {/* Sidebar Header with "Navigation Bar" Text */}
          <div className="sidebar-header">
            <h2 className="sidebar-title">Navigation Bar</h2>
          </div>

          {/* Hamburger Menu Button Integrated with Sidebar */}
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>

          <div className="sidebar-content">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive(userType === 'customer' ? '/customer/dashboard' : '/merchant/dashboard') ? 'active' : ''}`}
                  to={userType === 'customer' ? '/customer/dashboard' : '/merchant/dashboard'}
                  onClick={handleNavClick}
                >
                  <FaTachometerAlt className="nav-icon" />
                  <span className="nav-text">Dashboard</span>
                </Link>
              </li>

              {userType === 'customer' && (
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/payment') ? 'active' : ''}`}
                    to="/payment"
                    onClick={handleNavClick}
                  >
                    <FaCreditCard className="nav-icon" />
                    <span className="nav-text">Make Payment</span>
                  </Link>
                </li>
              )}

              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/transactions') ? 'active' : ''}`}
                  to="/transactions"
                  onClick={handleNavClick}
                >
                  <FaHistory className="nav-icon" />
                  <span className="nav-text">Transactions</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                  to="/profile"
                  onClick={handleNavClick}
                >
                  <FaUser className="nav-icon" />
                  <span className="nav-text">Profile</span>
                </Link>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={() => {
                    logout();
                    handleNavClick();
                  }}
                >
                  <FaSignOutAlt className="nav-icon" />
                  <span className="nav-text">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {!isAuthenticated && (
              <ul className="navbar-nav ms-auto align-items-center">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </ul>
            )}
            <ul className="navbar-nav ms-auto align-items-center">
              {/* Theme Toggle Switch */}
              <li className="nav-item">
                <div className="theme-toggle">
                  <label className="theme-switch">
                    <input
                      type="checkbox"
                      checked={theme === 'light'}
                      onChange={toggleTheme}
                    />
                    <span className="slider round">
                      <span className="icon-dark">🌙</span>
                      <span className="icon-light">☀️</span>
                    </span>
                  </label>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;