import { Card } from '@/components';
import { BarChart3, TrendingUp, Users, IndianRupee } from 'lucide-react';
import { useGetAnalyticsSummaryQuery } from '@/features/analytics';

export default function AdminAnalyticsPage() {
  const { data: analytics = {} } = useGetAnalyticsSummaryQuery(undefined, { pollingInterval: 30000 });
  const advanced = analytics?.advanced || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>Platform analytics</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Track demand, conversion, customer trust, and revenue signals across the marketplace.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        {[
          { label: 'Quote acceptance', value: `${advanced.quoteAcceptanceRate || 0}%` },
          { label: 'Booking conversion', value: `${advanced.bookingConversionRate || 0}%` },
          { label: 'Customer rating', value: `${(advanced.averageRating || 0).toFixed(1)}/5` },
          { label: 'Revenue trend', value: advanced.revenueTrend || '0%' },
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
            {(advanced.categoryDemand || []).length > 0 ? (
              advanced.categoryDemand.map(cat => (
                <li key={cat.name}>{cat.name}: {cat.percentage}%</li>
              ))
            ) : (
              <li>No data yet</li>
            )}
          </ul>
        </Card>

        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}><Users size={18} color="var(--color-success)" /> <h3 style={{ margin: 0 }}>Customer satisfaction</h3></div>
          <ul style={{ color: 'var(--color-text-secondary)', margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li>Review completion: {advanced.satisfaction?.reviewCompletionRate || 0}%</li>
            <li>Repeat bookings: {advanced.satisfaction?.repeatBookingRate || 0}%</li>
            <li>Dispute rate: {advanced.satisfaction?.disputeRate || 0}%</li>
          </ul>
        </Card>

        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}><IndianRupee size={18} color="var(--color-warning)" /> <h3 style={{ margin: 0 }}>Revenue summary</h3></div>
          <ul style={{ color: 'var(--color-text-secondary)', margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li>Gross bookings: ₹ {Number(advanced.revenue?.grossBookings || 0).toLocaleString('en-IN')}</li>
            <li>Commissioned revenue: ₹ {Number(advanced.revenue?.commissionedRevenue || 0).toLocaleString('en-IN')}</li>
            <li>Refunds rate: {advanced.revenue?.refundsRate || 0}%</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
