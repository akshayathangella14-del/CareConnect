import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetDisputeQuery, useUpdateDisputeMutation } from '@/features/disputes';
import { Card, Button, Alert, Tabs, Badge, Timeline, Select, Input } from '@/components';
import { Headphones, Shield, MessageSquare, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function SupportDisputeDetailPage() {
  const { id } = useParams();
  const { data: dispute, isLoading, error } = useGetDisputeQuery(id);
  const [updateDispute, { isLoading: isUpdating }] = useUpdateDisputeMutation();
  
  const [resolutionStatus, setResolutionStatus] = useState('INVESTIGATING');
  const [resolution, setResolution] = useState('');

  if (isLoading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading dispute details...</div>;
  
  if (error || !dispute) return (
    <Alert variant="error" title="Error loading dispute">
      {error?.data?.error || 'Could not find the dispute case.'}
    </Alert>
  );

  const handleResolve = async () => {
    try {
      await updateDispute({
        id,
        status: resolutionStatus,
        resolution
      }).unwrap();
    } catch (err) {
      console.error('Failed to update dispute:', err);
    }
  };

  const isResolved = dispute.status === 'RESOLVED' || dispute.status === 'REJECTED';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
            <h1 style={{ fontSize: 'var(--font-size-h2)', margin: 0 }}>Case #{dispute._id.substring(0, 8).toUpperCase()}</h1>
            <Badge variant={dispute.status === 'OPEN' ? 'error' : dispute.status === 'INVESTIGATING' ? 'warning' : dispute.status === 'REJECTED' ? 'error' : 'success'}>
              {dispute.status}
            </Badge>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
            <span>Opened: {new Date(dispute.createdAt).toLocaleString()}</span>
            <span>Reason: {dispute.reason.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--space-6)', alignItems: 'start' }}>
        
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <Card padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', color: 'var(--color-error)' }}>
              <MessageSquare size={20} />
              <h3 style={{ fontSize: 'var(--font-size-h4)', margin: 0 }}>Initiator Claim</h3>
            </div>
            <p style={{ color: 'var(--color-text-primary)', lineHeight: 1.6, backgroundColor: 'var(--color-surface-muted)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
              "{dispute.description}"
            </p>
          </Card>

          <Tabs defaultValue="servicetrace">
            <Tabs.List>
              <Tabs.Trigger value="servicetrace">ServiceTrace Log</Tabs.Trigger>
              <Tabs.Trigger value="evidence">Case Evidence</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="servicetrace">
              <Card padding="lg">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                  <Shield size={20} color="var(--color-violet)" />
                  <h3 style={{ fontSize: 'var(--font-size-h4)', margin: 0 }}>ServiceTrace Audit</h3>
                </div>
                
                {/* Mocking ServiceTrace items for dispute view since we don't fetch full booking here natively unless we pull it. */}
                <Alert variant="info" title="ServiceTrace Integration">
                  In a real scenario, this tab automatically pulls the immutable timeline from the associated Booking ({dispute.booking?._id}).
                </Alert>
              </Card>
            </Tabs.Content>

            <Tabs.Content value="evidence">
              <Card padding="lg">
                 <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                  <ShieldAlert size={20} color="var(--color-warning)" />
                  <h3 style={{ fontSize: 'var(--font-size-h4)', margin: 0 }}>User Uploaded Evidence</h3>
                </div>
                {dispute.evidence?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {dispute.evidence.map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>
                        View Evidence Document {idx + 1}
                      </a>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: 'var(--color-text-secondary)' }}>No evidence uploaded for this dispute.</div>
                )}
              </Card>
            </Tabs.Content>
          </Tabs>

        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Card padding="md">
            <h4 style={{ fontSize: 'var(--font-size-body)', marginBottom: 'var(--space-3)' }}>Case Resolution</h4>
            
            {isResolved ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <Alert variant="success" title="Case Closed">
                  {dispute.resolution || 'Resolved successfully.'}
                </Alert>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Select
                  label="Update Status"
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value)}
                  options={[
                    { value: 'INVESTIGATING', label: 'Investigating' },
                    { value: 'RESOLVED', label: 'Resolved (Closed)' },
                    { value: 'REJECTED', label: 'Rejected (Closed)' },
                  ]}
                />

                {(resolutionStatus === 'RESOLVED' || resolutionStatus === 'REJECTED') && (
                  <Input
                    label="Resolution"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Enter final remarks..."
                    required
                  />
                )}

                <Button
                  onClick={handleResolve}
                  loading={isUpdating}
                  variant={resolutionStatus === 'RESOLVED' ? 'success' : 'primary'}
                >
                  Update Case
                </Button>
              </div>
            )}
          </Card>
          
          <Card padding="md">
            <h4 style={{ fontSize: 'var(--font-size-body)', marginBottom: 'var(--space-3)' }}>Parties Involved</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-small)' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>Initiated By: </span>
                <span style={{ fontWeight: 500 }}>{dispute.initiatorType} ({dispute.initiator?.name || 'User'})</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>Booking Ref: </span>
                <Link to={`/bookings/${dispute.booking?._id}`} style={{ color: 'var(--color-primary)' }}>
                  {dispute.booking?._id?.substring(0, 8)}
                </Link>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
