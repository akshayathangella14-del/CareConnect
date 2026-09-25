const mongoose = require('mongoose');
const ServiceRequest = require('../src/models/ServiceRequest');
const ServiceCategory = require('../src/models/ServiceCategory');
const Skill = require('../src/models/Skill');
const User = require('../src/models/User');
require('dotenv').config();

async function fixRequestLifecycle() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Get a customer user
    const customer = await User.findOne({ role: 'CUSTOMER' });
    if (!customer) {
      console.log('⚠ No customer found. Creating a test customer...');
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash('Customer123', 10);
      customer = await User.create({
        name: 'Test Customer',
        email: 'customer@careconnect.com',
        passwordHash,
        role: 'CUSTOMER',
        status: 'ACTIVE'
      });
      console.log('✓ Created test customer: customer@careconnect.com / Customer123');
    }
    console.log(`Using customer: ${customer.name} (${customer.email})`);

    // Get the manual review requests
    const manualReviewRequests = await ServiceRequest.find({ status: 'MANUAL_REVIEW' });
    console.log(`Found ${manualReviewRequests.length} requests in MANUAL_REVIEW status`);

    // Get appliance repair category
    const applianceCategory = await ServiceCategory.findOne({ name: 'Appliance Repair' });
    if (!applianceCategory) {
      console.log('⚠ Appliance Repair category not found, skipping category assignment');
    }

    // Get electrical skill
    const electricalSkill = await Skill.findOne({ name: 'Electrical Repair' });
    if (!electricalSkill) {
      console.log('⚠ Electrical Repair skill not found, skipping skill assignment');
    }

    // Move manual review requests to MATCHING
    for (const request of manualReviewRequests) {
      console.log(`\nProcessing: ${request.title}`);
      
      // Assign category if missing
      if (!request.category && applianceCategory) {
        request.category = applianceCategory._id;
        console.log('  ✓ Assigned category: Appliance Repair');
      }

      // Assign AI understanding
      if (!request.aiUnderstanding) {
        request.aiUnderstanding = {
          source: 'FALLBACK_RULES',
          category: request.category || applianceCategory?._id,
          subcategory: null,
          requiredSkills: electricalSkill ? [electricalSkill._id] : [],
          problemType: 'Appliance Issue',
          urgency: request.urgency || 'NORMAL',
          diagnosticNotes: 'Fallback classification due to manual review',
          suggestedTasks: ['Diagnose issue', 'Repair or replace faulty component'],
          missingInformation: [],
          confidence: 0.7,
          manualReviewRecommended: false,
          generatedAt: new Date()
        };
        console.log('  ✓ Added AI understanding (fallback rules)');
      }

      // Move to MATCHING status
      request.status = 'MATCHING';
      await request.save();
      console.log('  ✓ Status changed: MANUAL_REVIEW → MATCHING');
    }

    // Update the QUOTING request to ensure it has category
    const quotingRequest = await ServiceRequest.findOne({ status: 'QUOTING' });
    if (quotingRequest) {
      console.log(`\nProcessing: ${quotingRequest.title}`);
      
      if (!quotingRequest.category && applianceCategory) {
        quotingRequest.category = applianceCategory._id;
        console.log('  ✓ Assigned category: Appliance Repair');
      }

      if (!quotingRequest.aiUnderstanding) {
        quotingRequest.aiUnderstanding = {
          source: 'FALLBACK_RULES',
          category: quotingRequest.category || applianceCategory?._id,
          subcategory: null,
          requiredSkills: electricalSkill ? [electricalSkill._id] : [],
          problemType: 'Appliance Issue',
          urgency: quotingRequest.urgency || 'NORMAL',
          diagnosticNotes: 'Fallback classification',
          suggestedTasks: ['Diagnose issue', 'Repair or replace'],
          missingInformation: [],
          confidence: 0.7,
          manualReviewRecommended: false,
          generatedAt: new Date()
        };
        console.log('  ✓ Added AI understanding (fallback rules)');
      }

      await quotingRequest.save();
    }

    // Create a test DRAFT request with the customer
    console.log('\n\nCreating test DRAFT request...');
    const draftRequest = await ServiceRequest.create({
      customer: customer._id,
      title: 'Test Draft Request - Ceiling Fan Installation',
      description: 'Need to install a ceiling fan in the living room. Fan is new in box, all mounting hardware included.',
      category: applianceCategory?._id,
      location: {
        addressLine1: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        serviceArea: 'Mumbai'
      },
      urgency: 'NORMAL',
      status: 'DRAFT',
      aiUnderstanding: {
        source: 'FALLBACK_RULES',
        category: applianceCategory?._id,
        subcategory: null,
        requiredSkills: electricalSkill ? [electricalSkill._id] : [],
        problemType: 'Installation',
        urgency: 'NORMAL',
        diagnosticNotes: 'Test request for testing DRAFT filter',
        suggestedTasks: ['Install fan', 'Test operation'],
        missingInformation: [],
        confidence: 0.8,
        manualReviewRecommended: false,
        generatedAt: new Date()
      }
    });
    console.log('✓ Created test DRAFT request:', draftRequest.title);

    // Show summary
    const allRequests = await ServiceRequest.find({});
    console.log('\n============================================');
    console.log('REQUEST LIFECY FIX SUMMARY');
    console.log('============================================');
    console.log('\nAll requests in database:');
    allRequests.forEach(req => {
      console.log(`- ${req.title} (Status: ${req.status})`);
    });
    console.log('\n============================================');
    console.log('✓ Workflow unblocked - Providers can now see MATCHING requests');
    console.log('✓ Test DRAFT request created - Filter buttons can be tested');
    console.log('✓ AI understanding added via fallback rules');
    console.log('============================================');

  } catch (error) {
    console.error('❌ Error fixing request lifecycle:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixRequestLifecycle();
