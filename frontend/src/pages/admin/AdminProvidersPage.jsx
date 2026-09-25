import { Card, Badge } from '@/components';
import { ShieldCheck, Star, BriefcaseBusiness } from 'lucide-react';

const providers = [
  { name: 'CareCraft Home Services', rating: '4.9', verification: 'Verified', jobs: '132' },
  { name: 'PrimeFix Solutions', rating: '4.7', verification: 'Under review', jobs: '81' },
  { name: 'UrbanCare Maintenance', rating: '4.8', verification: 'Verified', jobs: '93' },
];

export default function AdminProvidersPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>Provider management</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Track verification status, service quality, and operational readiness across all providers.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        {[
          { label: 'Verified providers', value: '342' },
          { label: 'Pending verification', value: '19' },
          { label: 'Avg rating', value: '4.8/5' },
          { label: 'Completion rate', value: '92%' },
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {providers.map((provider) => (
            <div key={provider.name} style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 1fr 0.8fr', gap: 'var(--space-3)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
              <div style={{ fontWeight: 700 }}>{provider.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Star size={14} color="var(--color-warning)" /> {provider.rating}</div>
              <div><Badge variant={provider.verification === 'Verified' ? 'success' : 'warning'}>{provider.verification}</Badge></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><ShieldCheck size={14} color="var(--color-success)" /> {provider.jobs} jobs</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
