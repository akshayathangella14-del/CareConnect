import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  useGetBookingQuery,
  useTransitionBookingMutation,
  useGetServiceTraceQuery
} from '@/features/bookings';
import { Card, Button, StatusBadge, Alert, Tabs, Timeline, Badge, PaymentModal } from '@/components';
import { CalendarClock, MapPin, Wrench, Shield, CheckCircle2, FileText, Camera, Download, Receipt } from 'lucide-react';
import ScopeChangeApproval from '@/components/booking/ScopeChangeApproval';
import ServiceTraceTimeline from '@/components/booking/ServiceTraceTimeline';

export default function BookingDetailPage() {
  const { id } = useParams();
  const { data: booking, isLoading, error } = useGetBookingQuery(id);
  const { data: serviceTrace = [] } = useGetServiceTraceQuery(id, { skip: !booking });
  
  const [transitionBooking, { isLoading: isTransitioning }] = useTransitionBookingMutation();
  const [invoiceToPay, setInvoiceToPay] = useState(null);

  const handleDownloadReceipt = (invoiceId) => {
    if (!invoiceId) return;
    const token = localStorage.getItem('careconnect_token');
    const url = `/api/v1/invoices/${invoiceId}/download${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    window.open(url, '_blank');
  };

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

        {booking?.invoice && booking.invoice.status !== 'PAID' && (
          <Button variant="primary" onClick={() => setInvoiceToPay(booking.invoice)}>
            Pay Invoice ({booking.invoice.currency || 'INR'} {Number(booking.invoice.total || 0).toFixed(2)})
          </Button>
        )}

        {booking?.invoice && booking.invoice.status === 'PAID' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 'var(--space-1)', 
              color: '#065F46', 
              backgroundColor: '#ECFDF5', 
              border: '1px solid #A7F3D0',
              padding: '6px 12px', 
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--font-size-small)',
              fontWeight: 600
            }}>
              <CheckCircle2 size={14} color="#10B981" /> Paid in Full
            </span>
            <Button
              variant="outline"
              leftIcon={<Download size={15} />}
              onClick={() => handleDownloadReceipt(booking.invoice._id)}
            >
              Download Receipt (PDF)
            </Button>
          </div>
        )}
        
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
          
          {/* ScopeGuard Approvals (Moved to top of main content for maximum visibility) */}
          {booking.scopeChanges?.map(change => (
            <div key={change._id} style={{ marginBottom: 'var(--space-2)' }}>
              <ScopeChangeApproval 
                bookingId={booking._id} 
                scopeChange={change} 
                onDecision={() => window.location.reload()} 
              />
            </div>
          ))}
          
          <Card padding="lg">
            <h3 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-4)' }}>Details & Scope</h3>
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
          </Card>

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
          
          {/* Invoice & Payment Card */}
          {booking?.invoice && (
            <Card padding="md">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Receipt size={18} color="var(--color-primary)" />
                  <h4 style={{ fontSize: 'var(--font-size-body)', margin: 0 }}>Billing & Invoice</h4>
                </div>
                <StatusBadge status={booking.invoice.status} size="sm" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-small)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Invoice No.</span>
                <span style={{ fontWeight: 600 }}>{booking.invoice.invoiceNumber || `INV-${booking.invoice._id.slice(0, 8).toUpperCase()}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-body)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Amount Due</span>
                <strong style={{ fontSize: 'var(--font-size-h4)', color: 'var(--color-primary-dark)' }}>
                  {booking.invoice.currency || 'INR'} {Number(booking.invoice.total || 0).toFixed(2)}
                </strong>
              </div>

              {booking.invoice.status !== 'PAID' ? (
                <Button 
                  variant="primary" 
                  style={{ width: '100%' }} 
                  onClick={() => setInvoiceToPay(booking.invoice)}
                >
                  Pay Now
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  leftIcon={<Download size={14} />} 
                  style={{ width: '100%' }}
                  onClick={() => handleDownloadReceipt(booking.invoice._id)}
                >
                  Download PDF Receipt
                </Button>
              )}
            </Card>
          )}

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

      <PaymentModal
        isOpen={Boolean(invoiceToPay)}
        invoice={invoiceToPay}
        onClose={() => setInvoiceToPay(null)}
        onSuccess={() => {
          setInvoiceToPay(null);
          window.location.reload();
        }}
      />
    </div>
  );
}
