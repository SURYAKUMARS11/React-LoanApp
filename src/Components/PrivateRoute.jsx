import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
  const role = localStorage.getItem('role');
  const location = useLocation();
  console.log("Current Role in Storage:", role); // ADD THIS LINE

  if (!role || role === "null" || role === "undefined") {
    console.log("No role found, redirecting to login...");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  if (requiredRole && role !== requiredRole) {
    // Redirect to home if they don't have the right permissions
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
