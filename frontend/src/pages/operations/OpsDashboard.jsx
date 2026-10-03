import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, ClipboardList, Gauge, ShieldCheck, TimerReset } from 'lucide-react';
import { Card, Badge } from '@/components';
import { selectCurrentUser } from '@/features/auth';
import { useListServiceRequestsQuery } from '@/features/serviceRequests';
import { useListBookingsQuery } from '@/features/bookings';
import { useListProvidersQuery } from '@/features/providers';
import { useListDisputesQuery } from '@/features/disputes';
import styles from './OpsDashboard.module.css';

export default function OpsDashboard() {
  const user = useSelector(selectCurrentUser);
  const { data: requests = [] } = useListServiceRequestsQuery(undefined, { pollingInterval: 15000 });
  const { data: bookings = [] } = useListBookingsQuery(undefined, { pollingInterval: 15000 });
  const { data: providers = [] } = useListProvidersQuery(undefined, { pollingInterval: 30000 });
  const { data: disputes = [] } = useListDisputesQuery(undefined, { pollingInterval: 15000 });

  const activeBookings = bookings.filter((booking) => !['COMPLETED', 'CANCELLED'].includes(booking.status));
  const delayedBookings = activeBookings.filter((booking) => booking.scheduledEndAt && new Date(booking.scheduledEndAt) < new Date());
  const escalations = disputes.filter((dispute) => !['RESOLVED', 'CLOSED'].includes(dispute.status));

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'OP';

  const metricCards = [
    { label: 'Requests needing dispatch', value: requests.filter((request) => ['MATCHING', 'QUOTING'].includes(request.status)).length, tone: 'primary' },
    { label: 'Pending verifications', value: providers.filter((provider) => provider.verificationStatus === 'PENDING').length, tone: 'warning' },
    { label: 'Active jobs', value: activeBookings.length, tone: 'success' },
    { label: 'Jobs awaiting action', value: activeBookings.filter((booking) => ['PENDING_CONFIRMATION', 'AWAITING_CUSTOMER_CONFIRMATION'].includes(booking.status)).length, tone: 'violet' },
  ];

  const queueItems = [
    { label: 'Needs assignment', desc: 'Unassigned service requests that require dispatch attention.', path: '/operations/requests' },
    { label: 'Needs attention', desc: 'Jobs with schedule, service, or quality issues that require follow-up.', path: '/operations/requests' },
    { label: 'Delayed jobs', desc: 'Bookings exceeding SLA or missing provider confirmation.', path: '/operations/requests' },
    { label: 'Verification queue', desc: 'Provider credential and background checks pending review.', path: '/operations/verifications' },
  ];

  return (
    <div className={styles.dashboard}>
      <Card padding="lg">
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeProfile}>
            <div className={styles.welcomeAvatar}>
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name || 'Operations manager'} />
              ) : (
                initials
              )}
            </div>
            <div className={styles.welcomeText}>
              <div className={styles.welcomeHeader}>
                <h1 className={styles.welcomeTitle}>Operations control</h1>
                <Badge variant="violet">Operations</Badge>
              </div>
              <div className={styles.welcomeDesc}>Monitor service flow, approval queues, and fulfillment health across the platform.</div>
            </div>
          </div>
          <Link to="/operations/requests" className={styles.actionLink}>
            <button className={styles.primaryButton}>Open ops queue</button>
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
            <ClipboardList size={18} color="var(--color-primary)" />
            <h3 className={styles.cardTitle}>Operational queues</h3>
          </div>
          <div className={styles.actionList}>
            {queueItems.map((item) => (
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

        <Card padding="lg">
          <div className={styles.cardHeader}>
            <Gauge size={18} color="var(--color-success)" />
            <h3 className={styles.cardTitle}>Fulfillment health</h3>
          </div>
          <div className={styles.actionList}>
            <div className={styles.activityCard}>
              <div className={styles.activityLabel}>Provider utilization</div>
              <div className={styles.activityValue}>{activeBookings.length ? `${Math.round((activeBookings.filter((booking) => booking.status !== 'PENDING_CONFIRMATION').length / activeBookings.length) * 100)}%` : '0%'}</div>
            </div>
            <div className={styles.activityCard}>
              <div className={styles.activityLabel}>Delayed jobs</div>
              <div className={styles.activityValue}>{delayedBookings.length} requiring action</div>
            </div>
            <div className={styles.activityCard}>
              <div className={styles.activityLabel}>Escalations</div>
              <div className={styles.activityValue}>{escalations.length} open cases</div>
            </div>
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <div className={styles.cardHeader}>
          <ShieldCheck size={18} color="var(--color-success)" />
          <h3 className={styles.cardTitle}>Operational summary</h3>
        </div>
        <div className={styles.recentActivityGrid}>
          <div className={styles.activityCard}>
            <div className={styles.activityLabel}>Average dispatch time</div>
            <div className={styles.activityValue}>{requests.length ? 'Live queue active' : 'No queue data'}</div>
          </div>
          <div className={styles.activityCard}>
            <div className={styles.activityLabel}>SLA compliance</div>
            <div className={styles.activityValue}>{delayedBookings.length ? 'Needs attention' : 'On track'}</div>
          </div>
          <div className={styles.activityCard}>
            <div className={styles.activityLabel}>Quality review backlog</div>
            <div className={styles.activityValue}>{escalations.length} open</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
