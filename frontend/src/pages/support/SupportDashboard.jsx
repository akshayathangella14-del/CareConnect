import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, BriefcaseBusiness, CreditCard, MessageSquareText } from 'lucide-react';
import { Card, Badge } from '@/components';
import { selectCurrentUser } from '@/features/auth';
import { useGetPlatformStatsQuery } from '@/features/stats';
import { useListDisputesQuery } from '@/features/disputes/disputeApi';
import { useListInvoicesQuery } from '@/features/invoices/invoiceApi';
import { useListPaymentsQuery } from '@/features/payments/paymentApi';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', fontWeight: 700 }}>
              {user?.profileImage ? <img src={user.profileImage} alt={user.name || 'Support agent'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 8 }}>
                <h1 style={{ margin: 0, fontSize: 'var(--font-size-h2)' }}>Support desk</h1>
                <Badge variant="warning">Support</Badge>
              </div>
              <div style={{ color: 'var(--color-text-secondary)' }}>Resolve disputes, billing issues, and customer escalations with full case context.</div>
            </div>
          </div>
          <Link to="/support/disputes" style={{ textDecoration: 'none' }}>
            <button style={{ border: 'none', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', borderRadius: 12, padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>Open cases</button>
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
            <AlertTriangle size={18} color="var(--color-warning)" />
            <h3 style={{ margin: 0 }}>Case priority queue</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {priorityQueue.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-warning-soft)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, color: 'var(--color-warning)' }}>{index + 1}</div>
                <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <MessageSquareText size={18} color="var(--color-primary)" />
            <h3 style={{ margin: 0 }}>Service tools</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {tasks.map((item) => (
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
          <CreditCard size={18} color="var(--color-success)" />
          <h3 style={{ margin: 0 }}>Customer support snapshot</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Satisfaction</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>{Number(stats?.averageRating || 4.8).toFixed(1)}/5</div>
          </div>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Billing follow-up</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>{pendingInvoicesCount} pending review</div>
          </div>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Escalations</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>{escalationsCount} need action</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
