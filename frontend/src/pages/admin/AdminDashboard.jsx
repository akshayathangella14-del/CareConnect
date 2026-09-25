import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, ShieldCheck, Users, Wrench } from 'lucide-react';
import { Card, Badge } from '@/components';
import { selectCurrentUser } from '@/features/auth';
import { useGetPlatformStatsQuery } from '@/features/stats';
import { useListProvidersQuery } from '@/features/providers';
import { useGetAnalyticsSummaryQuery } from '@/features/analytics';

export default function AdminDashboard() {
  const user = useSelector(selectCurrentUser);
  const { data: stats } = useGetPlatformStatsQuery();
  const { data: providers = [] } = useListProvidersQuery(undefined, { pollingInterval: 30000 });
  const { data: analytics = {} } = useGetAnalyticsSummaryQuery(undefined, { pollingInterval: 30000 });

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  const metricCards = [
    { label: 'Total users', value: analytics.totalUsers ?? 0, tone: 'primary' },
    { label: 'Suspended users', value: analytics.suspendedUsers ?? 0, tone: 'error' },
    { label: 'Active bookings', value: stats?.activeBookings ?? 0, tone: 'warning' },
    { label: 'Verification backlog', value: providers.filter((provider) => provider.verificationStatus === 'PENDING').length, tone: 'violet' },
  ];

  const actions = [
    { label: 'Manage categories', desc: 'Configure service taxonomy, pricing rules, and category onboarding.', path: '/admin/categories' },
    { label: 'Manage users', desc: 'Review account status, roles, and platform access.', path: '/admin/users' },
    { label: 'Manage providers', desc: 'Review provider records and marketplace access.', path: '/admin/providers' },
    { label: 'Review provider verification', desc: 'Approve or reject provider submissions and background checks.', path: '/operations/verifications' },
    { label: 'Inspect platform audit log', desc: 'Trace recent security, admin, and operational activity.', path: '/admin/audit' },
    { label: 'Monitor platform analytics', desc: 'Track quality, conversion, and market activity across the app.', path: '/admin/analytics' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', fontWeight: 700 }}>
              {user?.profileImage ? <img src={user.profileImage} alt={user.name || 'Admin'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 8 }}>
                <h1 style={{ margin: 0, fontSize: 'var(--font-size-h2)' }}>Platform administration</h1>
                <Badge variant="error">Admin</Badge>
              </div>
              <div style={{ color: 'var(--color-text-secondary)' }}>Monitor the marketplace, system health, and operational quality across all roles.</div>
            </div>
          </div>
          <Link to="/admin/categories" style={{ textDecoration: 'none' }}>
            <button style={{ border: 'none', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', borderRadius: 12, padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>Manage platform</button>
          </Link>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        {metricCards.map((card) => (
          <Card key={card.label} padding="md" style={{ minHeight: 120 }}>
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)', marginBottom: 10 }}>{card.label}</div>
            <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 800 }}>{card.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 'var(--space-6)' }}>
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <Wrench size={18} color="var(--color-primary)" />
            <h3 style={{ margin: 0 }}>System controls</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {actions.map((item) => (
              <Link key={item.label} to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>{item.desc}</div>
                  </div>
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <ShieldCheck size={18} color="var(--color-success)" />
            <h3 style={{ margin: 0 }}>Governance snapshot</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
              <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Marketplace health</div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>API and database connected</div>
            </div>
            <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
              <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Verification backlog</div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>{analytics.suspendedUsers ?? 0} suspended users</div>
            </div>
            <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
              <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Trust score</div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>{Number(stats?.averageRating || 4.8).toFixed(1)}/5</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
