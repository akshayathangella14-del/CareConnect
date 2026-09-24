import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useListBookingsQuery } from '@/features/bookings';
import { Card, Button, StatusBadge, DataTable, EmptyState, Alert } from '@/components';
import { CalendarClock, MapPin } from 'lucide-react';
import styles from './BookingsPage.module.css';

export default function BookingsPage() {
  const navigate = useNavigate();
  const { data: bookings = [], isLoading, isFetching, error } = useListBookingsQuery();

  const columns = [
    {
      header: 'Service',
      key: 'service',
      render: (booking) => (
        <div>
          <div className={styles.serviceName}>
            {booking.scopeSnapshot?.summary || 'Service Booking'}
          </div>
          <div className={styles.bookingId}>
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
        <span className={styles.schedule}>
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
    <div className={`${styles.bookings} animate-fade-in-up`}>
      <div className={styles.header}>
        <h1>My Bookings</h1>
        <p>Track and manage your upcoming and past service appointments.</p>
      </div>

      {error && (
        <Alert variant="error" title="Could not load bookings">
          {error.data?.error?.message || 'An unexpected error occurred. Please try again.'}
        </Alert>
      )}

      {isLoading ? (
        <div className={styles.loading}>Loading bookings...</div>
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
        <div className={styles.tableContainer} style={{ opacity: isFetching ? 0.6 : 1 }}>
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