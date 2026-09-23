import { useState } from 'react';
import { useListProvidersQuery, useVerifyProviderMutation } from '@/features/providers';
import { Card, Button, StatusBadge, DataTable, EmptyState, Badge, Modal, Alert } from '@/components';
import { ShieldCheck, UserCheck, XCircle, CheckCircle } from 'lucide-react';

export default function ProviderVerificationPage() {
  const { data: providers = [], isLoading, isFetching } = useListProvidersQuery();
  const [verifyProvider, { isLoading: isVerifying }] = useVerifyProviderMutation();

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [actionType, setActionType] = useState(null); // 'VERIFY' or 'REJECT'
  const [notes, setNotes] = useState('');

  // Operations usually only cares about PENDING verification
  const pendingProviders = providers.filter(p => p.verificationStatus === 'PENDING');

  const handleAction = async () => {
    if (!selectedProvider || !actionType) return;

    try {
      await verifyProvider({
        id: selectedProvider._id,
        verificationStatus: actionType === 'VERIFY' ? 'VERIFIED' : 'REJECTED',
        verificationNotes: notes
      }).unwrap();

      setSelectedProvider(null);
      setActionType(null);
      setNotes('');
    } catch (err) {
      console.error('Failed to update verification:', err);
    }
  };

  const openActionModal = (provider, type) => {
    setSelectedProvider(provider);
    setActionType(type);
    setNotes('');
  };

  const columns = [
    {
      header: 'Provider',
      key: 'provider',
      render: (p) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{p.displayName}</div>
          <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
            User ID: {p.user?._id?.substring(0,8)}
          </div>
        </div>
      ),
    },
    {
      header: 'Experience',
      key: 'experience',
      render: (p) => `${p.experienceYears || 0} years`,
    },
    {
      header: 'Status',
      key: 'status',
      render: (p) => <Badge variant="warning">{p.verificationStatus}</Badge>,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (p) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button size="sm" variant="success" onClick={() => openActionModal(p, 'VERIFY')} leftIcon={<CheckCircle size={14}/>}>Approve</Button>
          <Button size="sm" variant="error" onClick={() => openActionModal(p, 'REJECT')} leftIcon={<XCircle size={14}/>}>Reject</Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <ShieldCheck size={28} color="var(--color-violet)" /> Provider Verifications
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Review and approve new service provider applications.</p>
      </div>

      {isLoading ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading applications...</div>
      ) : pendingProviders.length === 0 ? (
        <EmptyState
          icon={<UserCheck size={28} />}
          title="No pending verifications"
          description="All provider applications have been processed."
        />
      ) : (
        <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity var(--transition-fast)' }}>
          <Card>
            <DataTable
              columns={columns}
              data={pendingProviders}
              keyField="_id"
            />
          </Card>
        </div>
      )}

      <Modal
        isOpen={!!selectedProvider}
        onClose={() => setSelectedProvider(null)}
        title={`${actionType === 'VERIFY' ? 'Approve' : 'Reject'} Provider`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedProvider(null)}>Cancel</Button>
            <Button 
              variant={actionType === 'VERIFY' ? 'success' : 'error'} 
              loading={isVerifying}
              onClick={handleAction}
            >
              Confirm {actionType === 'VERIFY' ? 'Approval' : 'Rejection'}
            </Button>
          </>
        }
      >
        {selectedProvider && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Alert variant={actionType === 'VERIFY' ? 'success' : 'error'}>
              You are about to {actionType === 'VERIFY' ? 'approve' : 'reject'} the application for <strong>{selectedProvider.displayName}</strong>.
            </Alert>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontSize: 'var(--font-size-small)', fontWeight: 500 }}>Internal Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Reason for decision..."
                style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', minHeight: 100 }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
