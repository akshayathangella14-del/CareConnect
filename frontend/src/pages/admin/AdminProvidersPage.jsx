import { Card, Badge } from '@/components';
import { ShieldCheck, Star, BriefcaseBusiness } from 'lucide-react';
import { useListProvidersQuery } from '@/features/providers';
import { DataTable, EmptyState } from '@/components';

export default function AdminProvidersPage() {
  const { data: providers = [], isLoading } = useListProvidersQuery();
  
  const verifiedCount = providers.filter(p => p.verificationStatus === 'VERIFIED').length;
  const pendingCount = providers.filter(p => p.verificationStatus === 'PENDING').length;
  
  const avgRatingRaw = providers.reduce((acc, p) => acc + (p.ratingSummary?.averageRating || 0), 0) / (providers.length || 1);
  const avgRating = providers.length ? avgRatingRaw.toFixed(1) : 'N/A';

  const columns = [
    {
      header: 'Provider Name',
      key: 'name',
      render: (p) => <div style={{ fontWeight: 700 }}>{p.displayName}</div>,
    },
    {
      header: 'Rating',
      key: 'rating',
      render: (p) => <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Star size={14} color="var(--color-warning)" /> {p.ratingSummary?.averageRating || 0}</div>,
    },
    {
      header: 'Status',
      key: 'verification',
      render: (p) => <Badge variant={p.verificationStatus === 'VERIFIED' ? 'success' : 'warning'}>{p.verificationStatus}</Badge>,
    },
    {
      header: 'Experience',
      key: 'jobs',
      render: (p) => <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><ShieldCheck size={14} color="var(--color-success)" /> {p.experienceYears || 0} yrs</div>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>Provider management</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Track verification status, service quality, and operational readiness across all providers.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        {[
          { label: 'Verified providers', value: verifiedCount },
          { label: 'Pending verification', value: pendingCount },
          { label: 'Avg rating', value: avgRating },
        ].map((item) => (
          <Card key={item.label} padding="md">
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>{item.label}</div>
            <div style={{ fontWeight: 800, fontSize: 'var(--font-size-h3)', marginTop: 10 }}>{item.value}</div>
          </Card>
        ))}
      </div>

      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <BriefcaseBusiness size={18} color="var(--color-primary)" />
          <h3 style={{ margin: 0 }}>Provider roster</h3>
        </div>
        
        {isLoading ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading providers...</div>
        ) : providers.length === 0 ? (
          <EmptyState title="No providers found" description="There are no providers in the system yet." />
        ) : (
          <DataTable columns={columns} data={providers} keyField="_id" />
        )}
      </Card>
    </div>
  );
}
