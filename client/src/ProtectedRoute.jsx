// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from './store'; // Ensure this path is correct

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useUserStore((state) => state.user);

//   Check if the user is logged in
  if (!user) return <Navigate to="/login" />;

//   Check if the user's role is allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // Redirect to home or any other page
  }

  return children; // Render the protected component
};

export default ProtectedRoute;