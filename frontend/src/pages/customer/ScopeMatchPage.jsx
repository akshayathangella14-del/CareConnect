import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  useGetServiceRequestQuery, 
  useListQuotesForRequestQuery 
} from '@/features/serviceRequests';
import { useAcceptQuoteMutation } from '@/features/quotes';
import { Card, Button, Alert, Badge } from '@/components';
import { ArrowLeft, Check, Star, Clock } from 'lucide-react';
import styles from './ScopeMatchPage.module.css';

export default function ScopeMatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: request, isLoading: isLoadingRequest } = useGetServiceRequestQuery(id);
  const { data: quotes = [], isLoading: isLoadingQuotes } = useListQuotesForRequestQuery(id, {
    skip: !id,
    pollingInterval: 5000,
  });
  
  const [acceptQuote, { isLoading: isAccepting }] = useAcceptQuoteMutation();
  const [error, setError] = useState('');

  if (isLoadingRequest || isLoadingQuotes) {
    return <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading ScopeMatch™ Comparison...</div>;
  }

  const validQuotes = quotes.filter(q => q.status === 'SUBMITTED' || q.status === 'ACCEPTED');

  if (validQuotes.length === 0) {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <Link to={`/service-requests/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Request
        </Link>
        <Alert variant="warning" title="No Quotes Available">
          There are no submitted quotes to compare yet. Providers are still reviewing your request.
        </Alert>
      </div>
    );
  }

  // Find lowest price and highest rating for visual indicators
  const lowestPrice = Math.min(...validQuotes.map(q => q.totalAmount));
  const highestRating = Math.max(...validQuotes.map(q => q.provider?.ratingSummary?.averageRating || 0));

  const handleAcceptQuote = async (quoteId) => {
    if (!request.preferredSchedule?.startAt || !request.preferredSchedule?.endAt) {
      setError('Please set a preferred schedule on the request detail page before accepting a quote.');
      return;
    }
    
    if (window.confirm('Are you sure you want to accept this quote? This will create a binding booking.')) {
      try {
        await acceptQuote(quoteId).unwrap();
        navigate(`/service-requests/${id}`);
      } catch (err) {
        setError(err?.data?.error?.message || err?.data?.message || 'Failed to accept quote.');
      }
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div>
        <Link to={`/service-requests/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', textDecoration: 'none', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-small)', fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back to Request
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-h2)', margin: 0, marginBottom: 'var(--space-2)' }}>ScopeMatch™ Comparison</h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
              Compare {validQuotes.length} quotes side-by-side to find the best value for your service.
            </p>
          </div>
        </div>
      </div>

      {error && <Alert variant="error" title="Error">{error}</Alert>}

      <div style={{ display: 'flex', gap: 'var(--space-4)', overflowX: 'auto', paddingBottom: 'var(--space-4)' }}>
        {validQuotes.map(quote => {
          const isLowestPrice = quote.totalAmount === lowestPrice;
          const isHighestRating = (quote.provider?.ratingSummary?.averageRating || 0) === highestRating && highestRating > 0;
          
          return (
            <Card key={quote._id} padding="lg" style={{ minWidth: 320, flex: 1, border: quote.status === 'ACCEPTED' ? '2px solid var(--color-success)' : undefined }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', height: '100%' }}>
                
                {/* Provider Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--color-surface-muted)', display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: 'var(--font-size-h4)', color: 'var(--color-primary)' }}>
                    {quote.provider?.displayName?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 'var(--font-size-h4)' }}>{quote.provider?.displayName || 'Verified Provider'}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
                      <Star size={14} color={isHighestRating ? '#F59E0B' : 'currentColor'} /> 
                      {quote.provider?.ratingSummary?.averageRating ? quote.provider.ratingSummary.averageRating.toFixed(1) : 'New'}
                      {isHighestRating && <Badge variant="warning" size="sm" style={{ marginLeft: 'var(--space-1)' }}>Highest Rated</Badge>}
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>Total Price</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>₹{quote.totalAmount}</div>
                    {isLowestPrice && <Badge variant="success">Best Price</Badge>}
                  </div>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Labor:</span> <span>₹{quote.pricingBreakdown?.labor || 0}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Materials:</span> <span>₹{quote.pricingBreakdown?.materials || 0}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax:</span> <span>₹{quote.pricingBreakdown?.tax || 0}</span></div>
                  </div>
                </div>

                {/* Scope & Tasks */}
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 'var(--font-size-body)', marginBottom: 'var(--space-2)' }}>Scope Summary</h4>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)', marginBottom: 'var(--space-4)' }}>{quote.scope?.summary}</p>
                  
                  <h4 style={{ fontSize: 'var(--font-size-body)', marginBottom: 'var(--space-2)' }}>Included Tasks</h4>
                  <ul style={{ paddingLeft: 'var(--space-4)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-small)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                    {quote.scope?.tasks?.filter(t => t.included).map((task, idx) => (
                      <li key={idx}>{task.description}</li>
                    ))}
                  </ul>

                  {quote.scope?.exclusions?.length > 0 && (
                    <div style={{ marginTop: 'var(--space-4)' }}>
                      <h4 style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-error)', marginBottom: 'var(--space-2)' }}>Exclusions</h4>
                      <ul style={{ paddingLeft: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                        {quote.scope.exclusions.map((exclusion, idx) => (
                          <li key={idx}>{exclusion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-4)', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)', marginBottom: 'var(--space-4)' }}>
                    <Clock size={16} /> Est. Duration: {quote.estimatedDuration?.value} {quote.estimatedDuration?.unit?.toLowerCase()}
                  </div>
                  
                  {quote.status === 'SUBMITTED' ? (
                    <Button variant="primary" style={{ width: '100%' }} onClick={() => handleAcceptQuote(quote._id)} loading={isAccepting}>
                      Accept This Quote
                    </Button>
                  ) : quote.status === 'ACCEPTED' ? (
                    <Button variant="success" style={{ width: '100%' }} disabled leftIcon={<Check size={18} />}>
                      Accepted
                    </Button>
                  ) : null}
                </div>

              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
