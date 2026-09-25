import { useState } from 'react';
import { CreditCard, Landmark, Wallet, Smartphone } from 'lucide-react';
import { Modal, Button, Select } from '@/components';
import { useCreatePaymentMutation } from '@/features/payments';

const paymentOptions = [
  { value: 'CARD', label: 'Card', icon: <CreditCard size={16} /> },
  { value: 'UPI', label: 'UPI', icon: <Smartphone size={16} /> },
  { value: 'NETBANKING', label: 'Net Banking', icon: <Landmark size={16} /> },
  { value: 'WALLET', label: 'Wallet', icon: <Wallet size={16} /> },
];

export default function PaymentModal({ isOpen, invoice, onClose, onSuccess }) {
  const [createPayment, { isLoading }] = useCreatePaymentMutation();
  const [method, setMethod] = useState('CARD');

  if (!invoice) return null;

  const handlePay = async () => {
    try {
      await createPayment({
        invoiceId: invoice._id,
        amount: Number(invoice.total || 0),
        currency: invoice.currency || 'INR',
        method,
      }).unwrap();

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Payment failed', error);
    }
  };

  const selectedMethod = paymentOptions.find((option) => option.value === method) || paymentOptions[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete payment"
      size="sm"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', width: '100%' }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={isLoading} onClick={handlePay}>
            Pay {invoice.currency || 'INR'} {Number(invoice.total || 0).toFixed(2)}
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Invoice</span>
          <strong>{invoice.invoiceNumber || `INV-${String(invoice._id || '').slice(0, 8).toUpperCase()}`}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Total</span>
          <strong style={{ fontSize: 'var(--font-size-h4)' }}>
            {invoice.currency || 'INR'} {Number(invoice.total || 0).toFixed(2)}
          </strong>
        </div>
        <Select
          label="Payment method"
          value={method}
          onChange={(event) => setMethod(event.target.value)}
          options={paymentOptions.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
        />
        <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)' }}>
            {selectedMethod.icon}
            <span>{selectedMethod.label}</span>
          </div>
          <p style={{ margin: 'var(--space-2) 0 0', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
            Secure payment is processed through a simulated payment gateway for this demo workflow.
          </p>
        </div>
      </div>
    </Modal>
  );
}
