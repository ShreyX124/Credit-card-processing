import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTachometerAlt, FaCreditCard, FaHistory, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ isAuthenticated, userType, logout, theme, toggleTheme, toggleSidebar, isSidebarOpen }) => {
    return (
        <>
            {/* Sidebar */}
            {isAuthenticated && (
                <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                    {/* Hamburger Menu Button Integrated with Sidebar */}
                    <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                        <FaBars />
                    </button>

                    <div className="sidebar-content">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to={userType === 'customer' ? '/customer/dashboard' : '/merchant/dashboard'}
                                    onClick={toggleSidebar}
                                >
                                    <FaTachometerAlt className="nav-icon" />
                                    <span className="nav-text">Dashboard</span>
                                </Link>
                            </li>

                            {userType === 'customer' && (
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/payment"
                                        onClick={toggleSidebar}
                                    >
                                        <FaCreditCard className="nav-icon" />
                                        <span className="nav-text">Make Payment</span>
                                    </Link>
                                </li>
                            )}

                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to="/transactions"
                                    onClick={toggleSidebar}
                                >
                                    <FaHistory className="nav-icon" />
                                    <span className="nav-text">Transactions</span>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to="/profile"
                                    onClick={toggleSidebar}
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
                                        toggleSidebar();
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
                    <Link className="navbar-brand" to="/">
                        Credit Card Processing MVP
                    </Link>

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