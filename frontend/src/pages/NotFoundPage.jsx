import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button, Card } from '@/components';

function NotFoundPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <Card padding="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <AlertTriangle size={28} color="var(--color-warning)" />
            <h1 style={{ margin: 0, fontSize: 'var(--font-size-h2)' }}>Page not found</h1>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            The page you opened does not exist or is not available for your current account.
          </p>
          <div>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" leftIcon={<ArrowLeft size={16} />}>
                Back to dashboard
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default NotFoundPage;
