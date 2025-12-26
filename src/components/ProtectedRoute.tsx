// Protected Route component - redirects to login if not authenticated
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean; // Optional: require admin role
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Not logged in - redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin when admin is required
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/student" replace />;
  }

  // All checks passed - render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
