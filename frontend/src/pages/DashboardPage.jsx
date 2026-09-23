import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '@/features/auth';
import {
  LayoutDashboard,
  Wrench,
  Users,
  Headphones,
  Shield,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { Card, Badge, Button } from '@/components';

const roleConfig = {
  CUSTOMER: {
    title: 'Customer Dashboard',
    tagline: 'Book, track, and manage your home service requests',
    icon: LayoutDashboard,
    badgeVariant: 'primary',
    nextActions: [
      { label: 'Submit a new service request', desc: 'Describe your home issue and get AI-matched quotes', path: '/service-requests/new' },
      { label: 'Review pending provider quotes', desc: 'Compare verified professional offers', path: '/service-requests' },
      { label: 'View active bookings', desc: 'Track progress and confirm completion', path: '/bookings' },
    ],
  },
  SERVICE_PROVIDER: {
    title: 'Service Provider Portal',
    tagline: 'Manage incoming job leads, quotes, and active bookings',
    icon: Wrench,
    badgeVariant: 'accent',
    nextActions: [
      { label: 'Browse matched service requests', desc: 'Jobs aligned with your registered skills and area', path: '/provider/matches' },
      { label: 'Manage active bookings', desc: 'Update status and upload evidence', path: '/provider/bookings' },
      { label: 'Update schedule availability', desc: 'Set your available working hours', path: '/provider/availability' },
    ],
  },
  OPERATIONS_MANAGER: {
    title: 'Operations Command',
    tagline: 'Platform metrics, provider verifications, and dispatches',
    icon: Users,
    badgeVariant: 'violet',
    nextActions: [
      { label: 'Review provider verification queue', desc: 'Check credential uploads and background status', path: '/operations/verifications' },
      { label: 'Monitor active service requests', desc: 'Track SLA deadlines and fulfillment', path: '/operations/requests' },
    ],
  },
  SUPPORT_AGENT: {
    title: 'Support Desk',
    tagline: 'Handle customer inquiries, dispute cases, and resolution',
    icon: Headphones,
    badgeVariant: 'warning',
    nextActions: [
      { label: 'Review open dispute tickets', desc: 'Examine ServiceTrac evidence logs', path: '/support/disputes' },
      { label: 'View user invoices', desc: 'Assist with billing inquiries', path: '/support/invoices' },
    ],
  },
  ADMIN: {
    title: 'Platform Administration',
    tagline: 'System configuration, role management, and audit logs',
    icon: Shield,
    badgeVariant: 'error',
    nextActions: [
      { label: 'Category & skill management', desc: 'Configure marketplace services and pricing rules', path: '/admin/categories' },
      { label: 'System audit logs', desc: 'Inspect security and operational events', path: '/admin/audit' },
    ],
  },
};

/**
 * DashboardPage — Role-aware dashboard landing.
 * Answers:
 * 1. What is happening?
 * 2. What needs attention?
 * 3. What can I do next?
 */
function DashboardPage() {
  const user = useSelector(selectCurrentUser);
  const config = roleConfig[user?.role] || roleConfig.CUSTOMER;
  const RoleIcon = config.icon;

  return (
    <div style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Welcome Banner Card */}
      <Card variant="default" padding="lg">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--color-primary-soft)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <RoleIcon size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 4 }}>
                <h1 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                  Welcome back, {user?.name || 'User'}!
                </h1>
                <Badge variant={config.badgeVariant} dot>
                  {user?.role?.replace('_', ' ')}
                </Badge>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-body)' }}>
                {config.tagline}
              </p>
            </div>
          </div>
          <Badge variant="success" dot>
            Account Active
          </Badge>
        </div>
      </Card>

      {/* Account Info & Next Actions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Account Details */}
        <Card variant="default" padding="md">
          <Card.Header
            title="Profile Details"
            subtitle="Verified account information"
          />
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--font-size-small)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Email Address</span>
                <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{user?.email || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Phone</span>
                <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{user?.phone || 'Not provided'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Platform Role</span>
                <span style={{ fontWeight: 500, color: 'var(--color-primary)' }}>{user?.role?.replace('_', ' ')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Session Status</span>
                <span style={{ fontWeight: 500, color: 'var(--color-success)' }}>Authenticated (JWT)</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* What Can I Do Next */}
        <Card variant="default" padding="md">
          <Card.Header
            title="What's Next?"
            subtitle="Upcoming platform capabilities"
          />
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {config.nextActions.map((action, idx) => (
                <Link key={idx} to={action.path} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      padding: 'var(--space-3)',
                      backgroundColor: 'var(--color-surface-muted)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-subtle)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <div style={{ fontSize: 'var(--font-size-small)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {action.label}
                      </div>
                      <ArrowRight size={14} color="var(--color-text-secondary)" />
                    </div>
                    <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
                      {action.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* AI Foundation Note */}
      <Card variant="outlined" padding="md">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-violet-soft)',
              color: 'var(--color-violet)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 'var(--font-size-small)', fontWeight: 600, color: 'var(--color-text-primary)', display: 'block' }}>
              Gemini AI Service Foundation Active
            </span>
            <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
              Request classification and skill matching engine is ready on the backend with automatic fallback.
            </span>
          </div>
          <Link to="/design-system">
            <Button variant="secondary" size="sm">
              Design System
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default DashboardPage;
