import { Card, Badge } from '@/components';
import { Tags, Pencil, Plus } from 'lucide-react';

const pricingRules = [
  { category: 'Plumbing', pricing: 'Base + emergency multiplier', status: 'Live' },
  { category: 'Electrical', pricing: 'Time-and-material', status: 'Live' },
  { category: 'Cleaning', pricing: 'Flat-rate visit pricing', status: 'Draft' },
  { category: 'Appliance repair', pricing: 'Skill-based surcharge', status: 'Live' },
];

export default function AdminPricingPage() {
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {pricingRules.map((rule) => (
            <div key={rule.category} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 0.7fr auto', gap: 'var(--space-3)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
              <div style={{ fontWeight: 700 }}>{rule.category}</div>
              <div>{rule.pricing}</div>
              <div><Badge variant={rule.status === 'Live' ? 'success' : 'warning'}>{rule.status}</Badge></div>
              <button type="button" style={{ border: 'none', background: 'transparent', color: 'var(--color-primary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Pencil size={14} /> Edit
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
