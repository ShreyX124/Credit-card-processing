// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ 
  children, 
  isAuthenticated, 
  userType,
  requiredUserType
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to={`/${userType}/dashboard`} />;
  }

  return children;
};

export default ProtectedRoute;