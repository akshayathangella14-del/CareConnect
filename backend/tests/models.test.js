const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

const User = require('../src/models/User');
const ProviderProfile = require('../src/models/ProviderProfile');
const ServiceCategory = require('../src/models/ServiceCategory');
const Skill = require('../src/models/Skill');
const AvailabilitySlot = require('../src/models/AvailabilitySlot');
const PricingRule = require('../src/models/PricingRule');
const ServiceRequest = require('../src/models/ServiceRequest');
const Quote = require('../src/models/Quote');
const Booking = require('../src/models/Booking');
const Invoice = require('../src/models/Invoice');
const Review = require('../src/models/Review');
const Dispute = require('../src/models/Dispute');
const Notification = require('../src/models/Notification');
const AuditLog = require('../src/models/AuditLog');

const objectId = () => new mongoose.Types.ObjectId();

const models = [
  User,
  ProviderProfile,
  ServiceCategory,
  Skill,
  AvailabilitySlot,
  PricingRule,
  ServiceRequest,
  Quote,
  Booking,
  Invoice,
  Review,
  Dispute,
  Notification,
  AuditLog,
];

const requiredValidationCases = [
  [User, {}],
  [ProviderProfile, {}],
  [ServiceCategory, {}],
  [Skill, {}],
  [AvailabilitySlot, {}],
  [PricingRule, {}],
  [ServiceRequest, {}],
  [Quote, {}],
  [Booking, {}],
  [Invoice, {}],
  [Review, {}],
  [Dispute, {}],
  [Notification, {}],
  [AuditLog, {}],
];

test('all approved Phase 1 models import successfully', () => {
  assert.deepEqual(
    models.map((model) => model.modelName),
    [
      'User',
      'ProviderProfile',
      'ServiceCategory',
      'Skill',
      'AvailabilitySlot',
      'PricingRule',
      'ServiceRequest',
      'Quote',
      'Booking',
      'Invoice',
      'Review',
      'Dispute',
      'Notification',
      'AuditLog',
    ]
  );
});

test('required fields reject obviously invalid documents', async () => {
  for (const [Model, payload] of requiredValidationCases) {
    await assert.rejects(() => new Model(payload).validate(), mongoose.Error.ValidationError);
  }
});

test('User role values are constrained', async () => {
  const user = new User({
    name: 'Example Customer',
    email: 'customer@example.com',
    passwordHash: 'hashed-password',
    role: 'NOT_A_ROLE',
  });

  await assert.rejects(() => user.validate(), mongoose.Error.ValidationError);
});

test('Provider verification status values are constrained', async () => {
  const profile = new ProviderProfile({
    user: objectId(),
    displayName: 'Care Provider',
    verificationStatus: 'APPROVED',
  });

  await assert.rejects(() => profile.validate(), mongoose.Error.ValidationError);
});

test('ServiceRequest status values are constrained', async () => {
  const request = new ServiceRequest({
    customer: objectId(),
    title: 'Leaking sink',
    description: 'Water is leaking under the kitchen sink.',
    category: objectId(),
    location: { serviceArea: 'Bengaluru Central' },
    status: 'DONE',
  });

  await assert.rejects(() => request.validate(), mongoose.Error.ValidationError);
});

test('Quote status values are constrained', async () => {
  const quote = new Quote({
    serviceRequest: objectId(),
    provider: objectId(),
    scope: { summary: 'Repair kitchen sink leak.' },
    totalAmount: 1200,
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'SENT',
  });

  await assert.rejects(() => quote.validate(), mongoose.Error.ValidationError);
});

test('Booking status values are constrained', async () => {
  const booking = new Booking({
    serviceRequest: objectId(),
    acceptedQuote: objectId(),
    customer: objectId(),
    provider: objectId(),
    scheduledStartAt: new Date(Date.now() + 60 * 60 * 1000),
    scheduledEndAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    customerSnapshot: { name: 'Example Customer', email: 'customer@example.com' },
    providerSnapshot: { displayName: 'Care Provider' },
    scopeSnapshot: { summary: 'Repair kitchen sink leak.' },
    pricingSnapshot: { totalAmount: 1200 },
    status: 'FINISHED',
  });

  await assert.rejects(() => booking.validate(), mongoose.Error.ValidationError);
});

test('Invoice status and payment/refund status are separate constrained fields', async () => {
  assert.notEqual(Invoice.schema.path('status'), Invoice.schema.path('paymentStatus'));

  const invalidInvoiceStatus = new Invoice({
    booking: objectId(),
    customer: objectId(),
    provider: objectId(),
    invoiceNumber: 'INV-001',
    lineItems: [{ description: 'Labor', quantity: 1, unitPrice: 1000, amount: 1000 }],
    subtotal: 1000,
    total: 1000,
    status: 'REFUNDED',
    paymentStatus: 'NOT_APPLICABLE',
  });

  const invalidPaymentStatus = new Invoice({
    booking: objectId(),
    customer: objectId(),
    provider: objectId(),
    invoiceNumber: 'INV-002',
    lineItems: [{ description: 'Labor', quantity: 1, unitPrice: 1000, amount: 1000 }],
    subtotal: 1000,
    total: 1000,
    status: 'ISSUED',
    paymentStatus: 'PAID',
  });

  await assert.rejects(() => invalidInvoiceStatus.validate(), mongoose.Error.ValidationError);
  await assert.rejects(() => invalidPaymentStatus.validate(), mongoose.Error.ValidationError);
});

test('core model relationships use ObjectId references', () => {
  assert.equal(ProviderProfile.schema.path('user').options.ref, 'User');
  assert.equal(ProviderProfile.schema.path('skills').caster.options.ref, 'Skill');
  assert.equal(ServiceCategory.schema.path('parent').options.ref, 'ServiceCategory');
  assert.equal(Skill.schema.path('category').options.ref, 'ServiceCategory');
  assert.equal(AvailabilitySlot.schema.path('provider').options.ref, 'ProviderProfile');
  assert.equal(ServiceRequest.schema.path('customer').options.ref, 'User');
  assert.equal(ServiceRequest.schema.path('category').options.ref, 'ServiceCategory');
  assert.equal(Quote.schema.path('serviceRequest').options.ref, 'ServiceRequest');
  assert.equal(Quote.schema.path('provider').options.ref, 'ProviderProfile');
  assert.equal(Booking.schema.path('serviceRequest').options.ref, 'ServiceRequest');
  assert.equal(Booking.schema.path('acceptedQuote').options.ref, 'Quote');
  assert.equal(Booking.schema.path('customer').options.ref, 'User');
  assert.equal(Booking.schema.path('provider').options.ref, 'ProviderProfile');
  assert.equal(Invoice.schema.path('booking').options.ref, 'Booking');
  assert.equal(Review.schema.path('booking').options.ref, 'Booking');
  assert.equal(Dispute.schema.path('booking').options.ref, 'Booking');
  assert.equal(Notification.schema.path('recipient').options.ref, 'User');
  assert.equal(AuditLog.schema.path('actor').options.ref, 'User');
});

test('Booking supports immutable historical snapshots', () => {
  assert.ok(Booking.schema.path('customerSnapshot'));
  assert.ok(Booking.schema.path('providerSnapshot'));
  assert.ok(Booking.schema.path('scopeSnapshot'));
  assert.ok(Booking.schema.path('pricingSnapshot'));
});
