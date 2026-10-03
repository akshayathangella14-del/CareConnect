import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, CalendarRange, Star, TrendingUp } from 'lucide-react';
import { Card, Badge } from '@/components';
import { selectCurrentUser } from '@/features/auth';
import { useGetPlatformStatsQuery } from '@/features/stats';
import { useListBookingsQuery } from '@/features/bookings/bookingApi';
import { useListQuotesQuery } from '@/features/quotes/quoteApi';
import styles from './ProviderDashboard.module.css';

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
    <div className={styles.dashboard}>
      <Card padding="lg">
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeProfile}>
            <div className={styles.welcomeAvatar}>
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name || 'Provider'} />
              ) : (
                initials
              )}
            </div>
            <div className={styles.welcomeText}>
              <div className={styles.welcomeHeader}>
                <h1 className={styles.welcomeTitle}>Provider workspace</h1>
                <Badge variant="accent">Service Provider</Badge>
              </div>
              <div className={styles.welcomeDesc}>Manage new job leads, quote responses, and your upcoming schedule with clarity.</div>
            </div>
          </div>
          <Link to="/provider/profile" className={styles.actionLink}>
            <button className={styles.primaryButton}>View profile</button>
          </Link>
        </div>
      </Card>

      <div className={styles.metricsGrid}>
        {metricCards.map((card) => (
          <Card key={card.label} padding="md" className={styles.metricCard}>
            <div className={styles.metricLabel}>{card.label}</div>
            <div className={styles.metricValue}>{card.value}</div>
          </Card>
        ))}
      </div>

      <div className={styles.twoColumnGrid}>
        <Card padding="lg">
          <div className={styles.cardHeader}>
            <CalendarRange size={18} color="var(--color-primary)" />
            <h3 className={styles.cardTitle}>Today’s schedule</h3>
          </div>
          <div className={styles.timelineList}>
            {scheduleItems.map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineNumber}>{index + 1}</div>
                <div className={styles.timelineText}>{item}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <div className={styles.cardHeader}>
            <TrendingUp size={18} color="var(--color-success)" />
            <h3 className={styles.cardTitle}>Priority actions</h3>
          </div>
          <div className={styles.actionList}>
            {actions.map((item) => (
              <Link key={item.label} to={item.path} className={styles.actionLink}>
                <div className={styles.actionItem}>
                  <div>
                    <div className={styles.actionLabel}>{item.label}</div>
                    <div className={styles.actionDesc}>{item.desc}</div>
                  </div>
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <div className={styles.cardHeader}>
          <Star size={18} color="var(--color-warning)" />
          <h3 className={styles.cardTitle}>Service quality summary</h3>
        </div>
        <div className={styles.recentActivityGrid}>
          <div className={styles.activityCard}>
            <div className={styles.activityLabel}>Verified status</div>
            <div className={styles.activityValue}>Background check active</div>
          </div>
          <div className={styles.activityCard}>
            <div className={styles.activityLabel}>Customer trust</div>
            <div className={styles.activityValue}>{Number(stats?.averageRating || 4.8).toFixed(1)}/5 average</div>
          </div>
          <div className={styles.activityCard}>
            <div className={styles.activityLabel}>Quote acceptance</div>
            <div className={styles.activityValue}>{quoteAcceptanceRate}%</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
