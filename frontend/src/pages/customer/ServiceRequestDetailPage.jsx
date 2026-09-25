import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  useGetServiceRequestQuery,
  useSubmitServiceRequestMutation,
  useListQuotesForRequestQuery,
  useCorrectAiUnderstandingMutation,
  useUpdateServiceRequestMutation
} from '@/features/serviceRequests';
import { useAcceptQuoteMutation } from '@/features/quotes';
import { Card, Button, StatusBadge, Alert, Badge, Input } from '@/components';
import { MapPin, CalendarClock, Wand2, Check, ShieldAlert, CheckCircle } from 'lucide-react';

export default function ServiceRequestDetailPage() {
  const { id } = useParams();
  const { data: request, isLoading, error } = useGetServiceRequestQuery(id);
  const { data: quotes = [] } = useListQuotesForRequestQuery(id, { skip: !request || request.status === 'DRAFT' });
  
  const [submitRequest, { isLoading: isSubmitting }] = useSubmitServiceRequestMutation();
  const [acceptQuote, { isLoading: isAccepting }] = useAcceptQuoteMutation();
  const [correctAi, { isLoading: isConfirming }] = useCorrectAiUnderstandingMutation();
  const [updateRequest] = useUpdateServiceRequestMutation();

  const [correctionNote, setCorrectionNote] = useState('');
  const [isCorrecting, setIsCorrecting] = useState(false);

  const [scheduleForm, setScheduleForm] = useState({
    preferredStartDate: '',
    preferredStartTime: '',
    preferredEndDate: '',
    preferredEndTime: '',
  });
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  if (isLoading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading request details...</div>;
  
  if (error || !request) return (
    <Alert variant="error" title="Error loading request">
      {error?.data?.error?.message || 'Could not find the service request.'}
    </Alert>
  );

  const handleSubmit = async () => {
    try {
      await submitRequest(id).unwrap();
    } catch (err) {
      console.error('Failed to submit:', err);
    }
  };

  const handleConfirmUnderstanding = async () => {
    try {
      await correctAi({ id, notes: 'Customer confirmed AI interpretation.' }).unwrap();
    } catch (err) {
      console.error('Failed to confirm AI scope:', err);
    }
  };

  const handleAcceptQuote = async (quoteId) => {
    if (!request.preferredSchedule?.startAt || !request.preferredSchedule?.endAt) {
      setShowScheduleForm(true);
      return;
    }

    if (window.confirm('Are you sure you want to accept this quote? This will create a binding booking.')) {
      try {
        await acceptQuote(quoteId).unwrap();
      } catch (err) {
        console.error('Failed to accept quote:', err);
      }
    }
  };

  const handleScheduleSubmit = async () => {
    try {
      const preferredSchedule = {
        startAt: new Date(`${scheduleForm.preferredStartDate}T${scheduleForm.preferredStartTime}`).toISOString(),
        endAt: new Date(`${scheduleForm.preferredEndDate}T${scheduleForm.preferredEndTime}`).toISOString(),
      };
      await updateRequest({ id, preferredSchedule }).unwrap();
      setShowScheduleForm(false);
    } catch (err) {
      console.error('Failed to update schedule:', err);
    }
  };

  const handleCorrectionSubmit = async () => {
    if (!correctionNote.trim()) return;
    try {
      await correctAi({ id, notes: correctionNote }).unwrap();
      setCorrectionNote('');
      setIsCorrecting(false);
    } catch (err) {
      console.error('Correction failed:', err);
    }
  };

  const hasAiUnderstanding = !!request.aiUnderstanding;
  const isConfirmed = !!request.confirmedUnderstanding;
  const isDraft = request.status === 'DRAFT';
  const providerQuote = quotes.find((quote) => quote.status === 'ACCEPTED') || quotes[0];

  const statusSteps = [
    { key: 'MATCHING', label: 'Provider Found & Notified', icon: '✅', tone: 'success' },
    { key: 'QUOTING', label: 'Provider Reviewing Your Request', icon: '⏳', tone: 'warning' },
    { key: 'PROVIDER_SELECTED', label: 'Provider Confirmed', icon: '🏁', tone: 'success' },
    { key: 'BOOKED', label: 'Provider En Route', icon: '🚗', tone: 'info' },
    { key: 'IN_PROGRESS', label: 'Service In Progress', icon: '🔧', tone: 'primary' },
    { key: 'COMPLETED', label: 'Service Completed', icon: '✓', tone: 'success' },
  ];

  const requestedStatus = request.status === 'BOOKED' ? 'BOOKED' : request.status;
  const currentStepIndex = Math.max(0, statusSteps.findIndex((step) => step.key === requestedStatus));
  const requestState = statusSteps[currentStepIndex] || statusSteps[0];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
            <h1 style={{ fontSize: 'var(--font-size-h2)', margin: 0 }}>{request.title}</h1>
            <StatusBadge status={request.status} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <MapPin size={14} /> {request.location?.city || request.location?.serviceArea}, {request.location?.state}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <CalendarClock size={14} /> Created {new Date(request.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {isDraft ? (
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            leftIcon={<Wand2 size={16} />}
          >
            Submit for AI Review
          </Button>
        ) : ['MATCHING', 'QUOTING'].includes(request.status) ? (
          <Link to={`/service-requests/${id}/matches`} style={{ textDecoration: 'none' }}>
            <Button variant="primary" leftIcon={<Wand2 size={16} />}>
              View Provider Matches
            </Button>
          </Link>
        ) : null}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Main Content Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          <Card padding="lg">
            <h3 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-3)' }}>Description</h3>
            <p style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {request.description}
            </p>
          </Card>

          {hasAiUnderstanding && (
            <Card padding="lg" style={{ borderLeft: '4px solid var(--color-success)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <CheckCircle size={20} color="var(--color-success)" />
                  <h3 style={{ fontSize: 'var(--font-size-h4)', margin: 0 }}>Request Status</h3>
                </div>
                <Badge variant="success" size="sm">{requestState.label}</Badge>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                {statusSteps.map((step, index) => {
                  const isActive = index <= currentStepIndex;
                  return (
                    <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', opacity: isActive ? 1 : 0.5 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: isActive ? 'var(--color-success-soft)' : 'var(--color-surface-muted)', display: 'grid', placeItems: 'center', fontSize: 16 }}>
                        {step.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{step.label}</div>
                        <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>
                          {step.key === 'MATCHING' && 'We will notify the best-fit providers for this request.'}
                          {step.key === 'QUOTING' && 'Providers are reviewing your work description and schedule.'}
                          {step.key === 'PROVIDER_SELECTED' && 'Your provider has been confirmed and is ready to proceed.'}
                          {step.key === 'BOOKED' && 'Provider is on the way and will update ETA soon.'}
                          {step.key === 'IN_PROGRESS' && 'The service is currently underway at your location.'}
                          {step.key === 'COMPLETED' && 'The task has been completed and verified.'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {providerQuote && (
                <div style={{ display: 'grid', gap: 'var(--space-2)', backgroundColor: 'var(--color-surface-muted)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Provider</div>
                  <div style={{ fontWeight: 700 }}>{providerQuote.provider?.displayName || 'Verified provider'}</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
                    {providerQuote.provider?.ratingSummary?.averageRating > 0 ? `⭐ ${providerQuote.provider.ratingSummary.averageRating.toFixed(1)} rating` : 'New provider added'}
                    {request.preferredSchedule?.startAt ? ` • ETA: ${new Date(request.preferredSchedule.startAt).toLocaleString()}` : ''}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Quotes Section */}
          {quotes.length > 0 && (
            <div>
              <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-4)' }}>Received Quotes</h3>

              {!request.preferredSchedule?.startAt && (
                <Alert variant="warning" title="Schedule Required" style={{ marginBottom: 'var(--space-4)' }}>
                  You need to provide your preferred schedule before accepting any quote.
                  <Button variant="secondary" size="sm" onClick={() => setShowScheduleForm(true)} style={{ marginTop: 'var(--space-2)' }}>
                    Add Schedule
                  </Button>
                </Alert>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {quotes.map(quote => (
                  <Card key={quote._id} padding="md" style={{ border: quote.status === 'ACCEPTED' ? '2px solid var(--color-success)' : undefined }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-h4)' }}>
                          {quote.provider?.displayName || 'Service Provider'}
                        </div>
                        <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)', marginTop: 'var(--space-1)' }}>
                          {quote.provider?.ratingSummary?.averageRating > 0 && (
                            <span>★ {quote.provider.ratingSummary.averageRating.toFixed(1)} • </span>
                          )}
                          Estimated Duration: {quote.estimatedDuration?.value} {quote.estimatedDuration?.unit?.toLowerCase()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 700, color: 'var(--color-primary)' }}>
                          ₹{quote.totalAmount}
                        </div>
                        <StatusBadge status={quote.status} size="sm" />
                      </div>
                    </div>

                    <div style={{ marginTop: 'var(--space-4)', backgroundColor: 'var(--color-surface-muted)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Scope Summary</div>
                      <p style={{ margin: 0, fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>
                        {quote.scope?.summary}
                      </p>
                    </div>

                    {quote.status === 'SUBMITTED' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                        <Button variant="secondary" size="sm">Request Changes</Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAcceptQuote(quote._id)}
                          loading={isAccepting}
                        >
                          Accept Quote
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Form Modal */}
          {showScheduleForm && (
            <Card padding="lg" style={{ border: '2px solid var(--color-primary)' }}>
              <h3 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-4)' }}>Provide Your Preferred Schedule</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                Providers will check their availability against this schedule before you can accept quotes.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Preferred Start Date</label>
                  <Input
                    name="preferredStartDate"
                    type="date"
                    value={scheduleForm.preferredStartDate}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, preferredStartDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Preferred Start Time</label>
                  <Input
                    name="preferredStartTime"
                    type="time"
                    value={scheduleForm.preferredStartTime}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, preferredStartTime: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Preferred End Date</label>
                  <Input
                    name="preferredEndDate"
                    type="date"
                    value={scheduleForm.preferredEndDate}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, preferredEndDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Preferred End Time</label>
                  <Input
                    name="preferredEndTime"
                    type="time"
                    value={scheduleForm.preferredEndTime}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, preferredEndTime: e.target.value }))}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <Button variant="secondary" onClick={() => setShowScheduleForm(false)}>Cancel</Button>
                <Button onClick={handleScheduleSubmit}>Save Schedule</Button>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Card padding="md">
            <h4 style={{ fontSize: 'var(--font-size-body)', marginBottom: 'var(--space-3)' }}>Urgency</h4>
            <Badge variant={
              request.urgency === 'EMERGENCY' ? 'error' : 
              request.urgency === 'HIGH' ? 'warning' : 'neutral'
            }>
              {request.urgency}
            </Badge>

            <h4 style={{ fontSize: 'var(--font-size-body)', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Location</h4>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
              <div>{request.location?.addressLine1}</div>
              {request.location?.addressLine2 && <div>{request.location.addressLine2}</div>}
              <div>{request.location?.city}, {request.location?.state} {request.location?.postalCode}</div>
            </div>
          </Card>
          
          {request.status === 'PROVIDER_SELECTED' && (
            <Card padding="md" style={{ backgroundColor: 'var(--color-success-soft)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-success)', marginBottom: 'var(--space-2)' }}>
                <Check size={20} />
                <h4 style={{ margin: 0 }}>Provider Selected</h4>
              </div>
              <p style={{ margin: 0, fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>
                A booking has been created for this request. Check your Bookings tab to track progress.
              </p>
              <Link to="/bookings" style={{ display: 'block', marginTop: 'var(--space-3)' }}>
                <Button variant="secondary" size="sm" style={{ width: '100%' }}>View Bookings</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}