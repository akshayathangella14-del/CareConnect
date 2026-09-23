import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/features/auth';

/**
 * ProtectedRoute — Redirects unauthenticated users to /login.
 *
 * NOTE: This is UX protection only.
 * The backend remains the source of truth for authorization.
 */
function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
