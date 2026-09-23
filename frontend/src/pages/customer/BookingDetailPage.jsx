import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  useGetBookingQuery,
  useTransitionBookingMutation,
  useGetServiceTraceQuery
} from '@/features/bookings';
import { Card, Button, StatusBadge, Alert, Tabs, Timeline, Badge } from '@/components';
import { CalendarClock, MapPin, Wrench, Shield, CheckCircle2, FileText, Camera } from 'lucide-react';
import ScopeChangeApproval from '@/components/booking/ScopeChangeApproval';
import ServiceTraceTimeline from '@/components/booking/ServiceTraceTimeline';

export default function BookingDetailPage() {
  const { id } = useParams();
  const { data: booking, isLoading, error } = useGetBookingQuery(id);
  const { data: serviceTrace = [] } = useGetServiceTraceQuery(id, { skip: !booking });
  
  const [transitionBooking, { isLoading: isTransitioning }] = useTransitionBookingMutation();

  if (isLoading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading booking details...</div>;
  
  if (error || !booking) return (
    <Alert variant="error" title="Error loading booking">
      {error?.data?.error || 'Could not find the booking.'}
    </Alert>
  );

  const handleConfirmCompletion = async () => {
    try {
      await transitionBooking({ id, action: 'confirm-completion' }).unwrap();
    } catch (err) {
      console.error('Failed to confirm:', err);
    }
  };

  const isAwaitingCompletion = booking.status === 'AWAITING_CUSTOMER_CONFIRMATION';
  const isCompleted = booking.status === 'COMPLETED';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
            <h1 style={{ fontSize: 'var(--font-size-h2)', margin: 0 }}>Booking #{booking._id.substring(0, 8).toUpperCase()}</h1>
            <StatusBadge status={booking.status} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <CalendarClock size={14} /> Scheduled: {new Date(booking.scheduledStartAt).toLocaleString()}
            </span>
          </div>
        </div>
        
        {isAwaitingCompletion && (
          <Button
            onClick={handleConfirmCompletion}
            loading={isTransitioning}
            variant="success"
            leftIcon={<CheckCircle2 size={16} />}
          >
            Confirm Job Completed
          </Button>
        )}
        
        {isCompleted && (
          <Link to={`/reviews/new?bookingId=${booking._id}`}>
            <Button variant="primary">Leave Review</Button>
          </Link>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          <Tabs defaultValue="details">
            <Tabs.List>
              <Tabs.Trigger value="details">Details & Scope</Tabs.Trigger>
              <Tabs.Trigger value="timeline">ServiceTrace</Tabs.Trigger>
              <Tabs.Trigger value="evidence">Proof Pack</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="details">
              <Card padding="lg">
                <h3 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-4)' }}>Scope of Work</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                  {booking.scopeSnapshot?.summary}
                </p>
                
                {booking.scopeSnapshot?.tasks?.length > 0 && (
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <h5 style={{ fontSize: 'var(--font-size-small)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Included Tasks</h5>
                    <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-body)' }}>
                      {booking.scopeSnapshot.tasks.map((task, idx) => (
                        <li key={idx} style={{ marginBottom: 4 }}>{task}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ScopeGuard Approvals */}
                {booking.scopeChanges?.map(change => (
                  <div key={change._id} style={{ marginTop: 'var(--space-4)' }}>
                    <ScopeChangeApproval 
                      bookingId={booking._id} 
                      scopeChange={change} 
                      onDecision={() => window.location.reload()} 
                    />
                  </div>
                ))}
              </Card>

              <Card padding="lg" style={{ marginTop: 'var(--space-6)' }}>
                <h3 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-4)' }}>Pricing Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                    <span>Subtotal</span>
                    <span>₹{booking.pricingSnapshot?.subtotal?.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                    <span>Tax</span>
                    <span>₹{booking.pricingSnapshot?.tax?.toFixed(2)}</span>
                  </div>
                  <hr style={{ border: 0, borderBottom: '1px solid var(--color-border-subtle)', margin: 'var(--space-2) 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: 'var(--font-size-h4)' }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--color-primary)' }}>₹{booking.pricingSnapshot?.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </Tabs.Content>

            <Tabs.Content value="timeline">
              <Card padding="lg">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                  <Shield size={20} color="var(--color-violet)" />
                  <h3 style={{ fontSize: 'var(--font-size-h4)', margin: 0 }}>ServiceTrace</h3>
                </div>
                
                {serviceTrace?.timeline ? (
                  <ServiceTraceTimeline serviceTraceData={serviceTrace} />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-4)' }}>Loading trace events...</div>
                )}
              </Card>
            </Tabs.Content>

            <Tabs.Content value="evidence">
              <Card padding="lg">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                  <Camera size={20} color="var(--color-accent)" />
                  <h3 style={{ fontSize: 'var(--font-size-h4)', margin: 0 }}>Proof Pack</h3>
                </div>
                
                {booking.evidence?.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                    {booking.evidence.map((item, idx) => (
                      <div key={idx} style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                        <div style={{ height: 120, backgroundColor: 'var(--color-surface-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Camera size={32} color="var(--color-text-disabled)" />
                        </div>
                        <div style={{ padding: 'var(--space-2)' }}>
                          <Badge variant="neutral" size="sm" style={{ marginBottom: 'var(--space-1)' }}>{item.type.replace('_', ' ')}</Badge>
                          <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-4)' }}>No evidence photos uploaded yet.</div>
                )}
              </Card>
            </Tabs.Content>
          </Tabs>

        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Card padding="md">
            <h4 style={{ fontSize: 'var(--font-size-body)', marginBottom: 'var(--space-3)' }}>Service Provider</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {booking.providerSnapshot?.displayName?.charAt(0) || 'P'}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{booking.providerSnapshot?.displayName}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
                  {booking.providerSnapshot?.phone || 'Contact via platform'}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Dispute Action */}
          {(isAwaitingCompletion || isCompleted) && (
            <Card padding="md">
              <h4 style={{ fontSize: 'var(--font-size-body)', marginBottom: 'var(--space-2)' }}>Need Help?</h4>
              <p style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                If you encountered issues with this service, you can open a dispute.
              </p>
              <Link to={`/disputes/new?bookingId=${booking._id}`}>
                <Button variant="outline" size="sm" style={{ width: '100%' }}>Open Dispute</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
