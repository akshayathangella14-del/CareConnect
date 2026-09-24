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
import styles from './DashboardPage.module.css';

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

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className={styles.dashboard}>
      {/* Welcome Banner Card */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeContent}>
          <div className={styles.welcomeUser}>
            <div className={styles.roleIcon}>
              <RoleIcon size={32} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 8 }}>
                <h1 className={styles.welcomeTitle}>
                  Welcome back, {user?.name || 'User'}!
                </h1>
                <Badge variant={config.badgeVariant} dot>
                  {user?.role?.replace('_', ' ')}
                </Badge>
              </div>
              <p className={styles.welcomeTagline}>
                {config.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info & Next Actions Grid */}
      <div className={styles.grid}>
        {/* Account Details */}
        <Card variant="default" padding="md">
          <Card.Header
            title="Profile Details"
            subtitle="Your contact and role information"
          />
          <Card.Body>
            <div className={styles.profileInfo}>
              <div className={styles.profileAvatar}>
                <div className={styles.avatarCircle}>{initials}</div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{user?.name || 'User'}</div>
                  <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>{user?.role?.replace('_', ' ')}</div>
                </div>
              </div>
              <div className={styles.profileRow}>
                <span className={styles.profileLabel}>Email Address</span>
                <span className={styles.profileValue}>{user?.email || 'N/A'}</span>
              </div>
              <div className={styles.profileRow}>
                <span className={styles.profileLabel}>Phone Number</span>
                <span className={styles.profileValue}>{user?.phone || 'Not provided'}</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* What Can I Do Next */}
        <Card variant="default" padding="md">
          <Card.Header
            title="What's Next?"
            subtitle="Quick actions to get started"
          />
          <Card.Body>
            <div className={styles.actionList}>
              {config.nextActions.map((action, idx) => (
                <Link key={idx} to={action.path} className={styles.actionItem}>
                  <div className={styles.actionText}>
                    <div className={styles.actionLabel}>
                      {action.label}
                    </div>
                    <div className={styles.actionDesc}>
                      {action.desc}
                    </div>
                  </div>
                  <ArrowRight className={styles.actionIcon} size={18} />
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
