import { useListInvoicesQuery } from '@/features/invoices';
import { Card, Button, StatusBadge, DataTable, EmptyState } from '@/components';
import { Receipt, Download } from 'lucide-react';

export default function InvoicesPage() {
  const { data: invoices = [], isLoading, isFetching } = useListInvoicesQuery();

  const handleDownloadPdf = (invoiceId) => {
    window.open(`/api/v1/invoices/${invoiceId}/download`, '_blank');
  };

  const columns = [
    {
      header: 'Invoice ID',
      key: 'id',
      render: (inv) => (
        <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
          INV-{inv._id ? inv._id.substring(0, 8).toUpperCase() : 'UNKNOWN'}
        </div>
      ),
    },
    {
      header: 'Booking Ref',
      key: 'booking',
      render: (inv) =>
        typeof inv.booking === 'string'
          ? inv.booking.substring(0, 8).toUpperCase()
          : inv.booking?._id
          ? inv.booking._id.substring(0, 8).toUpperCase()
          : 'UNKNOWN',
    },
    {
      header: 'Date',
      key: 'date',
      render: (inv) => (inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : 'N/A'),
    },
    {
      header: 'Amount',
      key: 'amount',
      render: (inv) => {
        const amount = typeof inv.total === 'number'
          ? inv.total
          : typeof inv.totalAmount === 'number'
          ? inv.totalAmount
          : 0;
        return (
          <span style={{ fontWeight: 600 }}>
            {inv.currency || 'INR'} {amount.toFixed(2)}
          </span>
        );
      },
    },
    {
      header: 'Status',
      key: 'status',
      render: (inv) => <StatusBadge status={inv.status || 'DRAFT'} size="sm" />,
    },
    {
      header: 'Action',
      key: 'action',
      render: (inv) => (
        <Button 
          size="sm" 
          variant="outline" 
          leftIcon={<Download size={14} />}
          onClick={() => handleDownloadPdf(inv._id)}
        >
          PDF
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1
          style={{
            fontSize: 'var(--font-size-h2)',
            marginBottom: 'var(--space-2)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <Receipt size={28} color="var(--color-primary)" /> My Invoices
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>View and download your billing history and receipts.</p>
      </div>

      {isLoading ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading invoices...</div>
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={<Receipt size={48} />}
          title="No invoices yet"
          description="Invoices will appear here once a job is completed."
        />
      ) : (
        <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity var(--transition-fast)' }}>
          <Card>
            <DataTable columns={columns} data={invoices} keyField="_id" />
          </Card>
        </div>
      )}
    </div>
  );
}
