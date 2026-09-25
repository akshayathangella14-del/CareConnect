import { Receipt } from 'lucide-react';
import { Card, EmptyState, StatusBadge, DataTable } from '@/components';
import { useListPaymentsQuery } from '@/features/payments';

export default function PaymentsPage() {
  const { data: payments = [], isLoading, isFetching } = useListPaymentsQuery();

  const columns = [
    {
      header: 'Payment',
      key: 'id',
      render: (payment) => payment.gatewayTransactionId || payment._id?.slice(0, 10).toUpperCase(),
    },
    {
      header: 'Invoice',
      key: 'invoice',
      render: (payment) => payment.invoice?.invoiceNumber || 'Invoice',
    },
    {
      header: 'Date',
      key: 'date',
      render: (payment) => new Date(payment.createdAt).toLocaleDateString(),
    },
    {
      header: 'Amount',
      key: 'amount',
      render: (payment) => `${payment.currency || 'INR'} ${Number(payment.amount || 0).toFixed(2)}`,
    },
    {
      header: 'Method',
      key: 'method',
      render: (payment) => payment.method,
    },
    {
      header: 'Status',
      key: 'status',
      render: (payment) => <StatusBadge status={payment.status} size="sm" />,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Receipt size={28} color="var(--color-primary)" /> Payment history
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Review payments made through CareConnect.</p>
      </div>

      {isLoading ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading payments...</div>
      ) : payments.length === 0 ? (
        <EmptyState icon={<Receipt size={48} />} title="No payments yet" description="Completed service payments will appear here." />
      ) : (
        <div style={{ opacity: isFetching ? 0.6 : 1 }}>
          <Card>
            <DataTable columns={columns} data={payments} keyField="_id" />
          </Card>
        </div>
      )}
    </div>
  );
}
