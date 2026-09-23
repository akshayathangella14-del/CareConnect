import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useListBookingsQuery } from '@/features/bookings';
import { Card, Button, StatusBadge, DataTable, EmptyState, Alert } from '@/components';
import { CalendarClock, MapPin } from 'lucide-react';

export default function BookingsPage() {
  const navigate = useNavigate();
  const { data: bookings = [], isLoading, isFetching, error } = useListBookingsQuery();

  const columns = [
    {
      header: 'Service',
      key: 'service',
      render: (booking) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {booking.scopeSnapshot?.summary || 'Service Booking'}
          </div>
          <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
            {booking._id?.substring(0, 8).toUpperCase()}
          </div>
        </div>
      ),
    },
    {
      header: 'Provider',
      key: 'provider',
      render: (booking) => booking.providerSnapshot?.displayName || 'Unknown Provider',
    },
    {
      header: 'Schedule',
      key: 'schedule',
      render: (booking) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-text-secondary)' }}>
          <CalendarClock size={14} />
          {booking.scheduledStartAt ? new Date(booking.scheduledStartAt).toLocaleDateString() : 'Not scheduled'}
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
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>My Bookings</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Track and manage your upcoming and past service appointments.</p>
      </div>

      {error && (
        <Alert variant="error" title="Could not load bookings">
          {error.data?.error?.message || 'An unexpected error occurred. Please try again.'}
        </Alert>
      )}

      {isLoading ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={<CalendarClock size={48} />}
          title="No bookings yet"
          description="You don't have any active or past bookings. Create a service request to get started."
          action={
            <Link to="/service-requests/new">
              <Button variant="primary">Request a Service</Button>
            </Link>
          }
        />
      ) : (
        <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity var(--transition-fast)' }}>
          <DataTable
            columns={columns}
            data={bookings}
            keyField="_id"
            onRowClick={(row) => navigate(`/bookings/${row._id}`)}
          />
        </div>
      )}
    </div>
  );
}