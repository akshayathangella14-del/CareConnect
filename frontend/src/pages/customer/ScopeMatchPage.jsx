import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  useGetServiceRequestQuery, 
  useGetMatchesQuery, 
  useCreateQuoteForRequestMutation 
} from '@/features/serviceRequests';
import { Card, Button, Alert, Badge } from '@/components';
import { ArrowLeft, SlidersHorizontal, Search, Info } from 'lucide-react';
import ProviderMatchCard from '@/components/matching/ProviderMatchCard';

export default function ScopeMatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: request, isLoading: isLoadingRequest, error: requestError } = useGetServiceRequestQuery(id);
  const { data: matches = [], isLoading: isLoadingMatches, error: matchesError } = useGetMatchesQuery(id);
  
  const [createQuote, { isLoading: isRequestingQuote }] = useCreateQuoteForRequestMutation();
  const [requestingId, setRequestingId] = useState(null);

  const [sortBy, setSortBy] = useState('score_desc');
  const [filterRating, setFilterRating] = useState(0);

  const sortedAndFilteredMatches = useMemo(() => {
    let result = [...matches];
    
    if (filterRating > 0) {
      result = result.filter(m => (m.provider?.ratingSummary?.averageRating || 0) >= filterRating);
    }

    result.sort((a, b) => {
      if (sortBy === 'score_desc') return b.score - a.score;
      if (sortBy === 'rating_desc') return (b.provider?.ratingSummary?.averageRating || 0) - (a.provider?.ratingSummary?.averageRating || 0);
      if (sortBy === 'exp_desc') return (b.provider?.experienceYears || 0) - (a.provider?.experienceYears || 0);
      return 0;
    });

    return result;
  }, [matches, sortBy, filterRating]);

  const handleRequestQuote = async (providerId) => {
    setRequestingId(providerId);
    try {
      // Notify the provider about the quote request
      // This creates a notification for the provider to respond
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications/quote-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          serviceRequestId: id,
          providerId: providerId
        })
      });
      
      if (response.ok) {
        alert('Quote request sent to provider! They will be notified to submit a quote.');
      } else {
        throw new Error('Failed to send request');
      }
    } catch (err) {
      console.error('Failed to request quote:', err);
      alert('Failed to send quote request. Please try again.');
    } finally {
      setRequestingId(null);
    }
  };

  if (isLoadingRequest || isLoadingMatches) {
    return <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Finding best provider matches...</div>;
  }

  if (requestError || matchesError) {
    return (
      <Alert variant="error" title="Error loading matches">
        Could not load provider matches. Please try again later.
      </Alert>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div>
        <Link to={`/service-requests/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', textDecoration: 'none', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-small)', fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back to Request
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-h2)', margin: 0, marginBottom: 'var(--space-2)' }}>ScopeMatch™ Results</h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
              We analyzed {matches.length} providers based on skills, location, and your schedule.
            </p>
          </div>
          <Badge variant="primary" size="lg" style={{ fontSize: 'var(--font-size-h4)' }}>
            {matches.length} Matches Found
          </Badge>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Filters Sidebar */}
        <Card padding="md" style={{ position: 'sticky', top: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', fontWeight: 600 }}>
            <SlidersHorizontal size={18} /> Filters & Sorting
          </div>
          
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
            >
              <option value="score_desc">Highest Match Score</option>
              <option value="rating_desc">Highest Rating</option>
              <option value="exp_desc">Most Experience</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Minimum Rating</label>
            <select 
              value={filterRating} 
              onChange={(e) => setFilterRating(Number(e.target.value))}
              style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>4.5 & up</option>
              <option value={4.0}>4.0 & up</option>
              <option value={3.5}>3.5 & up</option>
            </select>
          </div>
        </Card>

        {/* Results List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {sortedAndFilteredMatches.length === 0 ? (
            <Card padding="xl" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <Search size={48} style={{ margin: '0 auto', marginBottom: 'var(--space-4)', color: 'var(--color-border)' }} />
              <h3 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-2)' }}>No providers match your criteria</h3>
              <p>Try adjusting your filters to see more results.</p>
              <Button variant="secondary" onClick={() => { setSortBy('score_desc'); setFilterRating(0); }} style={{ marginTop: 'var(--space-4)' }}>
                Clear Filters
              </Button>
            </Card>
          ) : (
            sortedAndFilteredMatches.map(match => (
              <ProviderMatchCard 
                key={match.provider._id} 
                match={match} 
                onRequestQuote={handleRequestQuote}
                isRequesting={isRequestingQuote && requestingId === match.provider._id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
