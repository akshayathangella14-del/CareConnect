const Invoice = require('../models/Invoice');

const buildInvoiceFromBooking = (booking) => {
  let subtotal = booking.pricingSnapshot.subtotal || 0;
  let tax = booking.pricingSnapshot.tax || 0;
  let discount = booking.pricingSnapshot.discount || 0;

  const lineItems = [
    {
      description: 'Base service quote',
      quantity: 1,
      unitPrice: subtotal,
      amount: subtotal,
    },
  ];

  // Add approved scope changes
  if (booking.scopeChanges && booking.scopeChanges.length > 0) {
    const approvedChanges = booking.scopeChanges.filter(c => c.status === 'APPROVED');
    for (const change of approvedChanges) {
      if (change.costDifference > 0) {
        lineItems.push({
          description: `Scope change: ${change.reason.substring(0, 50)}...`,
          quantity: 1,
          unitPrice: change.costDifference,
          amount: change.costDifference,
        });
        subtotal += change.costDifference;
      }
    }
  }

  const total = subtotal + tax - discount;
  const platformFee = Math.round(total * 0.15 * 100) / 100; // 15% commission
  const providerEarnings = total - platformFee;

  return {
    lineItems,
    subtotal,
    tax,
    discount,
    total,
    platformFee,
    providerEarnings,
    currency: booking.pricingSnapshot.currency || 'INR',
  };
};

const createInvoiceForBooking = async (booking) => {
  const existing = await Invoice.findOne({ booking: booking._id });
  if (existing) {
    return existing;
  }

  const calculated = buildInvoiceFromBooking(booking);

  return Invoice.create({
    booking: booking._id,
    customer: booking.customer,
    provider: booking.provider,
    invoiceNumber: `INV-${Date.now()}-${booking._id.toString().slice(-6)}`,
    ...calculated,
    issuedAt: new Date(),
    dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'ISSUED',
    paymentStatus: 'UNPAID',
  });
};

module.exports = {
  buildInvoiceFromBooking,
  createInvoiceForBooking,
};
