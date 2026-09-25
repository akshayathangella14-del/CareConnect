const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.CLIENT_ORIGINS = 'http://localhost:3000';

const createApp = require('../src/app');

test('GET /api/v1/health returns process health without secrets', async () => {
  const app = createApp();

  const response = await request(app)
    .get('/api/v1/health')
    .set('Origin', 'http://localhost:3000')
    .expect(200);

  assert.equal(response.body.success, true);
  assert.equal(response.body.data.name, 'CareConnect API');
  assert.equal(response.body.data.version, 'v1');
  assert.equal(response.body.data.environment, 'test');
  assert.equal(response.body.data.process, 'running');
  assert.ok(['disconnected', 'connected', 'connecting', 'disconnecting', 'unknown'].includes(response.body.data.database));
  assert.equal(Object.hasOwn(response.body.data, 'uri'), false);
});

test('GET /api/v1/stats returns a public platform summary payload', async () => {
  const app = createApp();

  const response = await request(app)
    .get('/api/v1/stats')
    .set('Origin', 'http://localhost:3000')
    .expect(200);

  assert.equal(response.body.success, true);
  assert.ok(response.body.data.stats);
  assert.equal(typeof response.body.data.stats.totalRequests, 'number');
  assert.equal(typeof response.body.data.stats.totalProviders, 'number');
});

test('unknown API routes return a consistent JSON 404 response', async () => {
  const app = createApp();

  const response = await request(app)
    .get('/api/v1/missing-route')
    .set('Origin', 'http://localhost:3000')
    .expect(404);

  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'NOT_FOUND');
  assert.match(response.body.error.message, /Route not found/);
});

test('centralized error handler returns predictable malformed JSON response', async () => {
  const app = createApp();

  const response = await request(app)
    .post('/api/v1/health')
    .set('Origin', 'http://localhost:3000')
    .set('Content-Type', 'application/json')
    .send('{"invalidJson":')
    .expect(400);

  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'BAD_REQUEST');
  assert.equal(response.body.error.message, 'Malformed JSON request body.');
});

test('configured CORS rejects unapproved origins', async () => {
  const app = createApp();

  const response = await request(app)
    .get('/api/v1/health')
    .set('Origin', 'https://unapproved.example')
    .expect(403);

  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'FORBIDDEN');
});
