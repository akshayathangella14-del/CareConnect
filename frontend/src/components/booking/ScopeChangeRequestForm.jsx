import React, { useState } from 'react';
import { Card, Button, Input, Alert } from '@/components';
import { Plus, Trash2 } from 'lucide-react';
import { useRequestScopeChangeMutation } from '@/features/bookings';

const ScopeChangeRequestForm = ({ bookingId, onCancel, onSuccess }) => {
  const [requestScopeChange, { isLoading, error }] = useRequestScopeChangeMutation();
  
  const [reason, setReason] = useState('');
  const [workItems, setWorkItems] = useState(['']);
  const [laborAmount, setLaborAmount] = useState(0);
  const [materialAmount, setMaterialAmount] = useState(0);

  const handleAddWorkItem = () => setWorkItems([...workItems, '']);
  const handleRemoveWorkItem = (index) => setWorkItems(workItems.filter((_, i) => i !== index));
  const handleWorkItemChange = (index, value) => {
    const newItems = [...workItems];
    newItems[index] = value;
    setWorkItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    try {
      await requestScopeChange({
        id: bookingId,
        reason,
        workItems: workItems.filter(i => i.trim()),
        laborAmount: Number(laborAmount) || 0,
        materialAmount: Number(materialAmount) || 0,
        costDifference: (Number(laborAmount) || 0) + (Number(materialAmount) || 0)
      }).unwrap();
      
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to request scope change:', err);
    }
  };

  return (
    <Card padding="lg" style={{ border: '2px solid var(--color-warning)' }}>
      <h3 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-4)', color: 'var(--color-warning)' }}>Request Scope Change</h3>
      
      {error && (
        <Alert variant="error" style={{ marginBottom: 'var(--space-4)' }}>
          {error?.data?.error?.message || 'Failed to submit request'}
        </Alert>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Reason for Change *</label>
          <textarea
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why is this change necessary? e.g. Found water damage behind the wall..."
            style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', minHeight: '80px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Additional Work Required</label>
          {workItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <Input
                value={item}
                onChange={(e) => handleWorkItemChange(index, e.target.value)}
                placeholder="e.g. Replace damaged drywall section"
                style={{ flex: 1 }}
              />
              {workItems.length > 1 && (
                <Button type="button" variant="ghost" onClick={() => handleRemoveWorkItem(index)} style={{ color: 'var(--color-error)' }}>
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={handleAddWorkItem} leftIcon={<Plus size={16} />}>
            Add Item
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Additional Labor Cost (INR)</label>
            <Input
              type="number"
              min="0"
              value={laborAmount}
              onChange={(e) => setLaborAmount(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Additional Material Cost (INR)</label>
            <Input
              type="number"
              min="0"
              value={materialAmount}
              onChange={(e) => setMaterialAmount(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 'var(--font-size-h4)', fontWeight: 600 }}>
            Total Additional: INR {(Number(laborAmount) || 0) + (Number(materialAmount) || 0)}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>Cancel</Button>
            <Button type="submit" variant="warning" loading={isLoading}>Submit to Customer</Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default ScopeChangeRequestForm;
