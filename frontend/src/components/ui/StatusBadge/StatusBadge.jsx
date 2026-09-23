import { Badge } from '@/components/ui/Badge';

/**
 * StatusBadge Component
 * Maps business logic statuses to visual variants.
 */
const statusVariantMap = {
  // Service Request Statuses
  DRAFT: 'neutral',
  SUBMITTED: 'info',
  AI_REVIEW: 'violet',
  MANUAL_REVIEW: 'warning',
  MATCHING: 'primary',
  QUOTING: 'primary',
  PROVIDER_SELECTED: 'success',
  SCHEDULED: 'success',
  CLOSED: 'neutral',
  CANCELLED: 'error',
  
  // Quote Statuses
  VIEWED: 'info',
  CHANGES_REQUESTED: 'warning',
  REVISED: 'primary',
  ACCEPTED: 'success',
  REJECTED: 'error',
  EXPIRED: 'neutral',
  WITHDRAWN: 'neutral',

  // Booking Statuses
  PENDING_CONFIRMATION: 'warning',
  CONFIRMED: 'success',
  PROVIDER_EN_ROUTE: 'primary',
  ARRIVED: 'info',
  IN_PROGRESS: 'primary',
  AWAITING_CUSTOMER_CONFIRMATION: 'warning',
  COMPLETED: 'success',

  // Invoice / Payment
  ISSUED: 'info',
  UNPAID: 'warning',
  PAID: 'success',
  VOID: 'neutral',

  // Default fallback
  DEFAULT: 'neutral',
};

export function StatusBadge({ status, dot = true, className = '' }) {
  if (!status) return null;

  const normalizedStatus = typeof status === 'string' ? status.toUpperCase() : 'DEFAULT';
  const variant = statusVariantMap[normalizedStatus] || 'neutral';
  
  // Format the text: "PENDING_CONFIRMATION" -> "Pending Confirmation"
  const formattedText = normalizedStatus
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <Badge variant={variant} dot={dot} className={className}>
      {formattedText}
    </Badge>
  );
}
