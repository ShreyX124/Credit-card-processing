// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, userType, logout, theme, toggleTheme }) => {
    return (
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
                    {isAuthenticated ? (
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to={userType === 'customer' ? '/customer/dashboard' : '/merchant/dashboard'}
                                >
                                    Dashboard
                                </Link>
                            </li>

                            {userType === 'customer' && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/payment">
                                        Make Payment
                                    </Link>
                                </li>
                            )}

                            <li className="nav-item">
                                <Link className="nav-link" to="/transactions">
                                    Transactions
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">
                                    Profile
                                </Link>
                            </li>

                            <li className="nav-item">
                                <button
                                    className="nav-link btn btn-link"
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                            </li>

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
                    ) : (
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
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;