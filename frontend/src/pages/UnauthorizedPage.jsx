import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { Button, EmptyState } from '@/components';

/**
 * UnauthorizedPage — Shown when a user tries to access
 * a route their role does not permit.
 */
function UnauthorizedPage() {
  return (
    <EmptyState
      icon={<ShieldX size={28} />}
      title="Access Denied"
      description="You don't have permission to access this page. If you believe this is an error, please contact support."
      action={
        <Link to="/dashboard">
          <Button variant="primary">Go to Dashboard</Button>
        </Link>
      }
    />
  );
}

export default UnauthorizedPage;
