const Invoice = require('../models/Invoice');

const sumApprovedScopeChanges = (booking) => booking.scopeChanges
  .filter((change) => change.status === 'APPROVED')
  .reduce((sum, change) => sum + (change.costDifference || 0), 0);

const buildInvoiceFromBooking = (booking) => {
  const baseTotal = booking.pricingSnapshot.totalAmount || 0;
  const scopeChangeTotal = sumApprovedScopeChanges(booking);
  const subtotal = baseTotal + scopeChangeTotal;
  const tax = 0;
  const discount = 0;
  const total = subtotal + tax - discount;

  const lineItems = [
    {
      description: 'Accepted service scope',
      quantity: 1,
      unitPrice: baseTotal,
      amount: baseTotal,
    },
  ];

  if (scopeChangeTotal > 0) {
    lineItems.push({
      description: 'Approved scope changes',
      quantity: 1,
      unitPrice: scopeChangeTotal,
      amount: scopeChangeTotal,
    });
  }

  return {
    lineItems,
    subtotal,
    tax,
    discount,
    total,
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
