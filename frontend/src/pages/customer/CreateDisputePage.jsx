import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCreateDisputeMutation } from '@/features/disputes';
import { Card, Button, Input, Textarea, Select, Alert } from '@/components';
import { AlertTriangle } from 'lucide-react';

export default function CreateDisputePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId') || '';
  const [createDispute, { isLoading }] = useCreateDisputeMutation();

  const [formData, setFormData] = useState({
    booking: bookingId,
    reason: 'SERVICE_QUALITY',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDispute(formData).unwrap();
      navigate('/bookings');
    } catch (err) {
      console.error('Failed to create dispute:', err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <AlertTriangle size={28} color="var(--color-error)" /> Open a Dispute
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Report an issue with a completed service. Our support team will investigate.
        </p>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Alert variant="warning" title="Before opening a dispute">
            Please ensure you have attempted to resolve the issue directly with the provider first.
          </Alert>

          <Input
            label="Booking ID"
            name="booking"
            value={formData.booking}
            onChange={(e) => setFormData({ ...formData, booking: e.target.value })}
            placeholder="Enter the booking ID"
            required
          />

          <Select
            label="Reason for Dispute"
            name="reason"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            options={[
              { value: 'SERVICE_QUALITY', label: 'Service Quality' },
              { value: 'BILLING', label: 'Billing' },
              { value: 'SCOPE_CHANGE', label: 'Scope Change' },
              { value: 'DAMAGE', label: 'Property Damage' },
              { value: 'NO_SHOW', label: 'No Show' },
              { value: 'OTHER', label: 'Other' },
            ]}
            required
          />

          <Textarea
            label="Detailed Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            placeholder="Please describe the issue in detail..."
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="secondary" onClick={() => navigate(-1)} type="button">Cancel</Button>
            <Button variant="error" type="submit" loading={isLoading}>Submit Dispute</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
