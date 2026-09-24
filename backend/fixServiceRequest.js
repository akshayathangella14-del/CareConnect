const mongoose = require('mongoose');
const ServiceRequest = require('./src/models/ServiceRequest');
const Skill = require('./src/models/Skill');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careconnect';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to DB');
  
  try {
    // Get the test service request
    const serviceRequest = await ServiceRequest.findOne({ title: 'Air Conditioner Not Cooling' });
    
    if (!serviceRequest) {
      console.log('❌ Service request not found');
      process.exit(0);
    }
    
    console.log('Found service request:', serviceRequest.title);
    console.log('Current status:', serviceRequest.status);
    console.log('Current AI skills:', serviceRequest.aiUnderstanding?.requiredSkills?.length || 0);
    
    // Get HVAC and Electrical skills
    const hvacSkill = await Skill.findOne({ name: 'HVAC' });
    const electricalSkill = await Skill.findOne({ name: 'Electrical' });
    const applianceSkill = await Skill.findOne({ name: 'Appliance Repair' });
    
    if (!hvacSkill || !electricalSkill || !applianceSkill) {
      console.log('❌ Required skills not found in database');
      process.exit(0);
    }
    
    // Update the service request with proper AI understanding
    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      serviceRequest._id,
      {
        status: 'MATCHING',
        aiUnderstanding: {
          source: 'EXTERNAL_AI',
          category: serviceRequest.category,
          subcategory: null,
          requiredSkills: [hvacSkill._id, electricalSkill._id],
          problemType: 'AC Cooling Issue',
          urgency: 'HIGH',
          diagnosticNotes: 'AC not cooling, blowing warm air, humming sound detected. Likely refrigerant leak or compressor issue.',
          suggestedTasks: ['Check refrigerant levels', 'Inspect compressor', 'Clean condenser coils', 'Check thermostat settings'],
          missingInformation: [],
          confidence: 0.85,
          manualReviewRecommended: false,
          generatedAt: new Date()
        }
      },
      { new: true }
    );
    
    console.log('\n✅ Service request updated successfully:');
    console.log('- Status: MATCHING');
    console.log('- Required Skills: HVAC, Electrical');
    console.log('- Problem Type: AC Cooling Issue');
    console.log('- Confidence: 0.85');
    console.log('- Manual Review: false');
    
    console.log('\n🎯 NOW PROVIDERS SHOULD BE ABLE TO SEE THIS REQUEST!');
    console.log('- The 3 test providers (provider1, provider2, provider3) have matching skills');
    console.log('- They are in Mumbai location');
    console.log('- They have VERIFIED status');
    console.log('- They should appear in matched requests for providers');
    
  } catch (err) {
    console.error('Fix failed:', err);
  }
  
  process.exit(0);
}).catch((err) => {
  console.error('Database connection failed:', err);
  process.exit(1);
});