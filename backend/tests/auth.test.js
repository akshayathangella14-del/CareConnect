const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');

process.env.NODE_ENV = 'test';
process.env.CLIENT_ORIGINS = 'http://localhost:3000';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careconnect_auth_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-for-careconnect-auth-tests';
process.env.JWT_EXPIRES_IN = '1h';

const createApp = require('../src/app');
const User = require('../src/models/User');
const ProviderProfile = require('../src/models/ProviderProfile');
const { authenticate } = require('../src/middleware/auth.middleware');
const { authorizeRoles } = require('../src/middleware/role.middleware');
const errorHandler = require('../src/middleware/error.middleware');
const { canAccessProviderProfile } = require('../src/utils/ownership');
const authService = require('../src/services/auth.service');

const app = createApp();

const validRegistration = (overrides = {}) => ({
  name: 'Security Tester',
  email: `security-${Date.now()}-${Math.random()}@example.com`,
  password: 'Password123',
  phone: '9999999999',
  role: 'CUSTOMER',
  ...overrides,
});

test.before(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.init();
  await ProviderProfile.init();
});

test.beforeEach(async () => {
  await ProviderProfile.deleteMany({});
  await User.deleteMany({});
});

test.after(async () => {
  await ProviderProfile.deleteMany({});
  await User.deleteMany({});
  await mongoose.disconnect();
});

test('valid registration succeeds, hashes password, and does not return passwordHash', async () => {
  const payload = validRegistration();

  const response = await request(app)
    .post('/api/v1/auth/register')
    .set('Origin', 'http://localhost:3000')
    .send(payload)
    .expect(201);

  assert.equal(response.body.success, true);
  assert.ok(response.body.data.token);
  assert.equal(response.body.data.user.email, payload.email.toLowerCase());
  assert.equal(response.body.data.user.role, 'CUSTOMER');
  assert.equal(Object.hasOwn(response.body.data.user, 'passwordHash'), false);

  const user = await User.findOne({ email: payload.email.toLowerCase() }).select('+passwordHash');
  assert.ok(user);
  assert.notEqual(user.passwordHash, payload.password);
  assert.match(user.passwordHash, /^\$2[aby]\$/);
});

test('duplicate email registration is rejected', async () => {
  const payload = validRegistration({ email: 'duplicate@example.com' });

  await request(app)
    .post('/api/v1/auth/register')
    .set('Origin', 'http://localhost:3000')
    .send(payload)
    .expect(201);

  const response = await request(app)
    .post('/api/v1/auth/register')
    .set('Origin', 'http://localhost:3000')
    .send(payload)
    .expect(409);

  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'CONFLICT');
});

test('public registration cannot create ADMIN', async () => {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .set('Origin', 'http://localhost:3000')
    .send(validRegistration({ role: 'ADMIN' }))
    .expect(400);

  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'BAD_REQUEST');
});

test('invalid registration input is rejected', async () => {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .set('Origin', 'http://localhost:3000')
    .send({
      name: 'A',
      email: 'not-an-email',
      password: 'short',
      role: 'CUSTOMER',
    })
    .expect(400);

  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'BAD_REQUEST');
});

test('provider registration creates a pending provider profile owned by the user', async () => {
  const payload = validRegistration({
    email: 'provider@example.com',
    role: 'SERVICE_PROVIDER',
  });

  const response = await request(app)
    .post('/api/v1/auth/register')
    .set('Origin', 'http://localhost:3000')
    .send(payload)
    .expect(201);

  assert.equal(response.body.data.user.role, 'SERVICE_PROVIDER');
  assert.equal(response.body.data.providerProfile.verificationStatus, 'PENDING');

  const providerProfile = await ProviderProfile.findOne({ user: response.body.data.user.id });
  assert.ok(providerProfile);
  assert.equal(providerProfile.verificationStatus, 'PENDING');
});

test('valid login succeeds without exposing passwordHash', async () => {
  const payload = validRegistration({ email: 'login@example.com' });

  await request(app)
    .post('/api/v1/auth/register')
    .set('Origin', 'http://localhost:3000')
    .send(payload)
    .expect(201);

  const response = await request(app)
    .post('/api/v1/auth/login')
    .set('Origin', 'http://localhost:3000')
    .send({ email: payload.email, password: payload.password })
    .expect(200);

  assert.equal(response.body.success, true);
  assert.ok(response.body.data.token);
  assert.equal(Object.hasOwn(response.body.data.user, 'passwordHash'), false);
});

test('wrong password and nonexistent account fail safely', async () => {
  const payload = validRegistration({ email: 'wrong-password@example.com' });

  await request(app)
    .post('/api/v1/auth/register')
    .set('Origin', 'http://localhost:3000')
    .send(payload)
    .expect(201);

  const wrongPassword = await request(app)
    .post('/api/v1/auth/login')
    .set('Origin', 'http://localhost:3000')
    .send({ email: payload.email, password: 'WrongPassword123' })
    .expect(401);

  const nonexistent = await request(app)
    .post('/api/v1/auth/login')
    .set('Origin', 'http://localhost:3000')
    .send({ email: 'nobody@example.com', password: 'WrongPassword123' })
    .expect(401);

  assert.equal(wrongPassword.body.error.message, 'Invalid email or password.');
  assert.equal(nonexistent.body.error.message, 'Invalid email or password.');
});

test('inactive and suspended users cannot authenticate normally', async () => {
  const password = 'Password123';
  const passwordHash = await authService.hashPassword(password);

  const inactive = await User.create({
    name: 'Inactive User',
    email: 'inactive@example.com',
    passwordHash,
    role: 'CUSTOMER',
    status: 'INACTIVE',
  });

  const suspended = await User.create({
    name: 'Suspended User',
    email: 'suspended@example.com',
    passwordHash,
    role: 'CUSTOMER',
    status: 'SUSPENDED',
  });

  const inactiveToken = jwt.sign({ sub: inactive._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '1h',
    issuer: 'careconnect-api',
  });
  const suspendedToken = jwt.sign({ sub: suspended._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '1h',
    issuer: 'careconnect-api',
  });

  await request(app)
    .post('/api/v1/auth/login')
    .set('Origin', 'http://localhost:3000')
    .send({ email: inactive.email, password })
    .expect(403);

  await request(app)
    .post('/api/v1/auth/login')
    .set('Origin', 'http://localhost:3000')
    .send({ email: suspended.email, password })
    .expect(403);

  await request(app)
    .get('/api/v1/auth/me')
    .set('Origin', 'http://localhost:3000')
    .set('Authorization', `Bearer ${inactiveToken}`)
    .expect(403);

  await request(app)
    .get('/api/v1/auth/me')
    .set('Origin', 'http://localhost:3000')
    .set('Authorization', `Bearer ${suspendedToken}`)
    .expect(403);
});

test('valid token is accepted by /auth/me and missing token is rejected', async () => {
  const payload = validRegistration({ email: 'me@example.com' });

  const registered = await request(app)
    .post('/api/v1/auth/register')
    .set('Origin', 'http://localhost:3000')
    .send(payload)
    .expect(201);

  const me = await request(app)
    .get('/api/v1/auth/me')
    .set('Origin', 'http://localhost:3000')
    .set('Authorization', `Bearer ${registered.body.data.token}`)
    .expect(200);

  assert.equal(me.body.data.user.email, payload.email);
  assert.equal(Object.hasOwn(me.body.data.user, 'passwordHash'), false);

  await request(app)
    .get('/api/v1/auth/me')
    .set('Origin', 'http://localhost:3000')
    .expect(401);
});

test('malformed and invalid tokens are rejected', async () => {
  await request(app)
    .get('/api/v1/auth/me')
    .set('Origin', 'http://localhost:3000')
    .set('Authorization', 'Token abc')
    .expect(401);

  await request(app)
    .get('/api/v1/auth/me')
    .set('Origin', 'http://localhost:3000')
    .set('Authorization', 'Bearer invalid.token.value')
    .expect(401);
});

test('expired token is rejected', async () => {
  const user = await User.create({
    name: 'Expired Token User',
    email: 'expired@example.com',
    passwordHash: '$2a$12$abcdefghijklmnopqrstuuPOEo4NeB/e.qQpeROecQwulBvXRuewe',
    role: 'CUSTOMER',
    status: 'ACTIVE',
  });

  const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '-1s',
    issuer: 'careconnect-api',
  });

  await request(app)
    .get('/api/v1/auth/me')
    .set('Origin', 'http://localhost:3000')
    .set('Authorization', `Bearer ${token}`)
    .expect(401);
});

test('role authorization allows permitted roles and rejects disallowed roles', async () => {
  const roleApp = express();
  roleApp.get('/admin-only', authenticate, authorizeRoles('ADMIN'), (_req, res) => {
    res.status(200).json({ success: true });
  });
  roleApp.use(errorHandler);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    passwordHash: '$2a$12$abcdefghijklmnopqrstuuPOEo4NeB/e.qQpeROecQwulBvXRuewe',
    role: 'ADMIN',
    status: 'ACTIVE',
  });
  const customer = await User.create({
    name: 'Customer User',
    email: 'customer@example.com',
    passwordHash: '$2a$12$abcdefghijklmnopqrstuuPOEo4NeB/e.qQpeROecQwulBvXRuewe',
    role: 'CUSTOMER',
    status: 'ACTIVE',
  });

  const adminToken = jwt.sign({ sub: admin._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '1h',
    issuer: 'careconnect-api',
  });
  const customerToken = jwt.sign({ sub: customer._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '1h',
    issuer: 'careconnect-api',
  });

  await request(roleApp)
    .get('/admin-only')
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200);

  await request(roleApp)
    .get('/admin-only')
    .set('Authorization', `Bearer ${customerToken}`)
    .expect(403);
});

test('provider ownership helper allows own profile and rejects another provider profile', async () => {
  const providerUser = await User.create({
    name: 'Provider Owner',
    email: 'provider-owner@example.com',
    passwordHash: '$2a$12$abcdefghijklmnopqrstuuPOEo4NeB/e.qQpeROecQwulBvXRuewe',
    role: 'SERVICE_PROVIDER',
    status: 'ACTIVE',
  });
  const otherProviderUser = await User.create({
    name: 'Other Provider',
    email: 'other-provider@example.com',
    passwordHash: '$2a$12$abcdefghijklmnopqrstuuPOEo4NeB/e.qQpeROecQwulBvXRuewe',
    role: 'SERVICE_PROVIDER',
    status: 'ACTIVE',
  });
  const profile = await ProviderProfile.create({
    user: providerUser._id,
    displayName: 'Provider Owner',
  });

  assert.equal(canAccessProviderProfile(profile, providerUser), true);
  assert.equal(canAccessProviderProfile(profile, otherProviderUser), false);
});
