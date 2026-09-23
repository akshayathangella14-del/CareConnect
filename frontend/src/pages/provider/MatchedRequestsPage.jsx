import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useListServiceRequestsQuery } from '@/features/serviceRequests';
import { Card, Button, StatusBadge, DataTable, EmptyState, Badge } from '@/components';
import { MapPin, Search } from 'lucide-react';

export default function MatchedRequestsPage() {
  const navigate = useNavigate();
  // Provider sees requests in MATCHING or QUOTING state (filtered by backend)
  const { data: requests = [], isLoading, isFetching } = useListServiceRequestsQuery();

  const columns = [
    {
      header: 'Request',
      key: 'title',
      render: (req) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{req.title}</div>
          <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
            <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
            {req.location.city}, {req.location.state}
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
        <Badge variant={
          req.urgency === 'EMERGENCY' ? 'error' : 
          req.urgency === 'HIGH' ? 'warning' : 'neutral'
        } size="sm">
          {req.urgency}
        </Badge>
      ),
    },
    {
      header: 'Action',
      key: 'action',
      render: (req) => (
        <Link to={`/provider/quotes/new?requestId=${req._id}`} onClick={e => e.stopPropagation()}>
          <Button size="sm" variant="primary">Create Quote</Button>
        </Link>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>Matched Opportunities</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Service requests matching your skills and service area. Submit quotes to win these jobs.
        </p>
      </div>

      {isLoading ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading opportunities...</div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={<Search size={28} />}
          title="No matched requests right now"
          description="Check back later or expand your service areas and skills in your profile to see more opportunities."
        />
      ) : (
        <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity var(--transition-fast)' }}>
          <DataTable
            columns={columns}
            data={requests}
            keyField="_id"
          />
        </div>
      )}
    </div>
  );
}
