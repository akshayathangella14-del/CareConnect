import { Card, Badge } from '@/components';
import { Tags, Pencil, Plus } from 'lucide-react';

import { useListPricingRulesQuery } from '@/features/pricing';
import { DataTable, EmptyState } from '@/components';

export default function AdminPricingPage() {
  const { data: pricingRules = [], isLoading } = useListPricingRulesQuery();

  const columns = [
    {
      header: 'Category',
      key: 'category',
      render: (rule) => <div style={{ fontWeight: 700 }}>{rule.category?.name || 'Unknown'}</div>,
    },
    {
      header: 'Pricing Logic',
      key: 'pricing',
      render: (rule) => <div>Base: ₹{rule.basePrice || 0} / hr</div>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (rule) => <Badge variant={rule.isActive ? 'success' : 'warning'}>{rule.isActive ? 'Live' : 'Draft'}</Badge>,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: () => (
        <button type="button" style={{ border: 'none', background: 'transparent', color: 'var(--color-primary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Pencil size={14} /> Edit
        </button>
      )
    },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>Pricing rules</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Manage service pricing logic, emergency multipliers, and category-specific policies.</p>
      </div>

      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Tags size={18} color="var(--color-primary)" />
            <h3 style={{ margin: 0 }}>Pricing catalogue</h3>
          </div>
          <button type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', border: 'none', borderRadius: 12, background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>
            <Plus size={16} /> Create rule
          </button>
        </div>

        {isLoading ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading pricing rules...</div>
        ) : pricingRules.length === 0 ? (
          <EmptyState title="No pricing rules" description="Create a pricing rule to govern category rates." />
        ) : (
          <DataTable columns={columns} data={pricingRules} keyField="_id" />
        )}
      </Card>
    </div>
  );
}
