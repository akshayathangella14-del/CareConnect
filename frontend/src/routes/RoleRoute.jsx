import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '@/features/auth';

/**
 * RoleRoute — Restricts access to specific user roles.
 *
 * @param {string[]} allowedRoles — Array of role strings (e.g. ['CUSTOMER', 'ADMIN'])
 *
 * NOTE: Frontend role checks are UX protection only.
 * The backend remains the source of truth for authorization.
 */
function RoleRoute({ roles, children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!roles || !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RoleRoute;
