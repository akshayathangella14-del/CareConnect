import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, Sparkles, Wallet } from 'lucide-react';
import { Card, Badge } from '@/components';
import { selectCurrentUser } from '@/features/auth';
import { useListServiceRequestsQuery } from '@/features/serviceRequests';
import { useListNotificationsQuery } from '@/features/notifications';
import { useListBookingsQuery } from '@/features/bookings/bookingApi';
import SmartRequestFlow from '@/components/SmartRequestFlow/SmartRequestFlow';
import styles from './CustomerDashboard.module.css';

export default function CustomerDashboard() {
  const user = useSelector(selectCurrentUser);
  const { data: requests = [] } = useListServiceRequestsQuery();
  const { data: notifications = [] } = useListNotificationsQuery(undefined, { pollingInterval: 5000 });
  const { data: bookings = [] } = useListBookingsQuery();
  
  const activeRequestsCount = requests.filter(r => !['CANCELLED', 'CLOSED', 'COMPLETED'].includes(r.status)).length;
  const pendingQuoteCount = notifications.filter((notification) => notification.type === 'QUOTE' && !notification.isRead).length;

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'CU';

  const metricCards = [
    { label: 'Active requests', value: activeRequestsCount, tone: 'primary' },
    { label: 'Quotes pending', value: pendingQuoteCount, tone: 'warning' },
    { label: 'Upcoming bookings', value: bookings.filter(b => !['COMPLETED', 'CANCELLED'].includes(b.status)).length, tone: 'success' },
    { label: 'Completed jobs', value: bookings.filter(b => b.status === 'COMPLETED').length, tone: 'violet' },
  ];

  const actionItems = [
    { label: 'Submit a new service request', desc: 'Describe the issue and get matched with the right service pros.', path: '/service-requests/new' },
    { label: 'Review provider quotes', desc: 'Compare pricing, timing, and provider reputation before you choose.', path: '/service-requests' },
    { label: 'Track active bookings', desc: 'Follow progress, ETA updates, and evidence snapshots for live jobs.', path: '/bookings' },
    { label: 'Leave feedback', desc: 'Rate completed work and help other customers choose confidently.', path: '/reviews/new' },
  ];

  const nextBooking = bookings
    .filter(b => !['COMPLETED', 'CANCELLED'].includes(b.status))
    .sort((a, b) => new Date(a.scheduledStartAt) - new Date(b.scheduledStartAt))[0];
    
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;
  const activeCount = bookings.filter(b => !['COMPLETED', 'CANCELLED'].includes(b.status)).length;

  return (
    <div className={styles.dashboard}>
      <Card padding="lg">
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeProfile}>
            <div className={styles.welcomeAvatar}>
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name || 'Customer'} />
              ) : (
                initials
              )}
            </div>
            <div className={styles.welcomeText}>
              <div className={styles.welcomeHeader}>
                <h1 className={styles.welcomeTitle}>Welcome back, {user?.name || 'Customer'}!</h1>
                <Badge variant="primary">Customer</Badge>
              </div>
              <div className={styles.welcomeDesc}>Book trusted home care, compare quotes, and track each job from start to finish.</div>
            </div>
          </div>
          <Link to="/service-requests/new" style={{ textDecoration: 'none' }}>
            <button className={styles.requestButton}>Request service</button>
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
      
      <div style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <SmartRequestFlow />
      </div>

      <div className={styles.twoColumnGrid}>
        <Card padding="lg">
          <div className={styles.cardHeader}>
            <CalendarClock size={18} color="var(--color-primary)" />
            <h3 className={styles.cardTitle}>Your service timeline</h3>
          </div>
          <div className={styles.timelineList}>
            {[
              'Request submitted and AI matching is reviewing the job details.',
              'Provider quotes are waiting for your review and comparison.',
              'A matched provider is being confirmed for your preferred schedule.',
            ].map((item, index) => (
              <div key={item} className={styles.timelineItem}>
                <div className={`${styles.timelineNumber} ${index === 0 ? styles.timelineNumberActive : styles.timelineNumberInactive}`}>
                  {index + 1}
                </div>
                <div className={styles.timelineText}>{item}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <div className={styles.cardHeader}>
            <Sparkles size={18} color="var(--color-secondary)" />
            <h3 className={styles.cardTitle}>Quick actions</h3>
          </div>
          <div className={styles.actionList}>
            {actionItems.map((item) => (
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
          <Wallet size={18} color="var(--color-success)" />
          <h3 className={styles.cardTitle}>Recent activity</h3>
        </div>
        <div className={styles.recentActivityGrid}>
          <div className={styles.activityCard}>
            <div className={styles.activityLabel}>Next scheduled service</div>
            <div className={styles.activityValue}>
              {nextBooking ? (nextBooking.serviceRequest?.title || 'Upcoming Service') : 'No upcoming services'}
            </div>
            <div className={styles.activityDesc}>
              {nextBooking ? new Date(nextBooking.scheduledStartAt).toLocaleString() : 'Book a service now'}
            </div>
          </div>
          <div className={styles.activityCard}>
            <div className={styles.activityLabel}>Total bookings</div>
            <div className={styles.activityValue}>{completedCount + activeCount} total jobs</div>
            <div className={styles.activityDesc}>{completedCount} completed, {activeCount} active</div>
          </div>
          <div className={styles.activityCard}>
            <div className={styles.activityLabel}>Pending quotes</div>
            <div className={styles.activityValue}>{pendingQuoteCount} quotes</div>
            <div className={styles.activityDesc}>Awaiting your review</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
