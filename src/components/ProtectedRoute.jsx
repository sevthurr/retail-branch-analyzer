// Protected Route component - redirects to login if user is not authenticated
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/config';

/**
 * ProtectedRoute - Wrapper component for routes that require authentication
 * Redirects to /login if user is not authenticated
 * @param {Object} props - Component props
 * @param {React.Component} props.children - Child components to render if authenticated
 */
const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
