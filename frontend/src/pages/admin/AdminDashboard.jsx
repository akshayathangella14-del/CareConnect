import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, ShieldCheck, Users, Wrench } from 'lucide-react';
import { Card, Badge } from '@/components';
import { selectCurrentUser } from '@/features/auth';
import { useGetPlatformStatsQuery } from '@/features/stats';
import { useListProvidersQuery } from '@/features/providers';
import { useGetAnalyticsSummaryQuery } from '@/features/analytics';
import styles from './AdminDashboard.module.css';

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
    <div className={styles.dashboard}>
      <Card padding="lg">
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeProfile}>
            <div className={styles.welcomeAvatar}>
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name || 'Admin'} />
              ) : (
                initials
              )}
            </div>
            <div className={styles.welcomeText}>
              <div className={styles.welcomeHeader}>
                <h1 className={styles.welcomeTitle}>Platform administration</h1>
                <Badge variant="error">Admin</Badge>
              </div>
              <div className={styles.welcomeDesc}>Monitor the marketplace, system health, and operational quality across all roles.</div>
            </div>
          </div>
          <Link to="/admin/categories" className={styles.actionLink}>
            <button className={styles.primaryButton}>Manage platform</button>
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
            <Wrench size={18} color="var(--color-primary)" />
            <h3 className={styles.cardTitle}>System controls</h3>
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

        <Card padding="lg">
          <div className={styles.cardHeader}>
            <ShieldCheck size={18} color="var(--color-success)" />
            <h3 className={styles.cardTitle}>Governance snapshot</h3>
          </div>
          <div className={styles.actionList}>
            <div className={styles.activityCard}>
              <div className={styles.activityLabel}>Marketplace health</div>
              <div className={styles.activityValue}>API and database connected</div>
            </div>
            <div className={styles.activityCard}>
              <div className={styles.activityLabel}>Verification backlog</div>
              <div className={styles.activityValue}>{analytics.suspendedUsers ?? 0} suspended users</div>
            </div>
            <div className={styles.activityCard}>
              <div className={styles.activityLabel}>Trust score</div>
              <div className={styles.activityValue}>{Number(stats?.averageRating || 0).toFixed(1)}/5</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
