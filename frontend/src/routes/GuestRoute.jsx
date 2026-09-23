import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/features/auth';

/**
 * GuestRoute — Redirects authenticated users to the dashboard.
 * Used on login/register pages to prevent re-visiting auth pages.
 */
function GuestRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default GuestRoute;
