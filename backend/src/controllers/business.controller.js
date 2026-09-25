const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const ServiceCategory = require('../models/ServiceCategory');
const Skill = require('../models/Skill');
const PricingRule = require('../models/PricingRule');
const ProviderProfile = require('../models/ProviderProfile');
const AvailabilitySlot = require('../models/AvailabilitySlot');
const ServiceRequest = require('../models/ServiceRequest');
const Quote = require('../models/Quote');
const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const Dispute = require('../models/Dispute');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/http');
const { hasRole, requireRole, isSameId, operationalRoles, supportRoles } = require('../utils/access');
const { recordAudit } = require('../services/audit.service');
const { createNotification } = require('../services/notification.service');
const { analyzeServiceRequest, summarizeDispute, reanalyzeAfterCorrection } = require('../services/ai.service');
const { getProviderMatches } = require('../services/matching.service');
const { assertNoAvailabilityOverlap, assertNoBookingConflict } = require('../services/availability.service');

const customerRoles = ['CUSTOMER'];
const elevatedRoles = ['ADMIN', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT'];

const requireAdmin = (user) => requireRole(user, ['ADMIN']);

const canAccessServiceRequest = (user, serviceRequest) => (
  hasRole(user, elevatedRoles) || 
  isSameId(serviceRequest.customer, user._id) || 
  (user.role === 'SERVICE_PROVIDER' && ['MATCHING', 'QUOTING'].includes(serviceRequest.status))
);

const scopedServiceRequestQuery = (user, query = {}) => {
  if (user.role === 'CUSTOMER') {
    query.customer = user._id;
  } else if (user.role === 'SERVICE_PROVIDER') {
    query.status = { $in: ['MATCHING', 'QUOTING'] };
  }
  return query;
};

// --- CATEGORY CONTROLLER ---
const categoryController = {
  create: asyncHandler(async (req, res) => {
    requireAdmin(req.user);
    const category = await ServiceCategory.create(req.body);
    sendSuccess(res, 201, 'Category created.', { category });
  }),
  list: asyncHandler(async (req, res) => {
    const categories = await ServiceCategory.find({ isActive: true }).sort({ name: 1 });
    sendSuccess(res, 200, 'Categories fetched.', { categories });
  }),
  get: asyncHandler(async (req, res) => {
    const category = await ServiceCategory.findById(req.params.id);
    if (!category) throw AppError.notFound('Category not found.');
    sendSuccess(res, 200, 'Category fetched.', { category });
  }),
  update: asyncHandler(async (req, res) => {
    requireAdmin(req.user);
    const category = await ServiceCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendSuccess(res, 200, 'Category updated.', { category });
  }),
  remove: asyncHandler(async (req, res) => {
    requireAdmin(req.user);
    const category = await ServiceCategory.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    sendSuccess(res, 200, 'Category deactivated.', { category });
  }),
};

// --- SKILL CONTROLLER ---
const skillController = {
  create: asyncHandler(async (req, res) => {
    requireAdmin(req.user);
    const skill = await Skill.create(req.body);
    sendSuccess(res, 201, 'Skill created.', { skill });
  }),
  list: asyncHandler(async (req, res) => {
    const skills = await Skill.find({ isActive: true }).sort({ name: 1 });
    sendSuccess(res, 200, 'Skills fetched.', { skills });
  }),
  get: asyncHandler(async (req, res) => {
    const skill = await Skill.findById(req.params.id);
    if (!skill) throw AppError.notFound('Skill not found.');
    sendSuccess(res, 200, 'Skill fetched.', { skill });
  }),
  update: asyncHandler(async (req, res) => {
    requireAdmin(req.user);
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendSuccess(res, 200, 'Skill updated.', { skill });
  }),
  remove: asyncHandler(async (req, res) => {
    requireAdmin(req.user);
    const skill = await Skill.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    sendSuccess(res, 200, 'Skill deactivated.', { skill });
  }),
};

// --- SERVICE REQUEST CONTROLLER ---
const serviceRequestController = {
  create: asyncHandler(async (req, res) => {
    requireRole(req.user, customerRoles);

    const {
      title,
      description,
      category,
      service,
      urgency,
      location,
      preferredSchedule,
      attachments,
    } = req.body;

    if (!title || !description || !category) {
      throw AppError.badRequest('Title, description, and category are required.');
    }

    if (!location) {
      throw AppError.badRequest('Location details are required.');
    }

    // Explicitly guarantee required serviceArea for Mongoose schema validation
    const formattedLocation = {
      addressLine1: location.addressLine1 || '',
      addressLine2: location.addressLine2 || '',
      city: location.city || '',
      state: location.state || '',
      postalCode: location.postalCode || '',
      serviceArea: location.serviceArea || location.city || location.state || 'General Area',
    };

    // Clean attachment payloads
    const formattedAttachments = Array.isArray(attachments)
      ? attachments
          .map((att) => ({
            url: typeof att === 'string' ? att : att?.url || '',
            type: att?.type || 'IMAGE',
          }))
          .filter((att) => !!att.url)
      : [];

    const serviceRequest = await ServiceRequest.create({
      customer: req.user._id,
      title,
      description,
      category,
      service: service || null,
      attachments: formattedAttachments,
      location: formattedLocation,
      preferredSchedule: preferredSchedule?.startAt ? preferredSchedule : undefined,
      urgency: urgency || 'NORMAL',
      status: 'DRAFT',
    });

    await recordAudit({
      actor: req.user,
      action: 'SERVICE_REQUEST_CREATED',
      resourceType: 'ServiceRequest',
      resourceId: serviceRequest._id,
    });

    sendSuccess(res, 201, 'Service request created.', { serviceRequest });
  }),

  submit: asyncHandler(async (req, res) => {
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    if (!serviceRequest) throw AppError.notFound('Service request not found.');
    if (!isSameId(serviceRequest.customer, req.user._id)) throw AppError.forbidden('You cannot submit this service request.');
    if (serviceRequest.status !== 'DRAFT') throw AppError.conflict('Only draft requests can be submitted.');

    serviceRequest.status = 'AI_REVIEW';

    let analysis;
    try {
      analysis = await analyzeServiceRequest(serviceRequest);
    } catch (aiErr) {
      console.error('AI Analysis Error, applying fallback rule set:', aiErr);
      analysis = {
        source: 'FALLBACK_RULES',
        category: serviceRequest.category,
        problemType: serviceRequest.title || 'Home Service Repair',
        urgency: serviceRequest.urgency || 'NORMAL',
        diagnosticNotes: 'Request created. Default diagnostic rules applied.',
        suggestedTasks: ['Inspect issue area', 'Identify broken components'],
        confidence: 0.85,
        generatedAt: new Date(),
      };
    }

    serviceRequest.aiUnderstanding = analysis;
    serviceRequest.confirmedUnderstanding = analysis;
    serviceRequest.status = (analysis.confidence || 0.8) < 0.7 ? 'MANUAL_REVIEW' : 'MATCHING';

    await serviceRequest.save();

    await recordAudit({
      actor: req.user,
      action: 'SERVICE_REQUEST_SUBMITTED',
      resourceType: 'ServiceRequest',
      resourceId: serviceRequest._id,
    });

    sendSuccess(res, 200, 'Service request submitted successfully.', { serviceRequest });
  }),

  list: asyncHandler(async (req, res) => {
    const query = scopedServiceRequestQuery(req.user, {});
    if (req.query.status) query.status = req.query.status;
    if (req.query.category) query.category = req.query.category;
    if (req.query.urgency) query.urgency = req.query.urgency;
    const serviceRequests = await ServiceRequest.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    sendSuccess(res, 200, 'Service requests fetched.', { serviceRequests });
  }),

  get: asyncHandler(async (req, res) => {
    const serviceRequest = await ServiceRequest.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('service', 'name slug');
    if (!serviceRequest) throw AppError.notFound('Service request not found.');
    if (!canAccessServiceRequest(req.user, serviceRequest)) throw AppError.forbidden('You cannot access this service request.');
    sendSuccess(res, 200, 'Service request fetched.', { serviceRequest });
  }),

  update: asyncHandler(async (req, res) => {
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    if (!serviceRequest) throw AppError.notFound('Service request not found.');
    if (!isSameId(serviceRequest.customer, req.user._id)) throw AppError.forbidden('You cannot update this service request.');
    if (!['DRAFT', 'MANUAL_REVIEW'].includes(serviceRequest.status)) throw AppError.conflict('Only draft or manual-review requests can be edited.');
    ['title', 'description', 'category', 'service', 'location', 'preferredSchedule', 'urgency', 'attachments'].forEach((field) => {
      if (req.body[field] !== undefined) serviceRequest[field] = req.body[field];
    });
    await serviceRequest.save();
    sendSuccess(res, 200, 'Service request updated.', { serviceRequest });
  }),

  cancel: asyncHandler(async (req, res) => {
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    if (!serviceRequest) throw AppError.notFound('Service request not found.');
    if (!canAccessServiceRequest(req.user, serviceRequest)) throw AppError.forbidden('You cannot cancel this service request.');
    if (['SCHEDULED', 'CLOSED', 'CANCELLED'].includes(serviceRequest.status)) throw AppError.conflict('This service request cannot be cancelled in its current state.');
    serviceRequest.status = 'CANCELLED';
    await serviceRequest.save();
    await recordAudit({ actor: req.user, action: 'SERVICE_REQUEST_CANCELLED', resourceType: 'ServiceRequest', resourceId: serviceRequest._id });
    sendSuccess(res, 200, 'Service request cancelled.', { serviceRequest });
  }),

  correctUnderstanding: asyncHandler(async (req, res) => {
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    if (!serviceRequest) throw AppError.notFound('Service request not found.');
    if (!isSameId(serviceRequest.customer, req.user._id)) throw AppError.forbidden('You cannot correct this service request.');
    let understanding;
    if (req.body.notes && req.body.notes.trim()) {
      understanding = await reanalyzeAfterCorrection(serviceRequest.aiUnderstanding, req.body.notes, serviceRequest);
    } else {
      understanding = {
        ...serviceRequest.aiUnderstanding?.toObject?.() || serviceRequest.aiUnderstanding || {},
        ...req.body,
        source: 'CUSTOMER_CONFIRMED',
        generatedAt: new Date(),
        manualReviewRecommended: false,
      };
    }
    serviceRequest.customerCorrections.push({ notes: req.body.notes || 'Customer confirmed understanding.', understanding });
    serviceRequest.confirmedUnderstanding = understanding;
    serviceRequest.status = ['MANUAL_REVIEW', 'AI_REVIEW'].includes(serviceRequest.status) ? 'MATCHING' : serviceRequest.status;
    await serviceRequest.save();
    await recordAudit({ actor: req.user, action: 'SERVICE_REQUEST_UNDERSTANDING_CONFIRMED', resourceType: 'ServiceRequest', resourceId: serviceRequest._id });
    sendSuccess(res, 200, 'Service request understanding updated.', { serviceRequest });
  }),
};

// --- PRICING RULE CONTROLLER ---
const pricingController = {
  list: asyncHandler(async (req, res) => {
    const query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.skill) query.skill = req.query.skill;
    const pricingRules = await PricingRule.find(query).sort({ createdAt: -1 });
    sendSuccess(res, 200, 'Pricing rules fetched.', { pricingRules });
  }),
  get: asyncHandler(async (req, res) => {
    const pricingRule = await PricingRule.findById(req.params.id);
    if (!pricingRule) throw AppError.notFound('Pricing rule not found.');
    sendSuccess(res, 200, 'Pricing rule fetched.', { pricingRule });
  }),
  create: asyncHandler(async (req, res) => {
    requireAdmin(req.user);
    const pricingRule = await PricingRule.create(req.body);
    sendSuccess(res, 201, 'Pricing rule created.', { pricingRule });
  }),
  update: asyncHandler(async (req, res) => {
    requireAdmin(req.user);
    const pricingRule = await PricingRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pricingRule) throw AppError.notFound('Pricing rule not found.');
    sendSuccess(res, 200, 'Pricing rule updated.', { pricingRule });
  }),
  remove: asyncHandler(async (req, res) => {
    requireAdmin(req.user);
    await PricingRule.findByIdAndDelete(req.params.id);
    sendSuccess(res, 200, 'Pricing rule deleted.');
  }),
};

// --- PROVIDER CONTROLLER ---
const getOwnProviderProfile = async (user) => {
  const profile = await ProviderProfile.findOne({ user: user._id });
  if (!profile) throw AppError.notFound('Provider profile not found.');
  return profile;
};

const ensureProviderOwnership = async (user, providerId) => {
  if (hasRole(user, ['ADMIN', 'OPERATIONS_MANAGER'])) return;
  if (user.role !== 'SERVICE_PROVIDER') throw AppError.forbidden('Provider access is required.');

  const profile = await getOwnProviderProfile(user);
  if (!isSameId(profile._id, providerId)) {
    throw AppError.forbidden('You cannot modify another provider resource.');
  }
};

const providerController = {
  list: asyncHandler(async (req, res) => {
    const query = {};
    if (req.query.verificationStatus) query.verificationStatus = req.query.verificationStatus;
    else if (!hasRole(req.user, ['ADMIN', 'OPERATIONS_MANAGER'])) query.verificationStatus = 'VERIFIED';
    if (req.query.skill) query.skills = req.query.skill;
    const providers = await ProviderProfile.find(query)
      .populate('user', 'name email phone status')
      .populate('skills', 'name slug')
      .sort({ createdAt: -1 });
    sendSuccess(res, 200, 'Providers fetched.', { providers });
  }),
  featured: asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 4;
    const providers = await ProviderProfile.find({ verificationStatus: 'VERIFIED' })
      .populate('user', 'name email phone status')
      .populate('skills', 'name slug')
      .sort({ 'ratingSummary.averageRating': -1, 'ratingSummary.reviewCount': -1, createdAt: -1 })
      .limit(limit);
    sendSuccess(res, 200, 'Featured providers fetched.', { providers });
  }),
  get: asyncHandler(async (req, res) => {
    const provider = await ProviderProfile.findById(req.params.id)
      .populate('user', 'name email phone status')
      .populate('skills', 'name slug');
    if (!provider) throw AppError.notFound('Provider not found.');
    sendSuccess(res, 200, 'Provider fetched.', { provider });
  }),
  me: asyncHandler(async (req, res) => {
    const provider = await getOwnProviderProfile(req.user);
    await provider.populate('skills', 'name slug');
    sendSuccess(res, 200, 'Provider profile fetched.', { provider });
  }),
  updateMe: asyncHandler(async (req, res) => {
    const provider = await getOwnProviderProfile(req.user);
    const allowed = ['displayName', 'bio', 'experienceYears', 'serviceAreas', 'skills', 'pricing', 'documents'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) provider[field] = req.body[field];
    });
    await provider.save();
    await recordAudit({ actor: req.user, action: 'PROVIDER_PROFILE_UPDATED', resourceType: 'ProviderProfile', resourceId: provider._id });
    sendSuccess(res, 200, 'Provider profile updated.', { provider });
  }),
  verify: asyncHandler(async (req, res) => {
    requireRole(req.user, ['ADMIN', 'OPERATIONS_MANAGER']);
    const allowed = ['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED'];
    if (!allowed.includes(req.body.verificationStatus)) {
      throw AppError.badRequest(`Invalid status. Must be one of: ${allowed.join(', ')}`);
    }
    const provider = await ProviderProfile.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: req.body.verificationStatus, verificationNotes: req.body.notes || '' },
      { new: true }
    );
    if (!provider) throw AppError.notFound('Provider not found.');
    await recordAudit({ actor: req.user, action: 'PROVIDER_VERIFICATION_UPDATED', resourceType: 'ProviderProfile', resourceId: provider._id });
    sendSuccess(res, 200, 'Provider verification updated.', { provider });
  }),
};

// --- AVAILABILITY CONTROLLER ---
const availabilityController = {
  list: asyncHandler(async (req, res) => {
    const query = {};
    if (req.user.role === 'SERVICE_PROVIDER') {
      const provider = await getOwnProviderProfile(req.user);
      query.provider = provider._id;
    } else if (req.query.provider) {
      query.provider = req.query.provider;
    }
    const availabilitySlots = await AvailabilitySlot.find(query).sort({ startAt: 1 });
    sendSuccess(res, 200, 'Availability slots fetched.', { availabilitySlots });
  }),
  create: asyncHandler(async (req, res) => {
    requireRole(req.user, ['SERVICE_PROVIDER']);
    const provider = await getOwnProviderProfile(req.user);
    const { start, end } = await assertNoAvailabilityOverlap({
      provider: provider._id,
      startAt: req.body.startAt,
      endAt: req.body.endAt,
    });
    const slot = await AvailabilitySlot.create({
      ...req.body,
      provider: provider._id,
      startAt: start,
      endAt: end,
    });
    sendSuccess(res, 201, 'Availability slot created.', { availabilitySlot: slot });
  }),
  update: asyncHandler(async (req, res) => {
    const slot = await AvailabilitySlot.findById(req.params.id);
    if (!slot) throw AppError.notFound('Availability slot not found.');
    await ensureProviderOwnership(req.user, slot.provider);
    const { start, end } = await assertNoAvailabilityOverlap({
      provider: slot.provider,
      startAt: req.body.startAt || slot.startAt,
      endAt: req.body.endAt || slot.endAt,
      excludeId: slot._id,
    });
    ['startAt', 'endAt', 'isRecurring', 'recurrence'].forEach((f) => {
      if (req.body[f] !== undefined) slot[f] = req.body[f];
    });
    slot.startAt = start;
    slot.endAt = end;
    await slot.save();
    sendSuccess(res, 200, 'Availability slot updated.', { availabilitySlot: slot });
  }),
  remove: asyncHandler(async (req, res) => {
    const slot = await AvailabilitySlot.findById(req.params.id);
    if (!slot) throw AppError.notFound('Availability slot not found.');
    await ensureProviderOwnership(req.user, slot.provider);
    await slot.deleteOne();
    sendSuccess(res, 200, 'Availability slot removed.');
  }),
};

// --- MATCHING CONTROLLER ---
const matchingController = {
  list: asyncHandler(async (req, res) => {
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    if (!serviceRequest) throw AppError.notFound('Service request not found.');
    if (!canAccessServiceRequest(req.user, serviceRequest)) throw AppError.forbidden('Access denied.');
    const matches = await getProviderMatches(serviceRequest);
    sendSuccess(res, 200, 'Matches fetched.', { matches });
  }),
};

// --- QUOTE CONTROLLER ---
const quoteController = {
  createForRequest: asyncHandler(async (req, res) => {
    requireRole(req.user, ['SERVICE_PROVIDER']);
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    if (!serviceRequest) throw AppError.notFound('Service request not found.');
    if (!['MATCHING', 'QUOTING'].includes(serviceRequest.status)) {
      throw AppError.conflict('This service request is not accepting quotes.');
    }
    const provider = await getOwnProviderProfile(req.user);
    const existing = await Quote.findOne({ serviceRequest: serviceRequest._id, provider: provider._id });
    if (existing) throw AppError.conflict('You have already submitted a quote for this request.');
    const quote = await Quote.create({
      serviceRequest: serviceRequest._id,
      provider: provider._id,
      ...req.body,
      status: req.body.submit === true ? 'SUBMITTED' : 'DRAFT',
    });
    if (serviceRequest.status === 'MATCHING') {
      serviceRequest.status = 'QUOTING';
      await serviceRequest.save();
    }
    if (quote.status === 'SUBMITTED') {
      await createNotification({
        recipient: serviceRequest.customer,
        type: 'QUOTE',
        title: 'New quote received',
        message: `${provider.displayName} submitted a quote for "${serviceRequest.title}".`,
        resourceType: 'Quote',
        resourceId: quote._id,
      });
    }
    await recordAudit({ actor: req.user, action: 'QUOTE_CREATED', resourceType: 'Quote', resourceId: quote._id });
    sendSuccess(res, 201, 'Quote created.', { quote });
  }),
  listForRequest: asyncHandler(async (req, res) => {
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    if (!serviceRequest) throw AppError.notFound('Service request not found.');
    if (!canAccessServiceRequest(req.user, serviceRequest)) throw AppError.forbidden('Access denied.');
    const quoteQuery = { serviceRequest: serviceRequest._id };
    if (req.user.role === 'CUSTOMER') {
      quoteQuery.status = { $nin: ['DRAFT', 'WITHDRAWN'] };
    }
    const quotes = await Quote.find(quoteQuery)
      .populate({ path: 'provider', populate: { path: 'user', select: 'name email' } })
      .sort({ totalAmount: 1 });
    sendSuccess(res, 200, 'Quotes fetched.', { quotes });
  }),
  get: asyncHandler(async (req, res) => {
    const quote = await Quote.findById(req.params.id)
      .populate({ path: 'provider', populate: { path: 'user', select: 'name email' } })
      .populate('serviceRequest');
    if (!quote) throw AppError.notFound('Quote not found.');
    sendSuccess(res, 200, 'Quote fetched.', { quote });
  }),
  update: asyncHandler(async (req, res) => {
    const quote = await Quote.findById(req.params.id);
    if (!quote) throw AppError.notFound('Quote not found.');
    const allowed = ['scope', 'pricingBreakdown', 'totalAmount', 'estimatedDuration', 'validUntil', 'providerNotes'];
    allowed.forEach((f) => { if (req.body[f] !== undefined) quote[f] = req.body[f]; });
    await quote.save();
    sendSuccess(res, 200, 'Quote updated.', { quote });
  }),
  accept: asyncHandler(async (req, res) => {
    requireRole(req.user, customerRoles);
    const quote = await Quote.findById(req.params.id).populate('serviceRequest');
    if (!quote) throw AppError.notFound('Quote not found.');
    if (!isSameId(quote.serviceRequest.customer, req.user._id)) throw AppError.forbidden('Not your request.');
    if (quote.validUntil && new Date(quote.validUntil) < new Date()) {
      quote.status = 'EXPIRED';
      await quote.save();
      throw AppError.conflict('This quote has expired.');
    }
    if (quote.status === 'ACCEPTED') throw AppError.conflict('Quote already accepted.');

    await assertNoBookingConflict({
      provider: quote.provider,
      startAt: quote.serviceRequest.preferredSchedule?.startAt,
      endAt: quote.serviceRequest.preferredSchedule?.endAt,
    });

    quote.status = 'ACCEPTED';
    quote.acceptedAt = new Date();
    await quote.save();

    // Reject other quotes for same request
    await Quote.updateMany(
      { serviceRequest: quote.serviceRequest._id, _id: { $ne: quote._id }, status: { $nin: ['REJECTED', 'WITHDRAWN', 'EXPIRED'] } },
      { status: 'REJECTED' }
    );

    // Update service request
    quote.serviceRequest.status = 'PROVIDER_SELECTED';
    await quote.serviceRequest.save();

    // Create booking
    const provider = await ProviderProfile.findById(quote.provider).populate('user', 'name email phone');
    const customer = await User.findById(req.user._id);
    const booking = await Booking.create({
      serviceRequest: quote.serviceRequest._id,
      acceptedQuote: quote._id,
      customer: req.user._id,
      provider: quote.provider,
      scheduledStartAt: quote.serviceRequest.preferredSchedule?.startAt || new Date(Date.now() + 24 * 60 * 60 * 1000),
      scheduledEndAt: quote.serviceRequest.preferredSchedule?.endAt || new Date(Date.now() + 26 * 60 * 60 * 1000),
      status: 'PENDING_CONFIRMATION',
      customerSnapshot: { userId: customer._id, name: customer.name, email: customer.email, phone: customer.phone || '' },
      providerSnapshot: { providerProfileId: provider._id, userId: provider.user._id, displayName: provider.displayName || provider.user.name, phone: provider.user.phone || '' },
      scopeSnapshot: {
        summary: quote.scope.summary,
        tasks: (quote.scope.tasks || []).filter((t) => t.included !== false).map((t) => t.description),
        exclusions: quote.scope.exclusions || [],
      },
      pricingSnapshot: {
        currency: quote.pricingBreakdown?.currency || 'INR',
        subtotal: (quote.pricingBreakdown?.labor || 0) + (quote.pricingBreakdown?.materials || 0),
        tax: quote.pricingBreakdown?.tax || 0,
        discount: quote.pricingBreakdown?.discount || 0,
        totalAmount: quote.totalAmount,
      },
      statusEvents: [{ type: 'BOOKING_CREATED', actor: req.user._id, description: 'Booking created from accepted quote.' }],
    });

    await recordAudit({ actor: req.user, action: 'QUOTE_ACCEPTED_BOOKING_CREATED', resourceType: 'Quote', resourceId: quote._id });
    sendSuccess(res, 200, 'Quote accepted. Booking created.', { quote, booking });
  }),
  requestChanges: asyncHandler(async (req, res) => {
    const quote = await Quote.findById(req.params.id);
    if (!quote) throw AppError.notFound('Quote not found.');
    quote.status = 'CHANGES_REQUESTED';
    quote.customerNotes = req.body.notes || '';
    await quote.save();
    sendSuccess(res, 200, 'Changes requested.', { quote });
  }),
  transition: (newStatus, event) => asyncHandler(async (req, res) => {
    const quote = await Quote.findById(req.params.id);
    if (!quote) throw AppError.notFound('Quote not found.');
    quote.status = newStatus;
    await quote.save();
    await recordAudit({ actor: req.user, action: event, resourceType: 'Quote', resourceId: quote._id });
    sendSuccess(res, 200, `Quote ${newStatus.toLowerCase()}.`, { quote });
  }),
};

// --- BOOKING CONTROLLER ---
const providerRolesArr = ['SERVICE_PROVIDER'];
const bookingTransitions = {
  confirm: { from: ['PENDING_CONFIRMATION'], to: 'CONFIRMED', roles: ['ADMIN', 'OPERATIONS_MANAGER'], event: 'BOOKING_CONFIRMED' },
  enRoute: { from: ['CONFIRMED'], to: 'PROVIDER_EN_ROUTE', roles: providerRolesArr, event: 'PROVIDER_EN_ROUTE' },
  arrived: { from: ['PROVIDER_EN_ROUTE'], to: 'ARRIVED', roles: providerRolesArr, event: 'PROVIDER_ARRIVED' },
  start: { from: ['ARRIVED'], to: 'IN_PROGRESS', roles: providerRolesArr, event: 'SERVICE_STARTED' },
  requestCompletion: { from: ['IN_PROGRESS'], to: 'AWAITING_CUSTOMER_CONFIRMATION', roles: providerRolesArr, event: 'COMPLETION_REQUESTED' },
  confirmCompletion: { from: ['AWAITING_CUSTOMER_CONFIRMATION'], to: 'COMPLETED', roles: customerRoles, event: 'SERVICE_COMPLETED' },
};

const getBookingForAccess = async (id, user) => {
  const booking = await Booking.findById(id);
  if (!booking) throw AppError.notFound('Booking not found.');
  const provider = await ProviderProfile.findById(booking.provider);
  if (!hasRole(user, elevatedRoles) && !isSameId(booking.customer, user._id) && !(provider && isSameId(provider.user, user._id))) {
    throw AppError.forbidden('You cannot access this booking.');
  }
  if (provider) booking.$locals.providerUser = provider.user;
  return booking;
};

const bookingController = {
  list: asyncHandler(async (req, res) => {
    const query = {};
    if (req.user.role === 'CUSTOMER') query.customer = req.user._id;
    if (req.user.role === 'SERVICE_PROVIDER') {
      const provider = await getOwnProviderProfile(req.user);
      query.provider = provider._id;
    }
    if (req.query.status) query.status = req.query.status;
    if (req.query.provider && hasRole(req.user, elevatedRoles)) query.provider = req.query.provider;
    if (req.query.customer && hasRole(req.user, elevatedRoles)) query.customer = req.query.customer;
    const bookings = await Booking.find(query).sort({ scheduledStartAt: -1 });
    sendSuccess(res, 200, 'Bookings fetched.', { bookings });
  }),
  get: asyncHandler(async (req, res) => {
    const booking = await getBookingForAccess(req.params.id, req.user);
    const invoice = await Invoice.findOne({ booking: booking._id });
    const bookingData = booking.toObject();
    bookingData.invoice = invoice;
    sendSuccess(res, 200, 'Booking fetched.', { booking: bookingData });
  }),
  transition: (transitionName) => asyncHandler(async (req, res) => {
    const transition = bookingTransitions[transitionName];
    if (!transition) throw AppError.badRequest('Invalid transition.');
    const booking = await getBookingForAccess(req.params.id, req.user);
    requireRole(req.user, transition.roles);
    if (!transition.from.includes(booking.status)) {
      throw AppError.conflict(`Cannot transition from ${booking.status} to ${transition.to}.`);
    }
    booking.status = transition.to;
    booking.statusEvents.push({
      type: transition.event,
      actor: req.user._id,
      description: `Status changed to ${transition.to}.`,
    });
    if (transition.to === 'COMPLETED') booking.completedAt = new Date();
    await booking.save();
    if (transition.to === 'COMPLETED') await createInvoiceForBooking(booking);
    await recordAudit({ actor: req.user, action: transition.event, resourceType: 'Booking', resourceId: booking._id });
    await createNotification({
      recipient: transition.to === 'COMPLETED' ? booking.customer : (booking.$locals.providerUser || booking.customer),
      type: transition.event,
      title: `Booking ${transition.to.replace(/_/g, ' ').toLowerCase()}`,
      message: `Booking #${booking._id.toString().slice(-6)} status changed to ${transition.to}.`,
      resourceType: 'Booking',
      resourceId: booking._id,
    });
    sendSuccess(res, 200, `Booking ${transition.to.toLowerCase()}.`, { booking });
  }),
  cancel: asyncHandler(async (req, res) => {
    const booking = await getBookingForAccess(req.params.id, req.user);
    if (['COMPLETED', 'CANCELLED'].includes(booking.status)) throw AppError.conflict('Cannot cancel this booking.');
    booking.status = 'CANCELLED';
    booking.cancelledAt = new Date();
    booking.statusEvents.push({ type: 'BOOKING_CANCELLED', actor: req.user._id, description: 'Booking cancelled.' });
    await booking.save();
    await recordAudit({ actor: req.user, action: 'BOOKING_CANCELLED', resourceType: 'Booking', resourceId: booking._id });
    sendSuccess(res, 200, 'Booking cancelled.', { booking });
  }),
  addEvidence: asyncHandler(async (req, res) => {
    const booking = await getBookingForAccess(req.params.id, req.user);
    
    let fileData = {};
    
    // Handle file upload
    if (req.file) {
      try {
        // Convert file buffer to base64 for storage
        const base64 = req.file.buffer.toString('base64');
        fileData = {
          url: `data:${req.file.mimetype};base64,${base64}`,
          name: req.file.originalname,
          mimeType: req.file.mimetype,
        };
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        fileData = {
          url: '',
          name: req.file.originalname,
          mimeType: req.file.mimetype,
        };
      }
    } else {
      // Handle JSON file data (fallback when no file uploaded)
      if (typeof req.body.file === 'string') {
        try {
          fileData = JSON.parse(req.body.file);
        } catch (e) {
          fileData = { url: req.body.file, name: 'Evidence File', mimeType: 'image/jpeg' };
        }
      } else if (req.body.file) {
        fileData = req.body.file;
      } else {
        fileData = { url: '', name: 'No file uploaded', mimeType: 'application/octet-stream' };
      }
    }
    
    const evidenceItem = {
      uploadedBy: req.user._id,
      type: req.body.type || 'OTHER_APPROVED_EVIDENCE',
      description: req.body.description || '',
      file: fileData,
      relatedScopeChangeId: req.body.relatedScopeChangeId || null,
    };
    booking.evidence.push(evidenceItem);
    await booking.save();
    await recordAudit({ actor: req.user, action: 'EVIDENCE_ADDED', resourceType: 'Booking', resourceId: booking._id });
    sendSuccess(res, 201, 'Evidence added.', { booking, evidence: booking.evidence[booking.evidence.length - 1] });
  }),
  requestScopeChange: asyncHandler(async (req, res) => {
    const booking = await getBookingForAccess(req.params.id, req.user);
    if (!['CONFIRMED', 'IN_PROGRESS', 'ARRIVED'].includes(booking.status)) {
      throw AppError.conflict('Scope changes can only be requested during active bookings.');
    }
    const scopeChange = {
      requestedBy: req.user._id,
      reason: req.body.reason,
      workItems: req.body.workItems || [],
      laborAmount: req.body.laborAmount || 0,
      materialAmount: req.body.materialAmount || 0,
      costDifference: req.body.costDifference || 0,
      evidenceIds: req.body.evidenceIds || [],
      status: 'PENDING_CUSTOMER_APPROVAL',
    };
    booking.scopeChanges.push(scopeChange);
    await booking.save();
    await createNotification({
      recipient: booking.customer,
      type: 'SCOPE_CHANGE_REQUESTED',
      title: 'Scope change requested',
      message: `A scope change has been requested for booking #${booking._id.toString().slice(-6)}: ${req.body.reason}`,
      resourceType: 'Booking',
      resourceId: booking._id,
    });
    await recordAudit({ actor: req.user, action: 'SCOPE_CHANGE_REQUESTED', resourceType: 'Booking', resourceId: booking._id });
    sendSuccess(res, 201, 'Scope change requested.', { booking, scopeChange: booking.scopeChanges[booking.scopeChanges.length - 1] });
  }),
  decideScopeChange: (decision) => asyncHandler(async (req, res) => {
    requireRole(req.user, customerRoles);
    const booking = await getBookingForAccess(req.params.id, req.user);
    const change = booking.scopeChanges.id(req.params.changeId);
    if (!change) throw AppError.notFound('Scope change not found.');
    if (change.status !== 'PENDING_CUSTOMER_APPROVAL') throw AppError.conflict('This scope change has already been decided.');
    change.status = decision;
    change.decidedBy = req.user._id;
    change.decidedAt = new Date();
    change.decisionNotes = req.body.notes || '';
    if (decision === 'APPROVED' && change.costDifference > 0) {
      booking.pricingSnapshot.totalAmount = (booking.pricingSnapshot.totalAmount || 0) + change.costDifference;
    }
    await booking.save();
    await recordAudit({ actor: req.user, action: `SCOPE_CHANGE_${decision}`, resourceType: 'Booking', resourceId: booking._id });
    sendSuccess(res, 200, `Scope change ${decision.toLowerCase()}.`, { booking });
  }),
  serviceTrace: asyncHandler(async (req, res) => {
    const booking = await getBookingForAccess(req.params.id, req.user);
    const serviceRequest = await ServiceRequest.findById(booking.serviceRequest);
    if (!serviceRequest) throw AppError.notFound('Related service request not found.');
    const { buildServiceTrace } = require('../services/trace.service');
    const serviceTrace = await buildServiceTrace({ serviceRequest, booking });
    sendSuccess(res, 200, 'Service trace fetched.', { serviceTrace });
  }),
  proofPack: asyncHandler(async (req, res) => {
    const booking = await getBookingForAccess(req.params.id, req.user);
    const proofPack = {
      bookingId: booking._id,
      status: booking.status,
      evidence: booking.evidence || [],
      scopeChanges: booking.scopeChanges || [],
      approvedScopeChanges: (booking.scopeChanges || []).filter((change) => change.status === 'APPROVED'),
      statusEvents: booking.statusEvents || [],
      scopeSnapshot: booking.scopeSnapshot,
      pricingSnapshot: booking.pricingSnapshot,
    };
    sendSuccess(res, 200, 'Proof pack fetched.', { proofPack });
  }),
};

// --- INVOICE CONTROLLER ---
const { createInvoiceForBooking, buildInvoiceFromBooking } = require('../services/invoice.service');

const invoiceController = {
  list: asyncHandler(async (req, res) => {
    const query = {};
    if (req.user.role === 'CUSTOMER') query.customer = req.user._id;
    if (req.user.role === 'SERVICE_PROVIDER') {
      const provider = await getOwnProviderProfile(req.user);
      query.provider = provider._id;
    }
    if (req.query.status) query.status = req.query.status;
    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    sendSuccess(res, 200, 'Invoices fetched.', { invoices });
  }),
  get: asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) throw AppError.notFound('Invoice not found.');
    sendSuccess(res, 200, 'Invoice fetched.', { invoice });
  }),
  createForBooking: asyncHandler(async (req, res) => {
    const booking = await getBookingForAccess(req.params.id, req.user);
    if (!['COMPLETED', 'AWAITING_CUSTOMER_CONFIRMATION'].includes(booking.status)) {
      throw AppError.conflict('Invoice can only be created for completed/near-completed bookings.');
    }
    const invoice = await createInvoiceForBooking(booking);
    await recordAudit({ actor: req.user, action: 'INVOICE_CREATED', resourceType: 'Invoice', resourceId: invoice._id });
    sendSuccess(res, 201, 'Invoice created.', { invoice });
  }),
  downloadPdf: asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id)
      .populate('booking')
      .populate('customer', 'name email phone')
      .populate('provider', 'displayName email phone');
    
    if (!invoice) throw AppError.notFound('Invoice not found.');
    
    if (req.user.role === 'CUSTOMER' && invoice.customer._id.toString() !== req.user._id.toString()) {
      throw AppError.forbidden('Access denied.');
    }
    if (req.user.role === 'SERVICE_PROVIDER') {
      const provider = await getOwnProviderProfile(req.user);
      if (invoice.provider._id.toString() !== provider._id.toString()) {
        throw AppError.forbidden('Access denied.');
      }
    }
    
    const invoiceText = `
CARECONNECT INVOICE
==================
Invoice ID: ${invoice._id}
Date: ${new Date(invoice.createdAt).toLocaleDateString()}
Status: ${invoice.status}

CUSTOMER:
${invoice.customer.name}
${invoice.customer.email}
${invoice.customer.phone || ''}

PROVIDER:
${invoice.provider.displayName}
${invoice.provider.email}

BOOKING REF: ${invoice.booking._id}
AMOUNT: ${invoice.currency || 'INR'} ${invoice.total || invoice.totalAmount || 0}

ITEMS:
${invoice.items?.map(item => `- ${item.description}: ${item.amount}`).join('\n') || 'Service charges'}

TOTAL: ${invoice.currency || 'INR'} ${invoice.total || invoice.totalAmount || 0}
    `.trim();
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice._id}.txt"`);
    res.send(invoiceText);
  }),
  update: asyncHandler(async (req, res) => {
    requireRole(req.user, ['ADMIN', 'OPERATIONS_MANAGER']);
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) throw AppError.notFound('Invoice not found.');
    ['status', 'paymentStatus', 'dueAt'].forEach((f) => {
      if (req.body[f] !== undefined) invoice[f] = req.body[f];
    });
    await invoice.save();
    sendSuccess(res, 200, 'Invoice updated.', { invoice });
  }),
};

const paymentController = {
  list: asyncHandler(async (req, res) => {
    const query = {};
    if (req.user.role === 'CUSTOMER') query.customer = req.user._id;
    if (req.user.role === 'SERVICE_PROVIDER') {
      const provider = await getOwnProviderProfile(req.user);
      query.provider = provider._id;
    }
    if (req.query.status) query.status = req.query.status;

    const payments = await Payment.find(query)
      .populate('invoice', 'invoiceNumber total currency status')
      .populate('customer', 'name email')
      .populate('provider', 'displayName')
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, 'Payments fetched.', { payments });
  }),

  get: asyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id)
      .populate('invoice', 'invoiceNumber total currency status')
      .populate('customer', 'name email')
      .populate('provider', 'displayName');

    if (!payment) throw AppError.notFound('Payment not found.');

    if (req.user.role === 'CUSTOMER' && !isSameId(payment.customer, req.user._id)) {
      throw AppError.forbidden('Access denied.');
    }

    if (req.user.role === 'SERVICE_PROVIDER') {
      const provider = await getOwnProviderProfile(req.user);
      if (!isSameId(payment.provider, provider._id)) {
        throw AppError.forbidden('Access denied.');
      }
    }

    sendSuccess(res, 200, 'Payment fetched.', { payment });
  }),

  create: asyncHandler(async (req, res) => {
    const { invoiceId, method = 'CARD', amount, currency = 'INR', metadata = {} } = req.body;

    if (!invoiceId) {
      throw AppError.badRequest('invoiceId is required.');
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) throw AppError.notFound('Invoice not found.');

    if (req.user.role !== 'CUSTOMER' || invoice.customer.toString() !== req.user._id.toString()) {
      throw AppError.forbidden('Only the invoice customer can pay this invoice.');
    }

    const paymentAmount = typeof amount === 'number' ? amount : invoice.total;
    if (paymentAmount !== invoice.total) {
      throw AppError.badRequest('Payment amount must match the invoice total.');
    }

    const existingPayment = await Payment.findOne({ invoice: invoice._id, status: 'SUCCEEDED' }).sort({ createdAt: -1 });
    if (existingPayment) {
      throw AppError.conflict('This invoice has already been paid.');
    }

    const payment = await Payment.create({
      invoice: invoice._id,
      customer: invoice.customer,
      provider: invoice.provider,
      amount: paymentAmount,
      currency: currency || invoice.currency || 'INR',
      method,
      status: 'SUCCEEDED',
      gatewayTransactionId: `cc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      paidAt: new Date(),
      metadata,
    });

    invoice.status = 'PAID';
    invoice.paymentStatus = 'PAID';
    invoice.paidAt = new Date();
    await invoice.save();

    await recordAudit({
      actor: req.user,
      action: 'PAYMENT_COMPLETED',
      resourceType: 'Payment',
      resourceId: payment._id,
    });

    sendSuccess(res, 201, 'Payment processed successfully.', { payment });
  }),
};

// --- REVIEW CONTROLLER ---
const reviewController = {
  create: asyncHandler(async (req, res) => {
    requireRole(req.user, customerRoles);
    const booking = await Booking.findById(req.body.booking || req.body.bookingId);
    if (!booking) throw AppError.notFound('Booking not found.');
    if (!isSameId(booking.customer, req.user._id)) throw AppError.forbidden('Not your booking.');
    if (booking.status !== 'COMPLETED') throw AppError.conflict('Can only review completed bookings.');
    const existing = await Review.findOne({ booking: booking._id });
    if (existing) throw AppError.conflict('You have already reviewed this booking.');
    const review = await Review.create({
      booking: booking._id,
      customer: req.user._id,
      provider: booking.provider,
      rating: req.body.rating,
      comment: req.body.comment || '',
      status: 'PUBLISHED',
    });
    // Update provider rating summary
    const allReviews = await Review.find({ provider: booking.provider, status: 'PUBLISHED' });
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await ProviderProfile.findByIdAndUpdate(booking.provider, {
      'ratingSummary.averageRating': Math.round(avg * 100) / 100,
      'ratingSummary.reviewCount': allReviews.length,
    });
    await recordAudit({ actor: req.user, action: 'REVIEW_CREATED', resourceType: 'Review', resourceId: review._id });
    sendSuccess(res, 201, 'Review created.', { review });
  }),
  list: asyncHandler(async (req, res) => {
    const query = {};
    if (req.query.provider) query.provider = req.query.provider;
    if (req.query.customer) query.customer = req.query.customer;
    if (req.query.booking) query.booking = req.query.booking;
    const reviews = await Review.find(query)
      .populate('customer', 'name')
      .sort({ createdAt: -1 });
    sendSuccess(res, 200, 'Reviews fetched.', { reviews });
  }),
};

// --- DISPUTE CONTROLLER ---
const disputeController = {
  create: asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.body.booking || req.body.bookingId);
    if (!booking) throw AppError.notFound('Booking not found.');
    const dispute = await Dispute.create({
      booking: booking._id,
      serviceRequest: booking.serviceRequest,
      openedBy: req.user._id,
      reason: req.body.reason,
      description: req.body.description || '',
      status: 'OPEN',
    });
    await createNotification({
      recipient: booking.customer,
      type: 'DISPUTE_OPENED',
      title: 'Dispute opened',
      message: `A dispute has been opened for booking #${booking._id.toString().slice(-6)}.`,
      resourceType: 'Dispute',
      resourceId: dispute._id,
    });
    await recordAudit({ actor: req.user, action: 'DISPUTE_OPENED', resourceType: 'Dispute', resourceId: dispute._id });
    sendSuccess(res, 201, 'Dispute created.', { dispute });
  }),
  list: asyncHandler(async (req, res) => {
    const query = {};
    if (!hasRole(req.user, [...elevatedRoles, ...supportRoles])) query.openedBy = req.user._id;
    if (req.query.status) query.status = req.query.status;
    const disputes = await Dispute.find(query)
      .populate('openedBy', 'name email')
      .populate('booking')
      .sort({ createdAt: -1 });
    sendSuccess(res, 200, 'Disputes fetched.', { disputes });
  }),
  get: asyncHandler(async (req, res) => {
    const dispute = await Dispute.findById(req.params.id)
      .populate('openedBy', 'name email')
      .populate('booking');
    if (!dispute) throw AppError.notFound('Dispute not found.');
    sendSuccess(res, 200, 'Dispute fetched.', { dispute });
  }),
  update: asyncHandler(async (req, res) => {
    requireRole(req.user, [...elevatedRoles, ...supportRoles]);
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) throw AppError.notFound('Dispute not found.');
    ['status', 'resolution', 'assignedTo'].forEach((f) => {
      if (req.body[f] !== undefined) dispute[f] = req.body[f];
    });
    await dispute.save();
    await recordAudit({ actor: req.user, action: 'DISPUTE_UPDATED', resourceType: 'Dispute', resourceId: dispute._id });
    sendSuccess(res, 200, 'Dispute updated.', { dispute });
  }),
};

// --- NOTIFICATION CONTROLLER ---
const notificationController = {
  list: asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    sendSuccess(res, 200, 'Notifications fetched.', { notifications });
  }),
  markRead: asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    if (!notification) throw AppError.notFound('Notification not found.');
    sendSuccess(res, 200, 'Notification marked as read.', { notification });
  }),
  markAllRead: asyncHandler(async (req, res) => {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    sendSuccess(res, 200, 'All notifications marked as read.');
  }),
  quoteRequest: asyncHandler(async (req, res) => {
    const { serviceRequestId, providerId } = req.body;
    
    // Get the service request
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) throw AppError.notFound('Service request not found.');
    
    // Get the provider user
    const providerProfile = await ProviderProfile.findById(providerId).populate('user');
    if (!providerProfile) throw AppError.notFound('Provider profile not found.');
    
    // Create notification for the provider
    await createNotification({
      recipient: providerProfile.user._id,
      type: 'QUOTE',
      title: 'New Quote Request',
      message: `A customer has requested a quote for their service request: ${serviceRequest.title}`,
      resourceType: 'ServiceRequest',
      resourceId: serviceRequestId,
    });
    
    sendSuccess(res, 201, 'Quote request notification sent.');
  }),
};

// --- AUDIT CONTROLLER ---
const auditController = {
  list: asyncHandler(async (req, res) => {
    requireRole(req.user, ['ADMIN']);
    const query = {};
    if (req.query.action) query.action = req.query.action;
    if (req.query.resourceType) query.resourceType = req.query.resourceType;
    const auditLogs = await AuditLog.find(query)
      .populate('actor', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);
    sendSuccess(res, 200, 'Audit logs fetched.', { auditLogs });
  }),
};

// --- ANALYTICS CONTROLLER ---
const analyticsController = {
  publicStats: asyncHandler(async (_req, res) => {
    const [totalRequests, activeBookings, completedBookings, totalProviders, totalCustomers, ratingSummary] = await Promise.all([
      ServiceRequest.countDocuments(),
      Booking.countDocuments({ status: { $nin: ['COMPLETED', 'CANCELLED'] } }),
      Booking.countDocuments({ status: 'COMPLETED' }),
      ProviderProfile.countDocuments({ verificationStatus: 'VERIFIED' }),
      User.countDocuments({ role: 'CUSTOMER', status: 'ACTIVE' }),
      Review.aggregate([
        { $match: { status: 'PUBLISHED' } },
        { $group: { _id: null, averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
      ]),
    ]);

    const averageRating = ratingSummary?.[0]?.averageRating || 0;
    const reviewCount = ratingSummary?.[0]?.reviewCount || 0;

    sendSuccess(res, 200, 'Platform stats fetched.', {
      stats: {
        totalRequests,
        activeBookings,
        completedBookings,
        totalProviders,
        totalCustomers,
        averageRating: Number(averageRating.toFixed(2)),
        reviewCount,
      },
    });
  }),
  summary: asyncHandler(async (req, res) => {
    requireRole(req.user, ['ADMIN', 'OPERATIONS_MANAGER']);
    const [totalRequests, activeBookings, completedBookings, totalProviders, totalCustomers, totalUsers, bookings] = await Promise.all([
      ServiceRequest.countDocuments(),
      Booking.countDocuments({ status: { $nin: ['COMPLETED', 'CANCELLED'] } }),
      Booking.countDocuments({ status: 'COMPLETED' }),
      ProviderProfile.countDocuments({ verificationStatus: 'VERIFIED' }),
      User.countDocuments({ role: 'CUSTOMER', status: 'ACTIVE' }),
      User.countDocuments(),
      Booking.countDocuments(),
    ]);
    sendSuccess(res, 200, 'Analytics summary.', {
      analytics: { totalRequests, activeBookings, completedBookings, totalProviders, totalCustomers, totalUsers, bookings },
      totalUsers,
      bookings,
    });
  }),
};

module.exports = {
  categoryController,
  skillController,
  pricingController,
  providerController,
  availabilityController,
  serviceRequestController,
  matchingController,
  quoteController,
  bookingController,
  invoiceController,
  paymentController,
  reviewController,
  disputeController,
  notificationController,
  auditController,
  analyticsController,
};
