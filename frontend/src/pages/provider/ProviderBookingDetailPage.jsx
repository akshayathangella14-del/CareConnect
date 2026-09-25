import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  useGetBookingQuery,
  useTransitionBookingMutation,
  useAddEvidenceMutation
} from '@/features/bookings';
import { Card, Button, StatusBadge, Alert, Tabs, Badge, Input, Select, Modal } from '@/components';
import { CalendarClock, MapPin, CheckCircle2, Navigation, Play, Upload, Camera, FileWarning } from 'lucide-react';
import ScopeChangeRequestForm from '@/components/booking/ScopeChangeRequestForm';

export default function ProviderBookingDetailPage() {
  const { id } = useParams();
  const { data: booking, isLoading, error } = useGetBookingQuery(id);
  
  const [transitionBooking, { isLoading: isTransitioning }] = useTransitionBookingMutation();
  const [addEvidence, { isLoading: isUploading }] = useAddEvidenceMutation();

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceData, setEvidenceData] = useState({ type: 'BEFORE_SERVICE', description: '', url: '', file: null });
  const [isRequestingScopeChange, setIsRequestingScopeChange] = useState(false);

  if (isLoading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading job details...</div>;
  
  if (error || !booking) return (
    <Alert variant="error" title="Error loading job">
      {error?.data?.error || 'Could not find the booking.'}
    </Alert>
  );

  const handleStatusTransition = async (action) => {
    try {
      await transitionBooking({ id, action }).unwrap();
    } catch (err) {
      console.error('Failed to transition:', err);
    }
  };

  const handleEvidenceSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('type', evidenceData.type);
      formData.append('description', evidenceData.description);
      
      if (evidenceData.file) {
        formData.append('file', evidenceData.file);
      } else {
        // Fallback to text data if no file is selected
        formData.append('file', JSON.stringify({ url: evidenceData.url || '', name: 'Evidence File', mimeType: 'image/jpeg' }));
      }
      
      await addEvidence({
        id,
        formData
      }).unwrap();
      setIsEvidenceModalOpen(false);
      setEvidenceData({ type: 'BEFORE_SERVICE', description: '', url: '', file: null });
    } catch (err) {
      console.error('Failed to upload evidence:', err);
      alert('Failed to upload evidence. Please try again.');
    }
  };

  const getNextAction = () => {
    switch (booking.status) {
      case 'PENDING_CONFIRMATION':
        return { action: 'confirm', label: 'Confirm Booking', icon: <CheckCircle2 size={16} /> };
      case 'CONFIRMED':
        return { action: 'en-route', label: 'Mark En Route', icon: <Navigation size={16} /> };
      case 'PROVIDER_EN_ROUTE':
        return { action: 'arrived', label: 'Mark Arrived', icon: <MapPin size={16} /> };
      case 'ARRIVED':
        return { action: 'start', label: 'Start Work', icon: <Play size={16} /> };
      case 'IN_PROGRESS':
        return { action: 'request-completion', label: 'Request Completion', icon: <CheckCircle2 size={16} /> };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
            <h1 style={{ fontSize: 'var(--font-size-h2)', margin: 0 }}>Job #{booking._id.substring(0, 8).toUpperCase()}</h1>
            <StatusBadge status={booking.status} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <CalendarClock size={14} /> Scheduled: {new Date(booking.scheduledStartAt).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Button variant="outline" leftIcon={<Camera size={16} />} onClick={() => setIsEvidenceModalOpen(true)}>
            Upload Proof
          </Button>
          {booking.status === 'PENDING_CONFIRMATION' && (
            <Alert variant="info" title="Confirm this job" style={{ flex: 1 }}>
              Review the schedule and scope, then confirm that you can take this booking.
            </Alert>
          )}
          {['CONFIRMED', 'PROVIDER_EN_ROUTE', 'ARRIVED', 'IN_PROGRESS'].includes(booking.status) && (
            <Button variant="warning" leftIcon={<FileWarning size={16} />} onClick={() => setIsRequestingScopeChange(true)}>
              Request Scope Change
            </Button>
          )}
          {nextAction && (
            <Button
              onClick={() => handleStatusTransition(nextAction.action)}
              loading={isTransitioning}
              leftIcon={nextAction.icon}
            >
              {nextAction.label}
            </Button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <Card padding="lg">
            <h3 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-4)' }}>Scope of Work</h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
              {booking.scopeSnapshot?.summary}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div>
                <h5 style={{ fontSize: 'var(--font-size-small)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Tasks to Complete</h5>
                <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-body)' }}>
                  {booking.scopeSnapshot?.tasks?.map((task, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>{task}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 style={{ fontSize: 'var(--font-size-small)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-warning)' }}>Exclusions</h5>
                <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-body)' }}>
                  {booking.scopeSnapshot?.exclusions?.map((exclusion, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>{exclusion}</li>
                  ))}
                </ul>
              </div>
            </div>

            {isRequestingScopeChange && (
              <div style={{ marginTop: 'var(--space-6)' }}>
                <ScopeChangeRequestForm 
                  bookingId={booking._id}
                  onCancel={() => setIsRequestingScopeChange(false)}
                  onSuccess={() => setIsRequestingScopeChange(false)}
                />
              </div>
            )}

            {booking.scopeChanges?.length > 0 && (
              <div style={{ marginTop: 'var(--space-6)' }}>
                <h4 style={{ fontSize: 'var(--font-size-body)', marginBottom: 'var(--space-3)' }}>Scope Change Requests</h4>
                {booking.scopeChanges.map(change => (
                  <Card key={change._id} padding="md" style={{ marginBottom: 'var(--space-3)', backgroundColor: 'var(--color-surface-muted)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                      <div style={{ fontWeight: 600 }}>{change.reason}</div>
                      <Badge variant={change.status === 'APPROVED' ? 'success' : change.status === 'REJECTED' ? 'error' : 'warning'}>
                        {change.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    {change.workItems?.length > 0 && (
                      <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>
                        {change.workItems.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    )}
                    <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-small)', fontWeight: 600 }}>
                      Cost Difference: ₹{change.costDifference}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          <Card padding="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--font-size-h4)', margin: 0 }}>Proof Pack (Evidence)</h3>
              <Badge variant="violet">ServiceTrace</Badge>
            </div>
            
            {booking.evidence?.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                {booking.evidence.map((item, idx) => (
                  <div key={idx} style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                    <div style={{ height: 120, backgroundColor: 'var(--color-surface-muted)', backgroundImage: `url(${item.file?.url})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {!item.file?.url && <Camera size={32} color="var(--color-text-disabled)" />}
                    </div>
                    <div style={{ padding: 'var(--space-2)' }}>
                      <Badge variant="neutral" size="sm" style={{ marginBottom: 'var(--space-1)' }}>{item.type.replace('_', ' ')}</Badge>
                      <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
                        {item.description || 'No description provided'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-4)', border: '1px dashed var(--color-border-strong)', borderRadius: 'var(--radius-md)' }}>
                <Camera size={32} style={{ margin: '0 auto var(--space-2)', opacity: 0.5 }} />
                <div>No evidence uploaded yet.</div>
                <div style={{ fontSize: 'var(--font-size-caption)', marginTop: 'var(--space-1)' }}>Protect yourself by uploading before/after photos.</div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Card padding="md">
            <h4 style={{ fontSize: 'var(--font-size-body)', marginBottom: 'var(--space-3)' }}>Customer Details</h4>
            <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>{booking.customerSnapshot?.name}</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><MapPin size={14} /> Service Location</span>
              {/* Note: Normally location is passed down properly in the DTO, mocking for now if missing */}
              <div style={{ marginLeft: 22 }}>
                {booking.serviceRequest?.location ? (
                  <>
                    <div>{booking.serviceRequest.location.addressLine1}</div>
                    <div>{booking.serviceRequest.location.city}, {booking.serviceRequest.location.state} {booking.serviceRequest.location.postalCode}</div>
                  </>
                ) : 'Address details available after confirmation'}
              </div>
            </div>
          </Card>
          
          <Card padding="md">
             <h4 style={{ fontSize: 'var(--font-size-body)', marginBottom: 'var(--space-3)' }}>Earnings (Net)</h4>
             <div style={{ fontSize: 'var(--font-size-display)', fontWeight: 700, color: 'var(--color-success)', lineHeight: 1 }}>
               ₹{booking.pricingSnapshot?.totalAmount?.toFixed(2)}
             </div>
             <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
               Payment processed securely after job completion.
             </div>
          </Card>
        </div>
      </div>

      {/* Evidence Modal */}
      <Modal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        title="Upload Proof Pack Evidence"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEvidenceModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEvidenceSubmit} loading={isUploading} leftIcon={<Upload size={16} />}>Upload</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Select
            label="Evidence Type"
            value={evidenceData.type}
            onChange={(e) => setEvidenceData({...evidenceData, type: e.target.value})}
            options={[
              { value: 'BEFORE_SERVICE', label: 'Before Service (Current State)' },
              { value: 'SCOPE_CHANGE', label: 'Scope Change Justification' },
              { value: 'AFTER_SERVICE', label: 'After Service (Completed Work)' },
              { value: 'COMPLETION', label: 'Final Completion Proof' },
            ]}
          />
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Upload File</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setEvidenceData({...evidenceData, file: e.target.files[0]})}
              style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
            />
            <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
              Supported formats: JPEG, PNG, GIF, PDF (Max 10MB)
            </div>
          </div>
          <Input
            label="Description"
            placeholder="Briefly describe what this photo shows"
            value={evidenceData.description}
            onChange={(e) => setEvidenceData({...evidenceData, description: e.target.value})}
          />
        </div>
      </Modal>
    </div>
  );
}
