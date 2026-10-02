import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, CalendarRange, Star, TrendingUp } from 'lucide-react';
import { Card, Badge } from '@/components';
import { selectCurrentUser } from '@/features/auth';
import { useGetPlatformStatsQuery } from '@/features/stats';
import { useListBookingsQuery } from '@/features/bookings/bookingApi';
import { useListQuotesQuery } from '@/features/quotes/quoteApi';

export default function ProviderDashboard() {
  const user = useSelector(selectCurrentUser);
  const { data: stats } = useGetPlatformStatsQuery();
  const { data: bookings = [] } = useListBookingsQuery();
  const { data: quotes = [] } = useListQuotesQuery();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'PR';

  // Metrics
  const pendingJobs = bookings.filter(b => !['COMPLETED', 'CANCELLED'].includes(b.status)).length;
  const quotesSent = quotes.filter(q => q.status !== 'DRAFT').length;
  const quotesAccepted = quotes.filter(q => q.status === 'ACCEPTED').length;
  const quoteAcceptanceRate = quotesSent > 0 ? Math.round((quotesAccepted / quotesSent) * 100) : 0;
  
  // Real schedule
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysBookings = bookings
    .filter(b => !['COMPLETED', 'CANCELLED'].includes(b.status))
    .filter(b => {
      const start = new Date(b.scheduledStartAt);
      return start >= today && start < tomorrow;
    })
    .sort((a, b) => new Date(a.scheduledStartAt) - new Date(b.scheduledStartAt));

  const scheduleItems = todaysBookings.length > 0 
    ? todaysBookings.map(b => `${b.status.replace(/_/g, ' ')} at ${new Date(b.scheduledStartAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} for booking #${b._id.slice(-6)}`)
    : ['No services scheduled for today.'];

  const metricCards = [
    { label: 'Pending jobs', value: pendingJobs, tone: 'primary' },
    { label: 'Quotes sent', value: quotesSent, tone: 'warning' },
    { label: 'Quote acceptance', value: `${quoteAcceptanceRate}%`, tone: 'success' },
    { label: 'Avg rating', value: `${Number(stats?.averageRating || 4.8).toFixed(1)}/5`, tone: 'violet' },
  ];

  const actions = [
    { label: 'Browse matched requests', desc: 'Find requests aligned to your current skills and service area.', path: '/provider/matches' },
    { label: 'Submit a quote', desc: 'Respond with pricing, time, and detailed scope recommendations.', path: '/provider/quotes' },
    { label: 'Manage bookings', desc: 'Track scheduled work, progress, and customer confirmations.', path: '/provider/bookings' },
    { label: 'Update availability', desc: 'Publish your working hours and service windows.', path: '/provider/availability' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', fontWeight: 700 }}>
              {user?.profileImage ? <img src={user.profileImage} alt={user.name || 'Provider'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 8 }}>
                <h1 style={{ margin: 0, fontSize: 'var(--font-size-h2)' }}>Provider workspace</h1>
                <Badge variant="accent">Service Provider</Badge>
              </div>
              <div style={{ color: 'var(--color-text-secondary)' }}>Manage new job leads, quote responses, and your upcoming schedule with clarity.</div>
            </div>
          </div>
          <Link to="/provider/profile" style={{ textDecoration: 'none' }}>
            <button style={{ border: 'none', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', borderRadius: 12, padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>View profile</button>
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
            <CalendarRange size={18} color="var(--color-primary)" />
            <h3 style={{ margin: 0 }}>Today’s schedule</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {scheduleItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-primary-soft)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>{index + 1}</div>
                <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <TrendingUp size={18} color="var(--color-success)" />
            <h3 style={{ margin: 0 }}>Priority actions</h3>
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
      </div>

      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <Star size={18} color="var(--color-warning)" />
          <h3 style={{ margin: 0 }}>Service quality summary</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Verified status</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>Background check active</div>
          </div>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Customer trust</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>{Number(stats?.averageRating || 4.8).toFixed(1)}/5 average</div>
          </div>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Quote acceptance</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>{quoteAcceptanceRate}%</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
