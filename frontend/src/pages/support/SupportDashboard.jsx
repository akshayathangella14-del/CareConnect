import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, BriefcaseBusiness, CreditCard, MessageSquareText } from 'lucide-react';
import { Card, Badge } from '@/components';
import { selectCurrentUser } from '@/features/auth';
import { useGetPlatformStatsQuery } from '@/features/stats';

export default function SupportDashboard() {
  const user = useSelector(selectCurrentUser);
  const { data: stats } = useGetPlatformStatsQuery();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'SU';

  const metricCards = [
    { label: 'Open disputes', value: 12, tone: 'primary' },
    { label: 'Refund cases', value: 7, tone: 'warning' },
    { label: 'Invoices pending', value: 18, tone: 'success' },
    { label: 'Avg resolution', value: '2.4d', tone: 'violet' },
  ];

  const tasks = [
    { label: 'Review open disputes', desc: 'Inspect ServiceTrace evidence, customer notes, and provider responses.', path: '/support/disputes' },
    { label: 'Process invoices', desc: 'Support billing questions, payment disputes, and invoice history.', path: '/support/invoices' },
    { label: 'Handle cancellation requests', desc: 'Assess refund eligibility and coordinate provider communication.', path: '/support/disputes' },
  ];

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
            {[
              'Dispute with evidence timeline awaiting customer decision.',
              'Refund request requires invoice and booking verification.',
              'Service completion review case is flagged for a quality follow-up.',
            ].map((item, index) => (
              <div key={item} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
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
            <div style={{ marginTop: 8, fontWeight: 700 }}>3 pending review</div>
          </div>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>Escalations</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>2 need action</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
