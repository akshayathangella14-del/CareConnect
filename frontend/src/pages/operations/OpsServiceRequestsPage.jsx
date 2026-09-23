import { useState } from 'react';
import { useListServiceRequestsQuery } from '@/features/serviceRequests';
import { Card, StatusBadge, DataTable, EmptyState, Badge } from '@/components';
import { Activity } from 'lucide-react';

export default function OpsServiceRequestsPage() {
  const { data: requests = [], isLoading, isFetching } = useListServiceRequestsQuery();

  const columns = [
    {
      header: 'Request ID',
      key: 'id',
      render: (req) => (
        <span style={{ fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>
          {req._id.substring(0, 8)}
        </span>
      ),
    },
    {
      header: 'Customer',
      key: 'customer',
      render: (req) => req.customer?.name || 'Unknown',
    },
    {
      header: 'Title',
      key: 'title',
      render: (req) => (
        <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{req.title}</div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (req) => req.category?.name || 'Unknown',
    },
    {
      header: 'Urgency',
      key: 'urgency',
      render: (req) => (
        <Badge variant={
          req.urgency === 'EMERGENCY' ? 'error' : 
          req.urgency === 'HIGH' ? 'warning' : 'neutral'
        } size="sm">
          {req.urgency}
        </Badge>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (req) => <StatusBadge status={req.status} />,
    },
    {
      header: 'Created',
      key: 'createdAt',
      render: (req) => new Date(req.createdAt).toLocaleDateString(),
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Activity size={28} color="var(--color-violet)" /> Global Request Monitor
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>View and monitor all active service requests across the platform.</p>
      </div>

      {isLoading ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading requests...</div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={<Activity size={28} />}
          title="No requests found"
          description="There are currently no service requests in the system."
        />
      ) : (
        <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity var(--transition-fast)' }}>
          <Card>
            <DataTable
              columns={columns}
              data={requests}
              keyField="_id"
            />
          </Card>
        </div>
      )}
    </div>
  );
}
