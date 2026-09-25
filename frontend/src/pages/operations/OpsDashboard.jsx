import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, ClipboardList, Gauge, ShieldCheck, TimerReset } from 'lucide-react';
import { Card, Badge } from '@/components';
import { selectCurrentUser } from '@/features/auth';
import { useGetPlatformStatsQuery } from '@/features/stats';

export default function OpsDashboard() {
  const user = useSelector(selectCurrentUser);
  const { data: stats } = useGetPlatformStatsQuery();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'OP';

  const metricCards = [
    { label: 'Active bookings', value: stats?.activeBookings ?? 26, tone: 'primary' },
    { label: 'Pending verifications', value: stats?.totalProviders ?? 17, tone: 'warning' },
    { label: 'Completed jobs', value: stats?.completedBookings ?? 143, tone: 'success' },
    { label: 'Avg rating', value: `${Number(stats?.averageRating || 4.8).toFixed(1)}/5`, tone: 'violet' },
  ];

  const queueItems = [
    { label: 'Needs assignment', desc: 'Unassigned service requests that require dispatch attention.', path: '/operations/requests' },
    { label: 'Needs attention', desc: 'Jobs with schedule, service, or quality issues that require follow-up.', path: '/operations/requests' },
    { label: 'Delayed jobs', desc: 'Bookings exceeding SLA or missing provider confirmation.', path: '/operations/requests' },
    { label: 'Verification queue', desc: 'Provider credential and background checks pending review.', path: '/operations/verifications' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', fontWeight: 700 }}>
              {user?.profileImage ? <img src={user.profileImage} alt={user.name || 'Operations manager'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 8 }}>
                <h1 style={{ margin: 0, fontSize: 'var(--font-size-h2)' }}>Operations control</h1>
                <Badge variant="violet">Operations</Badge>
              </div>
              <div style={{ color: 'var(--color-text-secondary)' }}>Monitor service flow, approval queues, and fulfillment health across the platform.</div>
            </div>
          </div>
          <Link to="/operations/requests" style={{ textDecoration: 'none' }}>
            <button style={{ border: 'none', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', borderRadius: 12, padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>Open ops queue</button>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 'var(--space-6)' }}>
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <ClipboardList size={18} color="var(--color-primary)" />
            <h3 style={{ margin: 0 }}>Operational queues</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {queueItems.map((item) => (
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
            <Gauge size={18} color="var(--color-success)" />
            <h3 style={{ margin: 0 }}>Fulfillment health</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
              <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Provider utilization</div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>81%</div>
            </div>
            <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
              <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Delayed jobs</div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>8 requiring action</div>
            </div>
            <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
              <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Escalations</div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>3 high priority</div>
            </div>
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <ShieldCheck size={18} color="var(--color-success)" />
          <h3 style={{ margin: 0 }}>Operational summary</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Average dispatch time</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>42 minutes</div>
          </div>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>SLA compliance</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>94%</div>
          </div>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Quality review backlog</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>5 pending</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
