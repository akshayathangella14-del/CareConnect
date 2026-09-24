import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useListServiceRequestsQuery } from '@/features/serviceRequests';
import { Card, Button, StatusBadge, DataTable, EmptyState, Alert } from '@/components';
import { Plus, FileText, CalendarClock } from 'lucide-react';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useListServiceRequestsQuery } from '@/features/serviceRequests';
import { Card, Button, StatusBadge, DataTable, EmptyState, Alert } from '@/components';
import { Plus, FileText, CalendarClock } from 'lucide-react';
import styles from './ServiceRequestsPage.module.css';

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
          <div className={styles.requestTitle}>{req.title}</div>
          <div className={styles.requestDate}>
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
        <span className={`${styles.urgency} ${styles[`urgency--${req.urgency?.toLowerCase() || 'normal'}`]}`}>
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

      {error && (
        <Alert variant="error" title="Could not load service requests">
          {error.data?.error?.message || 'An unexpected error occurred. Please try again.'}
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
        <div className={styles.tableContainer} style={{ opacity: isFetching ? 0.6 : 1 }}>
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
