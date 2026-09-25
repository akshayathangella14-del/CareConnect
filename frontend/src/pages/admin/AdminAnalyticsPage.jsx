import { Card } from '@/components';
import { BarChart3, TrendingUp, Users, CircleDollarSign } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>Platform analytics</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Track demand, conversion, customer trust, and revenue signals across the marketplace.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        {[
          { label: 'Quote acceptance', value: '74%' },
          { label: 'Booking conversion', value: '53%' },
          { label: 'Customer rating', value: '4.8/5' },
          { label: 'Revenue trend', value: '+12.4%' },
        ].map((item) => (
          <Card key={item.label} padding="md">
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>{item.label}</div>
            <div style={{ fontWeight: 800, fontSize: 'var(--font-size-h3)', marginTop: 10 }}>{item.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}><TrendingUp size={18} color="var(--color-primary)" /> <h3 style={{ margin: 0 }}>Demand by category</h3></div>
          <ul style={{ color: 'var(--color-text-secondary)', margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li>Home maintenance: 31%</li>
            <li>Electrical: 22%</li>
            <li>Cleaning: 18%</li>
            <li>Plumbing: 16%</li>
          </ul>
        </Card>

        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}><Users size={18} color="var(--color-success)" /> <h3 style={{ margin: 0 }}>Customer satisfaction</h3></div>
          <ul style={{ color: 'var(--color-text-secondary)', margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li>Review completion: 82%</li>
            <li>Repeat bookings: 29%</li>
            <li>Dispute rate: 1.9%</li>
          </ul>
        </Card>

        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}><CircleDollarSign size={18} color="var(--color-warning)" /> <h3 style={{ margin: 0 }}>Revenue summary</h3></div>
          <ul style={{ color: 'var(--color-text-secondary)', margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li>Gross bookings: ₹ 9.8L</li>
            <li>Commissioned revenue: ₹ 1.6L</li>
            <li>Refunds: 2.3%</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
