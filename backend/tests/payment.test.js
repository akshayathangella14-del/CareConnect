const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');

process.env.NODE_ENV = 'test';
process.env.CLIENT_ORIGINS = 'http://localhost:3000';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careconnect_payment_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-for-careconnect-payment-tests';
process.env.JWT_EXPIRES_IN = '1h';

const createApp = require('../src/app');
const User = require('../src/models/User');
const ProviderProfile = require('../src/models/ProviderProfile');
const Invoice = require('../src/models/Invoice');
const Payment = require('../src/models/Payment');

const app = createApp();

const buildToken = (user) => jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
  issuer: 'careconnect-api',
});

test.before(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.init();
  await ProviderProfile.init();
  await Invoice.init();
  await Payment.init();
});

test.beforeEach(async () => {
  await Payment.deleteMany({});
  await Invoice.deleteMany({});
  await ProviderProfile.deleteMany({});
  await User.deleteMany({});
});

test.after(async () => {
  await Payment.deleteMany({});
  await Invoice.deleteMany({});
  await ProviderProfile.deleteMany({});
  await User.deleteMany({});
  await mongoose.disconnect();
});

test('customer can pay an unpaid invoice and the invoice is marked paid', async () => {
  const customer = await User.create({
    name: 'Test Customer',
    email: 'customer-payment@example.com',
    passwordHash: 'placeholder',
    role: 'CUSTOMER',
    status: 'ACTIVE',
  });

  const providerProfile = await ProviderProfile.create({
    user: new mongoose.Types.ObjectId(),
    displayName: 'Test Provider',
    verificationStatus: 'VERIFIED',
  });

  const invoice = await Invoice.create({
    booking: new mongoose.Types.ObjectId(),
    customer: customer._id,
    provider: providerProfile._id,
    invoiceNumber: 'INV-TEST-1001',
    lineItems: [{ description: 'Service', quantity: 1, unitPrice: 2500, amount: 2500 }],
    subtotal: 2500,
    tax: 0,
    discount: 0,
    total: 2500,
    currency: 'INR',
    status: 'ISSUED',
    paymentStatus: 'UNPAID',
  });

  const response = await request(app)
    .post('/api/v1/payments')
    .set('Origin', 'http://localhost:3000')
    .set('Authorization', `Bearer ${buildToken(customer)}`)
    .send({ invoiceId: invoice._id.toString(), method: 'CARD' })
    .expect(201);

  assert.equal(response.body.success, true);
  assert.equal(response.body.data.payment.status, 'SUCCEEDED');
  assert.equal(response.body.data.payment.amount, 2500);

  const updatedInvoice = await Invoice.findById(invoice._id);
  assert.equal(updatedInvoice.status, 'PAID');
  assert.equal(updatedInvoice.paymentStatus, 'PAID');

  const storedPayment = await Payment.findById(response.body.data.payment._id);
  assert.ok(storedPayment);
  assert.equal(storedPayment.invoice.toString(), invoice._id.toString());
});

test('customers can list their payment history', async () => {
  const customer = await User.create({
    name: 'History Customer',
    email: 'history-payment@example.com',
    passwordHash: 'placeholder',
    role: 'CUSTOMER',
    status: 'ACTIVE',
  });

  const providerProfile = await ProviderProfile.create({
    user: new mongoose.Types.ObjectId(),
    displayName: 'History Provider',
    verificationStatus: 'VERIFIED',
  });

  const invoice = await Invoice.create({
    booking: new mongoose.Types.ObjectId(),
    customer: customer._id,
    provider: providerProfile._id,
    invoiceNumber: 'INV-TEST-1002',
    lineItems: [{ description: 'Service', quantity: 1, unitPrice: 1499, amount: 1499 }],
    subtotal: 1499,
    tax: 0,
    discount: 0,
    total: 1499,
    currency: 'INR',
    status: 'ISSUED',
    paymentStatus: 'UNPAID',
  });

  await Payment.create({
    invoice: invoice._id,
    customer: customer._id,
    provider: providerProfile._id,
    amount: 1499,
    currency: 'INR',
    method: 'UPI',
    status: 'SUCCEEDED',
    gatewayTransactionId: 'txn-history-123',
  });

  const response = await request(app)
    .get('/api/v1/payments')
    .set('Origin', 'http://localhost:3000')
    .set('Authorization', `Bearer ${buildToken(customer)}`)
    .expect(200);

  assert.equal(response.body.success, true);
  assert.ok(Array.isArray(response.body.data.payments));
  assert.ok(response.body.data.payments.some((payment) => payment.amount === 1499));
});