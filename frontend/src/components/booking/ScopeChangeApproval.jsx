import React, { useState } from 'react';
import { Card, Button, Alert } from '@/components';
import { ShieldAlert, Check, X } from 'lucide-react';
import { useDecideScopeChangeMutation } from '@/features/bookings';

const ScopeChangeApproval = ({ bookingId, scopeChange, onDecision }) => {
  const [decideScopeChange, { isLoading, error }] = useDecideScopeChangeMutation();
  const [notes, setNotes] = useState('');

  if (scopeChange.status !== 'PENDING_CUSTOMER_APPROVAL') return null;

  const handleDecision = async (decision) => {
    try {
      await decideScopeChange({
        id: bookingId,
        changeId: scopeChange._id,
        decision,
        notes
      }).unwrap();
      
      if (onDecision) onDecision();
    } catch (err) {
      console.error(`Failed to ${decision} scope change:`, err);
    }
  };

  return (
    <Card padding="lg" style={{ border: '2px solid var(--color-warning)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', color: 'var(--color-warning)' }}>
        <ShieldAlert size={24} />
        <h3 style={{ fontSize: 'var(--font-size-h4)', margin: 0 }}>Scope Change Request</h3>
      </div>
      
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
        Your provider has requested a change to the original agreed scope of work. Please review the details below.
      </p>

      {error && (
        <Alert variant="error" style={{ marginBottom: 'var(--space-4)' }}>
          {error?.data?.error?.message || 'Failed to submit decision'}
        </Alert>
      )}

      <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)' }}>
        <div style={{ fontSize: 'var(--font-size-small)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Reason for Change</div>
        <p style={{ margin: 0, fontSize: 'var(--font-size-small)' }}>{scopeChange.reason}</p>
        
        {scopeChange.workItems?.length > 0 && (
          <>
            <div style={{ fontSize: 'var(--font-size-small)', fontWeight: 600, marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>Additional Work Items</div>
            <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', fontSize: 'var(--font-size-small)' }}>
              {scopeChange.workItems.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </>
        )}

        <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-small)', fontWeight: 600 }}>Additional Cost Request</div>
          <div style={{ fontSize: 'var(--font-size-body)', fontWeight: 700, color: 'var(--color-primary)' }}>
            ₹{scopeChange.costDifference}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Notes / Response (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any comments regarding your decision..."
          style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', minHeight: '60px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
        <Button 
          variant="outline" 
          onClick={() => handleDecision('REJECTED')}
          disabled={isLoading}
          leftIcon={<X size={16} />}
        >
          Reject Change
        </Button>
        <Button 
          variant="primary" 
          onClick={() => handleDecision('APPROVED')}
          loading={isLoading}
          leftIcon={<Check size={16} />}
        >
          Approve Change
        </Button>
      </div>
    </Card>
  );
};

export default ScopeChangeApproval;
