import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useListServiceRequestsQuery } from '@/features/serviceRequests';
import { Card, Button, StatusBadge, DataTable, EmptyState, Alert } from '@/components';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Plus, FileText, CalendarClock } from 'lucide-react';
import styles from './ServiceRequestsPage.module.css';

export default function ServiceRequestsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data: requests = [], isLoading, isFetching, error } = useListServiceRequestsQuery();
  const safeRequests = Array.isArray(requests) ? requests.filter(Boolean) : [];
  const visibleRequests = statusFilter
    ? safeRequests.filter((request) => request.status === statusFilter)
    : safeRequests;

  const errorMessage = error?.data?.error?.message
    || error?.data?.message
    || error?.error
    || 'An unexpected error occurred. Please try again.';

  const columns = [
    {
      header: 'Request',
      key: 'title',
      render: (req) => (
        <div>
          <div className={styles.requestTitle}>{req?.title || 'Untitled service request'}</div>
          <div className={styles.requestDate}>
            Created {req?.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (req) => req?.category?.name || req?.service?.name || 'Not categorized',
    },
    {
      header: 'Urgency',
      key: 'urgency',
      render: (req) => {
        const urgency = req?.urgency || 'NORMAL';
        const urgencyClass = urgency.toLowerCase();
        const urgencyStyle = styles[`urgency--${urgencyClass}`] || styles['urgency--normal'];
        return (
          <span className={`${styles.urgency} ${urgencyStyle}`}>
            {urgency}
          </span>
        );
      },
    },
    {
      header: 'Status',
      key: 'status',
      render: (req) => <StatusBadge status={req?.status || 'DRAFT'} />,
    },
  ];

  return (
    <ErrorBoundary>
      <div className={`${styles.serviceRequests} animate-fade-in-up`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>My Service Requests</h1>
          <p>Track and manage your ongoing and past requests.</p>
        </div>
        <Link to="/service-requests/new">
          <Button variant="primary" leftIcon={<Plus size={18} />}>New Request</Button>
        </Link>
      </div>

      <Card padding="md" style={{ backgroundColor: 'var(--color-surface-muted)' }}>
        <h3 style={{ margin: 0, marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-body)' }}>How to book a service</h3>
        <ol style={{ margin: 0, paddingLeft: 'var(--space-5)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)', lineHeight: 1.8 }}>
          <li>Create and submit a service request for AI matching.</li>
          <li>Wait for verified providers to submit quotes.</li>
          <li>Open a request to compare provider pricing, timing, and scope.</li>
          <li>Accept the quote that best fits your needs.</li>
          <li>Track the booking, confirm completion, pay the invoice, and leave a review.</li>
        </ol>
      </Card>

      {error && (
        <Alert variant="error" title="Could not load service requests">
          {errorMessage}
        </Alert>
      )}

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        {['', 'DRAFT', 'MATCHING', 'QUOTING', 'PROVIDER_SELECTED'].map((status, index) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`${styles.filterTab} ${statusFilter === status ? styles['filterTab--active'] : ''} animate-delay-${index * 50}`}
          >
            {status ? status.replace('_', ' ') : 'All Requests'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading requests...</div>
      ) : visibleRequests.length === 0 ? (
        <EmptyState
          icon={<FileText size={28} />}
          title="No service requests found"
          description={statusFilter ? `You have no requests with status: ${statusFilter}` : "You haven't created any service requests yet."}
          action={
            <Link to="/service-requests/new">
              <Button variant="secondary">Create your first request</Button>
            </Link>
          }
        />
      ) : (
        <div className={styles.tableContainer} style={{ opacity: isFetching ? 0.6 : 1 }}>
          <DataTable
            columns={columns}
            data={visibleRequests}
            keyField="_id"
            onRowClick={(row) => navigate(`/service-requests/${row._id}`)}
          />
        </div>
      )}
      </div>
    </ErrorBoundary>
  );
}
