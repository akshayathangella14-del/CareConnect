const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.CLIENT_ORIGINS = 'http://localhost:3000';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/careconnect_business_test';
process.env.JWT_SECRET = 'test-secret-for-careconnect-business-workflows';
process.env.JWT_EXPIRES_IN = '1h';

const createApp = require('../src/app');
const authService = require('../src/services/auth.service');
const User = require('../src/models/User');
const ProviderProfile = require('../src/models/ProviderProfile');
const ServiceCategory = require('../src/models/ServiceCategory');
const Skill = require('../src/models/Skill');
const PricingRule = require('../src/models/PricingRule');
const AvailabilitySlot = require('../src/models/AvailabilitySlot');
const ServiceRequest = require('../src/models/ServiceRequest');
const Quote = require('../src/models/Quote');
const Booking = require('../src/models/Booking');
const Invoice = require('../src/models/Invoice');
const Review = require('../src/models/Review');
const Dispute = require('../src/models/Dispute');
const Notification = require('../src/models/Notification');
const AuditLog = require('../src/models/AuditLog');

const app = createApp();
const auth = (token) => ({ Authorization: `Bearer ${token}` });
const now = Date.now();
const schedule = {
  startAt: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(),
  endAt: new Date(now + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
};

const cleanDatabase = async () => {
  await Promise.all([
    User.deleteMany({}),
    ProviderProfile.deleteMany({}),
    ServiceCategory.deleteMany({}),
    Skill.deleteMany({}),
    PricingRule.deleteMany({}),
    AvailabilitySlot.deleteMany({}),
    ServiceRequest.deleteMany({}),
    Quote.deleteMany({}),
    Booking.deleteMany({}),
    Invoice.deleteMany({}),
    Review.deleteMany({}),
    Dispute.deleteMany({}),
    Notification.deleteMany({}),
    AuditLog.deleteMany({}),
  ]);
};

const createPrivilegedUser = async (role, email) => {
  const user = await User.create({
    name: role,
    email,
    passwordHash: await authService.hashPassword('Password123'),
    role,
    status: 'ACTIVE',
  });

  return {
    user,
    token: authService.createToken(user),
  };
};

const register = async ({ name, email, role }) => {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .set('Origin', 'http://localhost:3000')
    .send({ name, email, password: 'Password123', phone: '9999999999', role })
    .expect(201);

  return response.body.data;
};

test.before(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

test.beforeEach(cleanDatabase);

test.after(async () => {
  await cleanDatabase();
  await mongoose.disconnect();
});

test('complete business lifecycle enforces roles, ownership, state, traceability, and no extra collections', async () => {
  const admin = await createPrivilegedUser('ADMIN', 'admin-business@example.com');
  const support = await createPrivilegedUser('SUPPORT_AGENT', 'support-business@example.com');
  const customer = await register({ name: 'Customer One', email: 'customer-one@example.com', role: 'CUSTOMER' });
  const otherCustomer = await register({ name: 'Customer Two', email: 'customer-two@example.com', role: 'CUSTOMER' });
  const provider = await register({ name: 'Pipe Expert', email: 'provider-one@example.com', role: 'SERVICE_PROVIDER' });
  const unverifiedProvider = await register({ name: 'New Provider', email: 'provider-two@example.com', role: 'SERVICE_PROVIDER' });

  const category = (await request(app)
    .post('/api/v1/categories')
    .set(auth(admin.token))
    .send({ name: 'Plumbing', slug: 'plumbing', description: 'Plumbing work' })
    .expect(201)).body.data.category;

  const skill = (await request(app)
    .post('/api/v1/skills')
    .set(auth(admin.token))
    .send({ name: 'Leak Repair', slug: 'leak-repair', category: category._id })
    .expect(201)).body.data.skill;

  await request(app)
    .post('/api/v1/pricing-rules')
    .set(auth(admin.token))
    .send({ category: category._id, serviceArea: 'Central', basePrice: 1000, laborCharge: 500, minimumCharge: 1000 })
    .expect(201);

  const providerProfile = (await request(app)
    .patch('/api/v1/providers/me')
    .set(auth(provider.token))
    .send({
      displayName: 'Pipe Expert',
      bio: 'Reliable plumbing help',
      experienceYears: 5,
      serviceAreas: [{ label: 'Central', city: 'Bengaluru' }],
      skills: [skill._id],
    })
    .expect(200)).body.data.provider;

  await request(app)
    .post(`/api/v1/providers/${providerProfile._id}/verification`)
    .set(auth(provider.token))
    .send({ verificationStatus: 'VERIFIED' })
    .expect(403);

  await request(app)
    .post(`/api/v1/providers/${providerProfile._id}/verification`)
    .set(auth(admin.token))
    .send({ verificationStatus: 'VERIFIED', verificationNotes: 'Documents reviewed.' })
    .expect(200);

  await request(app)
    .post('/api/v1/availability')
    .set(auth(provider.token))
    .send({ ...schedule, timezone: 'Asia/Kolkata' })
    .expect(201);

  await request(app)
    .post('/api/v1/availability')
    .set(auth(provider.token))
    .send({ ...schedule, timezone: 'Asia/Kolkata' })
    .expect(409);

  const serviceRequest = (await request(app)
    .post('/api/v1/service-requests')
    .set(auth(customer.token))
    .send({
      title: 'Kitchen leak repair',
      description: 'Need Leak Repair for a kitchen pipe leak.',
      category: category._id,
      location: { serviceArea: 'Central', city: 'Bengaluru' },
      preferredSchedule: schedule,
      urgency: 'HIGH',
    })
    .expect(201)).body.data.serviceRequest;

  await request(app)
    .get(`/api/v1/service-requests/${serviceRequest._id}`)
    .set(auth(otherCustomer.token))
    .expect(403);

  const submittedRequest = (await request(app)
    .post(`/api/v1/service-requests/${serviceRequest._id}/submit`)
    .set(auth(customer.token))
    .expect(200)).body.data.serviceRequest;

  assert.equal(submittedRequest.aiUnderstanding.source, 'FALLBACK_RULES');
  assert.notEqual(submittedRequest.status, 'DRAFT');

  await request(app)
    .patch(`/api/v1/service-requests/${serviceRequest._id}/ai-understanding`)
    .set(auth(customer.token))
    .send({ requiredSkills: [skill._id], problemType: 'Leakage', urgency: 'HIGH', confidence: 1 })
    .expect(200);

  const matches = (await request(app)
    .get(`/api/v1/service-requests/${serviceRequest._id}/matches`)
    .set(auth(customer.token))
    .expect(200)).body.data.matches;

  assert.equal(matches.length, 1);
  assert.equal(matches[0].provider._id, providerProfile._id);
  assert.notEqual(matches[0].provider.user.email, unverifiedProvider.user.email);

  const quote = (await request(app)
    .post(`/api/v1/service-requests/${serviceRequest._id}/quotes`)
    .set(auth(provider.token))
    .send({
      submit: true,
      scope: {
        summary: 'Repair leaking kitchen pipe.',
        tasks: [{ description: 'Inspect leak' }, { description: 'Replace damaged fitting' }],
        exclusions: ['Wall repainting'],
        unclearItems: ['Hidden damage'],
      },
      pricingBreakdown: { currency: 'INR', labor: 1000, materials: 500 },
      totalAmount: 1500,
      estimatedDuration: { value: 2, unit: 'HOURS' },
      validUntil: new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .expect(201)).body.data.quote;

  const quotes = (await request(app)
    .get(`/api/v1/service-requests/${serviceRequest._id}/quotes`)
    .set(auth(customer.token))
    .expect(200)).body.data.quotes;
  assert.equal(quotes.length, 1);

  const accepted = (await request(app)
    .post(`/api/v1/quotes/${quote._id}/accept`)
    .set(auth(customer.token))
    .expect(200)).body.data;
  const booking = accepted.booking;
  assert.equal(booking.status, 'PENDING_CONFIRMATION');

  await request(app)
    .post(`/api/v1/bookings/${booking._id}/confirm`)
    .set(auth(admin.token))
    .expect(403);

  await request(app)
    .post(`/api/v1/bookings/${booking._id}/confirm`)
    .set(auth(provider.token))
    .expect(200);

  const conflictingRequest = (await request(app)
    .post('/api/v1/service-requests')
    .set(auth(otherCustomer.token))
    .send({
      title: 'Another leak repair',
      description: 'Need Leak Repair urgently.',
      category: category._id,
      location: { serviceArea: 'Central', city: 'Bengaluru' },
      preferredSchedule: schedule,
      urgency: 'HIGH',
    })
    .expect(201)).body.data.serviceRequest;
  await request(app).post(`/api/v1/service-requests/${conflictingRequest._id}/submit`).set(auth(otherCustomer.token)).expect(200);
  const conflictingQuote = (await request(app)
    .post(`/api/v1/service-requests/${conflictingRequest._id}/quotes`)
    .set(auth(provider.token))
    .send({
      submit: true,
      scope: { summary: 'Conflicting repair.', tasks: [{ description: 'Repair' }] },
      pricingBreakdown: { currency: 'INR', labor: 1000 },
      totalAmount: 1000,
      validUntil: new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .expect(201)).body.data.quote;
  await request(app).post(`/api/v1/quotes/${conflictingQuote._id}/accept`).set(auth(otherCustomer.token)).expect(409);

  await request(app).post(`/api/v1/bookings/${booking._id}/en-route`).set(auth(provider.token)).expect(200);
  await request(app).post(`/api/v1/bookings/${booking._id}/arrived`).set(auth(provider.token)).expect(200);
  await request(app).post(`/api/v1/bookings/${booking._id}/start`).set(auth(provider.token)).expect(200);

  const evidence = (await request(app)
    .post(`/api/v1/bookings/${booking._id}/evidence`)
    .set(auth(provider.token))
    .send({ type: 'BEFORE_SERVICE', description: 'Leak before repair', file: { url: 'https://example.test/before.jpg', publicId: 'before-1' } })
    .expect(201)).body.data.evidence;
  assert.equal(evidence.type, 'BEFORE_SERVICE');

  const scopeChange = (await request(app)
    .post(`/api/v1/bookings/${booking._id}/scope-changes`)
    .set(auth(provider.token))
    .send({ reason: 'Additional valve required', workItems: ['Replace valve'], laborAmount: 300, materialAmount: 200, costDifference: 500 })
    .expect(201)).body.data.scopeChange;

  await request(app)
    .post(`/api/v1/bookings/${booking._id}/scope-changes/${scopeChange._id}/approve`)
    .set(auth(provider.token))
    .expect(403);

  await request(app)
    .post(`/api/v1/bookings/${booking._id}/scope-changes/${scopeChange._id}/approve`)
    .set(auth(customer.token))
    .expect(200);

  await request(app).post(`/api/v1/bookings/${booking._id}/request-completion`).set(auth(provider.token)).expect(200);

  const invoiceBeforeCompletion = (await request(app)
    .post(`/api/v1/bookings/${booking._id}/invoice`)
    .set(auth(provider.token))
    .expect(201)).body.data.invoice;
  assert.equal(invoiceBeforeCompletion.total, 2000);

  await request(app).post(`/api/v1/bookings/${booking._id}/confirm-completion`).set(auth(customer.token)).expect(200);

  await request(app)
    .post('/api/v1/reviews')
    .set(auth(customer.token))
    .send({ booking: booking._id, rating: 5, comment: 'Excellent work.' })
    .expect(201);

  await request(app)
    .post('/api/v1/reviews')
    .set(auth(customer.token))
    .send({ booking: booking._id, rating: 5 })
    .expect(409);

  const dispute = (await request(app)
    .post('/api/v1/disputes')
    .set(auth(customer.token))
    .send({ booking: booking._id, reason: 'BILLING', description: 'Please explain material charge.' })
    .expect(201)).body.data.dispute;

  await request(app)
    .patch(`/api/v1/disputes/${dispute._id}`)
    .set(auth(customer.token))
    .send({ status: 'RESOLVED', resolution: { summary: 'Self resolved' } })
    .expect(403);

  await request(app)
    .patch(`/api/v1/disputes/${dispute._id}`)
    .set(auth(support.token))
    .send({ status: 'RESOLVED', resolution: { summary: 'Charge explained', outcome: 'INFO_PROVIDED' } })
    .expect(200);

  const trace = (await request(app)
    .get(`/api/v1/bookings/${booking._id}/service-trace`)
    .set(auth(customer.token))
    .expect(200)).body.data.serviceTrace;
  assert.ok(trace.timeline.some((event) => event.type === 'QUOTE_ACCEPTED'));
  assert.ok(trace.timeline.some((event) => event.type === 'EVIDENCE_ADDED'));

  const proofPack = (await request(app)
    .get(`/api/v1/bookings/${booking._id}/proof-pack`)
    .set(auth(customer.token))
    .expect(200)).body.data.proofPack;
  assert.equal(proofPack.approvedScopeChanges.length, 1);

  const notifications = (await request(app)
    .get('/api/v1/notifications')
    .set(auth(customer.token))
    .expect(200)).body.data.notifications;
  assert.ok(notifications.length > 0);
  await request(app).patch('/api/v1/notifications/read-all').set(auth(customer.token)).expect(200);

  const audits = (await request(app)
    .get('/api/v1/audit-logs')
    .set(auth(admin.token))
    .expect(200)).body.data.auditLogs;
  assert.ok(audits.some((audit) => audit.action === 'PROVIDER_VERIFICATION_UPDATED'));
  assert.ok(audits.some((audit) => audit.action === 'QUOTE_ACCEPTED_BOOKING_CREATED'));

  const analytics = (await request(app)
    .get('/api/v1/analytics/summary')
    .set(auth(admin.token))
    .expect(200)).body.data;
  assert.ok(analytics.totalUsers >= 5);
  assert.ok(analytics.bookings >= 1);

  assert.equal(Boolean(mongoose.models.ServiceTrace), false);
  assert.equal(Boolean(mongoose.models.ProofPack), false);
  assert.equal(Boolean(mongoose.models.ScopeMatch), false);
  assert.equal(Boolean(mongoose.models.ScopeGuard), false);
});

test('expired quotes cannot be accepted', async () => {
  const admin = await createPrivilegedUser('ADMIN', 'admin-expired@example.com');
  const customer = await register({ name: 'Expired Customer', email: 'expired-customer@example.com', role: 'CUSTOMER' });
  const provider = await register({ name: 'Expired Provider', email: 'expired-provider@example.com', role: 'SERVICE_PROVIDER' });

  const category = (await request(app).post('/api/v1/categories').set(auth(admin.token)).send({ name: 'Electrical', slug: 'electrical' }).expect(201)).body.data.category;
  const skill = (await request(app).post('/api/v1/skills').set(auth(admin.token)).send({ name: 'Wire Repair', slug: 'wire-repair', category: category._id }).expect(201)).body.data.skill;
  const providerProfile = (await request(app).patch('/api/v1/providers/me').set(auth(provider.token)).send({ serviceAreas: [{ label: 'Central' }], skills: [skill._id] }).expect(200)).body.data.provider;
  await request(app).post(`/api/v1/providers/${providerProfile._id}/verification`).set(auth(admin.token)).send({ verificationStatus: 'VERIFIED' }).expect(200);
  await request(app).post('/api/v1/availability').set(auth(provider.token)).send(schedule).expect(201);

  const serviceRequest = (await request(app).post('/api/v1/service-requests').set(auth(customer.token)).send({
    title: 'Wire repair',
    description: 'Need Wire Repair',
    category: category._id,
    location: { serviceArea: 'Central' },
    preferredSchedule: schedule,
  }).expect(201)).body.data.serviceRequest;
  await request(app).post(`/api/v1/service-requests/${serviceRequest._id}/submit`).set(auth(customer.token)).expect(200);
  const quote = (await request(app).post(`/api/v1/service-requests/${serviceRequest._id}/quotes`).set(auth(provider.token)).send({
    submit: true,
    scope: { summary: 'Repair wire.', tasks: [{ description: 'Repair' }] },
    totalAmount: 500,
    validUntil: new Date(Date.now() - 1000).toISOString(),
  }).expect(201)).body.data.quote;

  await request(app).post(`/api/v1/quotes/${quote._id}/accept`).set(auth(customer.token)).expect(409);
});
