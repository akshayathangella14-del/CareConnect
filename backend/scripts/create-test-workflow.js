const mongoose = require('mongoose');
const User = require('../src/models/User');
const ProviderProfile = require('../src/models/ProviderProfile');
const ServiceCategory = require('../src/models/ServiceCategory');
const ServiceRequest = require('../src/models/ServiceRequest');
const Quote = require('../src/models/Quote');
const Booking = require('../src/models/Booking');
const AvailabilitySlot = require('../src/models/AvailabilitySlot');
const Notification = require('../src/models/Notification');
require('dotenv').config();

const TEST_QUOTE_TITLE = '[CareConnect workflow test] Appliance quote';
const TEST_BOOKING_TITLE = '[CareConnect workflow test] Provider booking';

const getLocation = (provider) => {
  const area = provider.serviceAreas?.[0] || {};
  return {
    addressLine1: 'CareConnect workflow test address',
    city: area.city || 'Mumbai',
    state: area.state || 'Maharashtra',
    postalCode: area.postalCode || '400001',
    serviceArea: area.label || area.city || 'Mumbai',
  };
};

const buildSchedule = () => ({
  startAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
});

const createQuoteTest = async ({ customer, provider, category, location, schedule }) => {
  let serviceRequest = await ServiceRequest.findOne({ title: TEST_QUOTE_TITLE, customer: customer._id });
  if (serviceRequest) {
    const quote = await Quote.findOne({ serviceRequest: serviceRequest._id, provider: provider._id });
    return { serviceRequest, quote };
  }

  serviceRequest = await ServiceRequest.create({
    customer: customer._id,
    title: TEST_QUOTE_TITLE,
    description: 'Test appliance repair request for quote comparison.',
    category: category._id,
    location,
    preferredSchedule: schedule,
    urgency: 'NORMAL',
    status: 'QUOTING',
    aiUnderstanding: {
      source: 'FALLBACK_RULES',
      category: category._id,
      requiredSkills: provider.skills || [],
      problemType: 'Appliance repair test',
      urgency: 'NORMAL',
      diagnosticNotes: 'Seeded workflow test request.',
      suggestedTasks: ['Diagnose appliance', 'Provide repair estimate'],
      confidence: 0.9,
    },
    confirmedUnderstanding: {
      source: 'CUSTOMER_CONFIRMED',
      category: category._id,
      requiredSkills: provider.skills || [],
      problemType: 'Appliance repair test',
      urgency: 'NORMAL',
      diagnosticNotes: 'Seeded workflow test request.',
      suggestedTasks: ['Diagnose appliance', 'Provide repair estimate'],
      confidence: 0.9,
    },
  });

  const quote = await Quote.create({
    serviceRequest: serviceRequest._id,
    provider: provider._id,
    scope: {
      summary: 'Appliance diagnosis and repair estimate.',
      tasks: [
        { description: 'Diagnose appliance issue', included: true },
        { description: 'Share repair recommendation', included: true },
      ],
      exclusions: ['Replacement parts not included until approved'],
    },
    pricingBreakdown: { currency: 'INR', labor: 600, materials: 250, tax: 0 },
    totalAmount: 850,
    estimatedDuration: { value: 2, unit: 'HOURS' },
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'SUBMITTED',
  });

  await Notification.create({
    recipient: customer._id,
    type: 'QUOTE',
    title: 'New workflow test quote',
    message: 'A test provider submitted a quote for your appliance request.',
    relatedResource: { resourceType: 'Quote', resourceId: quote._id },
  });

  return { serviceRequest, quote };
};

const createBookingTest = async ({ customer, provider, category, location, schedule }) => {
  let serviceRequest = await ServiceRequest.findOne({ title: TEST_BOOKING_TITLE, customer: customer._id });
  if (serviceRequest) {
    const booking = await Booking.findOne({ serviceRequest: serviceRequest._id });
    return { serviceRequest, booking };
  }

  serviceRequest = await ServiceRequest.create({
    customer: customer._id,
    title: TEST_BOOKING_TITLE,
    description: 'Test booking for provider status transitions.',
    category: category._id,
    location,
    preferredSchedule: schedule,
    urgency: 'NORMAL',
    status: 'PROVIDER_SELECTED',
  });

  const quote = await Quote.create({
    serviceRequest: serviceRequest._id,
    provider: provider._id,
    scope: {
      summary: 'Test appliance service booking.',
      tasks: [{ description: 'Complete workflow test service', included: true }],
      exclusions: [],
    },
    pricingBreakdown: { currency: 'INR', labor: 800, materials: 300, tax: 0 },
    totalAmount: 1100,
    estimatedDuration: { value: 2, unit: 'HOURS' },
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'ACCEPTED',
    acceptedAt: new Date(),
  });

  const booking = await Booking.create({
    serviceRequest: serviceRequest._id,
    acceptedQuote: quote._id,
    customer: customer._id,
    provider: provider._id,
    scheduledStartAt: schedule.startAt,
    scheduledEndAt: schedule.endAt,
    status: 'PENDING_CONFIRMATION',
    customerSnapshot: {
      userId: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
    },
    providerSnapshot: {
      providerProfileId: provider._id,
      userId: provider.user?._id || provider.user,
      displayName: provider.displayName,
      phone: provider.user?.phone || '',
    },
    scopeSnapshot: {
      summary: quote.scope.summary,
      tasks: quote.scope.tasks.map((task) => task.description),
      exclusions: [],
    },
    pricingSnapshot: {
      currency: 'INR',
      subtotal: 1100,
      tax: 0,
      totalAmount: 1100,
    },
    statusEvents: [{
      type: 'BOOKING_CREATED',
      actor: customer._id,
      description: 'Seeded workflow test booking.',
    }],
  });

  await Notification.create({
    recipient: provider.user?._id || provider.user,
    type: 'BOOKING',
    title: 'Workflow test booking ready',
    message: 'Confirm this booking to test the provider workflow transitions.',
    relatedResource: { resourceType: 'Booking', resourceId: booking._id },
  });

  return { serviceRequest, booking };
};

async function createTestWorkflow() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to configured MongoDB database.');

  const customer = await User.findOne({ role: 'CUSTOMER', status: 'ACTIVE' });
  const provider = await ProviderProfile.findOne({ verificationStatus: 'VERIFIED' }).populate('user', 'name email phone');
  const category = await ServiceCategory.findOne({ isActive: true, name: /appliance/i }) || await ServiceCategory.findOne({ isActive: true });

  if (!customer) throw new Error('No active customer found.');
  if (!provider) throw new Error('No verified provider found.');
  if (!category) throw new Error('No active service category found.');

  const location = getLocation(provider);
  const schedule = buildSchedule();
  const availability = await AvailabilitySlot.findOne({
    provider: provider._id,
    status: 'AVAILABLE',
    startAt: { $lte: schedule.startAt },
    endAt: { $gte: schedule.endAt },
  });

  if (!availability) {
    await AvailabilitySlot.create({
      provider: provider._id,
      startAt: schedule.startAt,
      endAt: schedule.endAt,
      timezone: 'Asia/Kolkata',
      status: 'AVAILABLE',
    });
  }

  const quoteTest = await createQuoteTest({ customer, provider, category, location, schedule });
  const bookingTest = await createBookingTest({ customer, provider, category, location, schedule });

  console.log('Workflow test data is ready:');
  console.log(`- Submitted quote request: ${quoteTest.serviceRequest._id}`);
  console.log(`- Submitted quote: ${quoteTest.quote?._id || 'already existed'}`);
  console.log(`- Provider-selected booking request: ${bookingTest.serviceRequest._id}`);
  console.log(`- Pending provider booking: ${bookingTest.booking?._id || 'already existed'}`);
}

createTestWorkflow()
  .catch((error) => {
    console.error('Failed to create workflow test data:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
