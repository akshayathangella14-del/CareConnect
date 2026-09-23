import { useState } from 'react';
import { useListAuditLogsQuery } from '@/features/audit';
import { Card, DataTable, EmptyState, Badge } from '@/components';
import { Shield } from 'lucide-react';

export default function AdminAuditPage() {
  const { data: logs = [], isLoading } = useListAuditLogsQuery();

  const columns = [
    {
      header: 'Timestamp',
      key: 'timestamp',
      render: (log) => new Date(log.createdAt).toLocaleString(),
    },
    {
      header: 'Actor',
      key: 'actor',
      render: (log) => log.actor?.name || 'System',
    },
    {
      header: 'Action',
      key: 'action',
      render: (log) => log.action,
    },
    {
      header: 'Resource Type',
      key: 'resourceType',
      render: (log) => log.resourceType,
    },
    {
      header: 'Resource ID',
      key: 'resourceId',
      render: (log) => log.resourceId?.substring(0, 8) || '-',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Shield size={28} color="var(--color-error)" /> System Audit Logs
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Track all system actions and security events.
        </p>
      </div>

      {isLoading ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading audit logs...</div>
      ) : logs.length === 0 ? (
        <EmptyState
          icon={<Shield size={28} />}
          title="No audit logs"
          description="System actions will appear here."
        />
      ) : (
        <Card>
          <DataTable
            columns={columns}
            data={logs}
            keyField="_id"
          />
        </Card>
      )}
    </div>
  );
}
