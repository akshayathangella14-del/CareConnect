import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, Clock3, Sparkles, Wallet } from 'lucide-react';
import { Card, Badge } from '@/components';
import { selectCurrentUser } from '@/features/auth';
import { useGetPlatformStatsQuery } from '@/features/stats';

export default function CustomerDashboard() {
  const user = useSelector(selectCurrentUser);
  const { data: stats } = useGetPlatformStatsQuery();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'CU';

  const metricCards = [
    { label: 'Active requests', value: stats?.totalRequests ?? 18, tone: 'primary' },
    { label: 'Quotes pending', value: stats?.activeBookings ?? 6, tone: 'warning' },
    { label: 'Upcoming bookings', value: stats?.completedBookings ?? 9, tone: 'success' },
    { label: 'Avg rating', value: `${Number(stats?.averageRating || 4.8).toFixed(1)}/5`, tone: 'violet' },
  ];

  const actionItems = [
    { label: 'Submit a new service request', desc: 'Describe the issue and get matched with the right service pros.', path: '/service-requests/new' },
    { label: 'Review provider quotes', desc: 'Compare pricing, timing, and provider reputation before you choose.', path: '/service-requests' },
    { label: 'Track active bookings', desc: 'Follow progress, ETA updates, and evidence snapshots for live jobs.', path: '/bookings' },
    { label: 'Leave feedback', desc: 'Rate completed work and help other customers choose confidently.', path: '/reviews/new' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', fontWeight: 700 }}>
              {user?.profileImage ? <img src={user.profileImage} alt={user.name || 'Customer'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 8 }}>
                <h1 style={{ margin: 0, fontSize: 'var(--font-size-h2)' }}>Welcome back, {user?.name || 'Customer'}!</h1>
                <Badge variant="primary">Customer</Badge>
              </div>
              <div style={{ color: 'var(--color-text-secondary)' }}>Book trusted home care, compare quotes, and track each job from start to finish.</div>
            </div>
          </div>
          <Link to="/service-requests/new" style={{ textDecoration: 'none' }}>
            <button style={{ border: 'none', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', borderRadius: 12, padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>Request service</button>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 'var(--space-6)' }}>
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <CalendarClock size={18} color="var(--color-primary)" />
            <h3 style={{ margin: 0 }}>Your service timeline</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              'Request submitted and AI matching is reviewing the job details.',
              'Provider quotes are waiting for your review and comparison.',
              'A matched provider is being confirmed for your preferred schedule.',
            ].map((item, index) => (
              <div key={item} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: index === 0 ? 'var(--color-primary-soft)' : 'var(--color-surface-muted)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>{index + 1}</div>
                <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <Sparkles size={18} color="var(--color-secondary)" />
            <h3 style={{ margin: 0 }}>Quick actions</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {actionItems.map((item) => (
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
      </div>

      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <Wallet size={18} color="var(--color-success)" />
          <h3 style={{ margin: 0 }}>Recent activity</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Next scheduled service</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>Kitchen appliance check</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>Today · 4:30 PM</div>
          </div>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Saved providers</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>3 trusted professionals</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>Ready for repeat jobs</div>
          </div>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Response time</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>Under 2 hours</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>For most recent quote requests</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
