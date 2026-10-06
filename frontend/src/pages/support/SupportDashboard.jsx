import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, BriefcaseBusiness, CreditCard, MessageSquareText } from 'lucide-react';
import { Card, Badge } from '@/components';
import { selectCurrentUser } from '@/features/auth';
import { useGetPlatformStatsQuery } from '@/features/stats';
import { useListDisputesQuery } from '@/features/disputes/disputeApi';
import { useListInvoicesQuery } from '@/features/invoices/invoiceApi';
import { useListPaymentsQuery } from '@/features/payments/paymentApi';
import styles from './SupportDashboard.module.css';

export default function SupportDashboard() {
  const user = useSelector(selectCurrentUser);
  const { data: stats } = useGetPlatformStatsQuery();
  const { data: disputes = [] } = useListDisputesQuery();
  const { data: invoices = [] } = useListInvoicesQuery();
  const { data: payments = [] } = useListPaymentsQuery();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'SU';

  const activeDisputes = disputes.filter(d => !['RESOLVED', 'REJECTED'].includes(d.status));
  const openDisputesCount = activeDisputes.length;
  
  const refundCasesCount = payments.filter(p => ['REFUNDED', 'REFUND_PENDING'].includes(p.status)).length;
  const pendingInvoicesCount = invoices.filter(i => i.status === 'UNPAID').length;
  
  // Calculate average resolution time
  const resolvedDisputes = disputes.filter(d => d.status === 'RESOLVED' && d.resolvedAt);
  let avgResolution = '0d';
  if (resolvedDisputes.length > 0) {
    const totalMs = resolvedDisputes.reduce((acc, d) => {
      return acc + (new Date(d.resolvedAt).getTime() - new Date(d.createdAt).getTime());
    }, 0);
    const avgDays = totalMs / resolvedDisputes.length / (1000 * 60 * 60 * 24);
    avgResolution = `${avgDays.toFixed(1)}d`;
  }

  const metricCards = [
    { label: 'Open disputes', value: openDisputesCount, tone: 'primary' },
    { label: 'Refund cases', value: refundCasesCount, tone: 'warning' },
    { label: 'Invoices pending', value: pendingInvoicesCount, tone: 'success' },
    { label: 'Avg resolution', value: avgResolution, tone: 'violet' },
  ];

  const tasks = [
    { label: 'Review open disputes', desc: 'Inspect ServiceTrace evidence, customer notes, and provider responses.', path: '/support/disputes' },
    { label: 'Process invoices', desc: 'Support billing questions, payment disputes, and invoice history.', path: '/support/invoices' },
    { label: 'Handle cancellation requests', desc: 'Assess refund eligibility and coordinate provider communication.', path: '/support/disputes' },
  ];

  const priorityQueue = activeDisputes.slice(0, 3).map(d => 
    `Dispute [${d.reason}] - ${d.status.replace(/_/g, ' ')} for booking #${d.booking?.slice(-6) || d.booking}`
  );

  if (priorityQueue.length === 0) {
    priorityQueue.push('No active disputes requiring immediate attention.');
  }

  const escalationsCount = disputes.filter(d => d.status === 'ESCALATED').length;

  return (
    <div className={styles.dashboard}>
      <Card padding="lg">
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeProfile}>
            <div className={styles.welcomeAvatar}>
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name || 'Support agent'} />
              ) : (
                initials
              )}
            </div>
            <div className={styles.welcomeText}>
              <div className={styles.welcomeHeader}>
                <h1 className={styles.welcomeTitle}>Support desk</h1>
                <Badge variant="warning">Support</Badge>
              </div>
              <div className={styles.welcomeDesc}>Resolve disputes, billing issues, and customer escalations with full case context.</div>
            </div>
          </div>
          <Link to="/support/disputes" className={styles.actionLink}>
            <button className={styles.primaryButton}>Open cases</button>
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
            <AlertTriangle size={18} color="var(--color-warning)" />
            <h3 className={styles.cardTitle}>Case priority queue</h3>
          </div>
          <div className={styles.timelineList}>
            {priorityQueue.map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineNumber}>{index + 1}</div>
                <div className={styles.timelineText}>{item}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <div className={styles.cardHeader}>
            <MessageSquareText size={18} color="var(--color-primary)" />
            <h3 className={styles.cardTitle}>Service tools</h3>
          </div>
          <div className={styles.actionList}>
            {tasks.map((item) => (
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
          <CreditCard size={18} color="var(--color-success)" />
          <h3 className={styles.cardTitle}>Customer support snapshot</h3>
        </div>
        <div className={styles.recentActivityGrid}>
          <div className={styles.activityCard}>
            <div className={styles.activityLabel}>Satisfaction</div>
            <div className={styles.activityValue}>{stats?.averageRating ? `${Number(stats.averageRating).toFixed(1)}/5` : 'No ratings yet'}</div>
          </div>
          <div className={styles.activityCard}>
            <div className={styles.activityLabel}>Billing follow-up</div>
            <div className={styles.activityValue}>{pendingInvoicesCount} pending review</div>
          </div>
          <div className={styles.activityCard}>
            <div className={styles.activityLabel}>Escalations</div>
            <div className={styles.activityValue}>{escalationsCount} need action</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
