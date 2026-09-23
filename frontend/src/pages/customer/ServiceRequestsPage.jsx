import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useListServiceRequestsQuery } from '@/features/serviceRequests';
import { Card, Button, StatusBadge, DataTable, EmptyState, Alert } from '@/components';
import { Plus, FileText, CalendarClock } from 'lucide-react';

export default function ServiceRequestsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  
  // Use query params to filter by status if provided
  const queryParams = statusFilter ? { status: statusFilter } : {};
  const { data: requests = [], isLoading, isFetching, error } = useListServiceRequestsQuery(queryParams);

  const columns = [
    {
      header: 'Request',
      key: 'title',
      render: (req) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{req.title}</div>
          <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
            Created {new Date(req.createdAt).toLocaleDateString()}
          </div>
        </div>
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
        <span style={{ 
          color: req.urgency === 'EMERGENCY' ? 'var(--color-error)' : 
                 req.urgency === 'HIGH' ? 'var(--color-warning)' : 'var(--color-text-secondary)'
        }}>
          {req.urgency}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (req) => <StatusBadge status={req.status} />,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>My Service Requests</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Track and manage your ongoing and past requests.</p>
        </div>
        <Link to="/service-requests/new">
          <Button leftIcon={<Plus size={18} />}>New Request</Button>
        </Link>
      </div>

      {error && (
        <Alert variant="error" title="Could not load service requests">
          {error.data?.error?.message || 'An unexpected error occurred. Please try again.'}
        </Alert>
      )}

      {/* Basic Filter Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--space-2)', overflowX: 'auto' }}>
        {['', 'DRAFT', 'MATCHING', 'QUOTING', 'PROVIDER_SELECTED'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              background: 'none',
              border: 'none',
              padding: 'var(--space-2) var(--space-4)',
              cursor: 'pointer',
              color: statusFilter === status ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: statusFilter === status ? 600 : 400,
              borderBottom: statusFilter === status ? '2px solid var(--color-primary)' : '2px solid transparent',
              marginBottom: '-9px', // Pull down over the border
              whiteSpace: 'nowrap'
            }}
          >
            {status ? status.replace('_', ' ') : 'All Requests'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading requests...</div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No service requests found"
          description={statusFilter ? `You have no requests with status: ${statusFilter}` : "You haven't created any service requests yet."}
          action={
            <Link to="/service-requests/new">
              <Button variant="secondary">Create your first request</Button>
            </Link>
          }
        />
      ) : (
        <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity var(--transition-fast)' }}>
          <DataTable
            columns={columns}
            data={requests}
            keyField="_id"
            onRowClick={(row) => navigate(`/service-requests/${row._id}`)}
          />
        </div>
      )}
    </div>
  );
}
