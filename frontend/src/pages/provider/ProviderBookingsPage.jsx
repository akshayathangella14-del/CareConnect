import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useListBookingsQuery } from '@/features/bookings';
import { Card, Button, StatusBadge, DataTable, EmptyState, Alert } from '@/components';
import { CalendarClock, MapPin } from 'lucide-react';

export default function ProviderBookingsPage() {
  const navigate = useNavigate();
  const { data: bookings = [], isLoading, isFetching, error } = useListBookingsQuery(undefined, {
    pollingInterval: 10000,
    refetchOnFocus: true,
  });

  const errorMessage = error?.data?.error?.message
    || error?.data?.message
    || error?.error
    || 'Unable to load your bookings right now.';

  const columns = [
    {
      header: 'Job Scope',
      key: 'service',
      render: (booking) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {booking.scopeSnapshot?.summary || 'Service Booking'}
          </div>
          <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
            Booking #{booking._id.substring(0, 8).toUpperCase()}
          </div>
        </div>
      ),
    },
    {
      header: 'Customer',
      key: 'customer',
      render: (booking) => (
        <div>
          <div style={{ fontWeight: 500 }}>{booking.customerSnapshot?.name || 'Customer'}</div>
          <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
            <MapPin size={12} style={{ display: 'inline', marginRight: 2 }} />
            {booking.serviceRequest?.location?.city || 'Location unavailable'}
          </div>
        </div>
      ),
    },
    {
      header: 'Schedule',
      key: 'schedule',
      render: (booking) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-text-secondary)' }}>
          <CalendarClock size={14} />
          {new Date(booking.scheduledStartAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (booking) => <StatusBadge status={booking.status} />,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>My Active Jobs</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Manage your upcoming, active, and completed service bookings.</p>
      </div>

      <Card padding="md" style={{ backgroundColor: 'var(--color-surface-muted)' }}>
        <h3 style={{ margin: 0, marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-body)' }}>Provider workflow</h3>
        <ol style={{ margin: 0, paddingLeft: 'var(--space-5)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)', lineHeight: 1.8 }}>
          <li>Open Matched Requests and choose work that fits your skills and service area.</li>
          <li>Submit a quote and wait for the customer to accept it.</li>
          <li>Open the new pending booking and confirm the job.</li>
          <li>Mark En Route, Arrived, and Start Work as the job progresses.</li>
          <li>Upload before or after evidence, then Request Completion.</li>
          <li>The customer confirms completion, then receives the invoice.</li>
        </ol>
      </Card>

      {error && <Alert variant="error" title="Could not load bookings">{errorMessage}</Alert>}

      {isLoading ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={<CalendarClock size={28} />}
          title="No active jobs"
          description="You don't have any bookings yet. Submit quotes to matched requests to win jobs."
          action={
            <Link to="/provider/matches">
              <Button variant="primary">Find Opportunities</Button>
            </Link>
          }
        />
      ) : (
        <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity var(--transition-fast)' }}>
          <DataTable
            columns={columns}
            data={bookings}
            keyField="_id"
            onRowClick={(row) => navigate(`/provider/bookings/${row._id}`)}
          />
        </div>
      )}
    </div>
  );
}
