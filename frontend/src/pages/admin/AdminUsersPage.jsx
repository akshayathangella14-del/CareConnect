import { Card, Badge } from '@/components';
import { UserRound, ShieldCheck, Activity, Search } from 'lucide-react';

import { EmptyState } from '@/components';

export default function AdminUsersPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>User management</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Review team activity, user status, and role assignments from one place.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        {[
          { label: 'Total users', value: '1,248' },
          { label: 'Active today', value: '742' },
          { label: 'Suspended', value: '12' },
          { label: 'Pending review', value: '9' },
        ].map((item) => (
          <Card key={item.label} padding="md">
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>{item.label}</div>
            <div style={{ fontWeight: 800, fontSize: 'var(--font-size-h3)', marginTop: 10 }}>{item.value}</div>
          </Card>
        ))}
      </div>

      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <UserRound size={18} color="var(--color-primary)" />
            <h3 style={{ margin: 0 }}>Recent users</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', background: 'var(--color-surface-muted)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)' }}>
            <Search size={14} /> Filter by role
          </div>
        </div>

        <EmptyState title="User Management Not Implemented" description="The backend API for platform-wide user management is not yet available." />
      </Card>
    </div>
  );
}
