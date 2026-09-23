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

  const conf = request.aiUnderstanding?.confidence || 0;
  let confidenceColor = 'var(--color-primary)';
  if (conf >= 0.8) confidenceColor = 'var(--color-success)';
  else if (conf < 0.7) confidenceColor = 'var(--color-error)';
  else confidenceColor = 'var(--color-warning)';

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
            <Card padding="lg" style={{ borderLeft: isConfirmed ? '4px solid var(--color-success)' : '4px solid var(--color-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Wand2 size={20} color="var(--color-primary)" />
                  <h3 style={{ fontSize: 'var(--font-size-h4)', margin: 0 }}>AI Scope & Understanding</h3>
                  {request.aiUnderstanding.source === 'FALLBACK_RULES' ? (
                    <Badge variant="warning" size="sm">Rule-Based Analysis</Badge>
                  ) : (
                    <Badge variant="primary" size="sm">Powered by Gemini</Badge>
                  )}
                </div>

                {isConfirmed && (
                  <Badge variant="success" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} /> Scope Confirmed
                  </Badge>
                )}
              </div>

              {request.aiUnderstanding.confidence !== undefined && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                    <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)' }}>
                      AI Confidence Score
                    </div>
                    <span style={{ fontSize: 'var(--font-size-small)', fontWeight: 600, color: confidenceColor }}>
                      {Math.round(conf * 100)}%
                    </span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: 8, 
                    backgroundColor: 'var(--color-surface-muted)', 
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${conf * 100}%`,
                      height: '100%',
                      backgroundColor: confidenceColor,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  
                  {conf < 0.7 && !isConfirmed && (
                    <Alert variant="warning" title="Low Confidence Analysis" style={{ marginTop: 'var(--space-3)' }}>
                      The AI analysis has low confidence. A manual review has been requested, or you can provide more details below.
                    </Alert>
                  )}
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)' }}>Diagnosed Problem</div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-body)' }}>{request.aiUnderstanding.problemType || 'Home Repair'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)' }}>Assigned Category</div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-body)' }}>{request.category?.name || 'Appliance Repair'}</div>
                </div>
              </div>

              {request.aiUnderstanding.missingInformation?.length > 0 && !isConfirmed && (
                <div style={{ marginBottom: 'var(--space-4)', backgroundColor: 'var(--color-surface-muted)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginBottom: 'var(--space-2)', fontWeight: 600 }}>
                    <ShieldAlert size={14} /> Recommended Information to Clarify
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
                    {request.aiUnderstanding.missingInformation.map((info, idx) => (
                      <li key={idx} style={{ marginBottom: 'var(--space-1)' }}>
                        {info}
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => {
                            setIsCorrecting(true);
                            setCorrectionNote(prev => prev + (prev ? '\n' : '') + `- Clarify: ${info} `);
                          }}
                          style={{ marginLeft: 'var(--space-2)', padding: 0 }}
                        >
                          Add to correction
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons for AI Scope Confirmation */}
              {!isCorrecting && (
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
                  {!isConfirmed && (
                    <Button variant="primary" size="sm" onClick={handleConfirmUnderstanding} loading={isConfirming} leftIcon={<Check size={16} />}>
                      Confirm AI Understanding
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setIsCorrecting(true)}>
                    {isConfirmed ? 'Edit / Update Scope Notes' : 'Correct AI Understanding'}
                  </Button>
                </div>
              )}

              {isCorrecting && (
                <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-md)' }}>
                  <textarea
                    value={correctionNote}
                    onChange={(e) => setCorrectionNote(e.target.value)}
                    placeholder="Describe what the AI missed or update specific scope requirements..."
                    style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', minHeight: 80, marginBottom: 'var(--space-2)' }}
                  />
                  <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                    <Button variant="secondary" size="sm" onClick={() => setIsCorrecting(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleCorrectionSubmit} disabled={!correctionNote.trim()}>Save Scope Correction</Button>
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
                          {quote.pricingBreakdown?.currency || 'INR'} {quote.totalAmount}
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