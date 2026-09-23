import { useState } from 'react';
import { useListDisputesQuery } from '@/features/disputes';
import { Card, Button, StatusBadge, DataTable, EmptyState, Badge } from '@/components';
import { Headphones, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SupportDisputesPage() {
  const { data: disputes = [], isLoading, isFetching } = useListDisputesQuery();

  const columns = [
    {
      header: 'Dispute ID',
      key: 'id',
      render: (d) => (
        <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {d._id.substring(0, 8).toUpperCase()}
        </div>
      ),
    },
    {
      header: 'Booking Ref',
      key: 'booking',
      render: (d) => (
        <Link to={`/bookings/${d.booking?._id}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
          {d.booking?._id?.substring(0, 8).toUpperCase() || 'Unknown'}
        </Link>
      ),
    },
    {
      header: 'Reason',
      key: 'reason',
      render: (d) => d.reason.replace(/_/g, ' '),
    },
    {
      header: 'Status',
      key: 'status',
      render: (d) => (
        <Badge variant={
          d.status === 'OPEN' ? 'error' : 
          d.status === 'INVESTIGATING' ? 'warning' : 'success'
        } size="sm">
          {d.status}
        </Badge>
      ),
    },
    {
      header: 'Action',
      key: 'action',
      render: (d) => (
        <Link to={`/support/disputes/${d._id}`}>
          <Button size="sm" variant="secondary">Review Case</Button>
        </Link>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Headphones size={28} color="var(--color-warning)" /> Dispute Resolution
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Review escalated cases, mediate between parties, and resolve conflicts.</p>
      </div>

      {isLoading ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading disputes...</div>
      ) : disputes.length === 0 ? (
        <EmptyState
          icon={<AlertTriangle size={28} />}
          title="No open disputes"
          description="All support cases have been resolved. Great job!"
        />
      ) : (
        <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity var(--transition-fast)' }}>
          <Card>
            <DataTable
              columns={columns}
              data={disputes}
              keyField="_id"
            />
          </Card>
        </div>
      )}
    </div>
  );
}
