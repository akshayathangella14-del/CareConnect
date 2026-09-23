import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useListBookingsQuery } from '@/features/bookings';
import { Card, Button, StatusBadge, DataTable, EmptyState } from '@/components';
import { CalendarClock, MapPin } from 'lucide-react';

export default function ProviderBookingsPage() {
  const navigate = useNavigate();
  const { data: bookings = [], isLoading, isFetching } = useListBookingsQuery();

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
