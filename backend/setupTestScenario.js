const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const ProviderProfile = require('./src/models/ProviderProfile');
const ServiceCategory = require('./src/models/ServiceCategory');
const Skill = require('./src/models/Skill');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careconnect';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to DB');
  
  try {
    // Clean up existing test data
    console.log('Cleaning up test data...');
    await User.deleteMany({ email: { $in: ['testcustomer@gmail.com', 'provider1@gmail.com', 'provider2@gmail.com', 'provider3@gmail.com'] } });
    await ProviderProfile.deleteMany({});
    console.log('Test data cleaned.');
    
    // Create test customer
    console.log('Creating test customer...');
    const customerPassword = await bcrypt.hash('test123', 10);
    const customer = await User.create({
      name: 'Test Customer',
      email: 'testcustomer@gmail.com',
      passwordHash: customerPassword,
      phone: '+91 9876543210',
      role: 'CUSTOMER',
      status: 'ACTIVE'
    });
    console.log('✅ Test customer created: testcustomer@gmail.com / test123');
    
    // Ensure HVAC and Electrical skills exist
    let hvacSkill = await Skill.findOne({ name: 'HVAC' });
    if (!hvacSkill) {
      hvacSkill = await Skill.create({
        name: 'HVAC',
        slug: 'hvac',
        description: 'Heating, Ventilation, and Air Conditioning services'
      });
    }
    
    let electricalSkill = await Skill.findOne({ name: 'Electrical' });
    if (!electricalSkill) {
      electricalSkill = await Skill.create({
        name: 'Electrical',
        slug: 'electrical',
        description: 'Electrical repair and installation services'
      });
    }
    
    let applianceSkill = await Skill.findOne({ name: 'Appliance Repair' });
    if (!applianceSkill) {
      applianceSkill = await Skill.create({
        name: 'Appliance Repair',
        slug: 'appliance-repair',
        description: 'Home appliance repair services'
      });
    }
    
    // Create 3 providers with matching skills for AC repair
    console.log('Creating 3 test providers for AC repair...');
    
    const providers = [
      {
        name: 'AC Specialist',
        email: 'provider1@gmail.com',
        password: 'provider123',
        skills: [hvacSkill._id, electricalSkill._id],
        city: 'Mumbai',
        experience: 8,
        rating: 4.8,
        description: 'Expert AC repair specialist with 8 years experience. Specializes in all brands of air conditioners.'
      },
      {
        name: 'Cooling Expert',
        email: 'provider2@gmail.com',
        password: 'provider123',
        skills: [hvacSkill._id, applianceSkill._id],
        city: 'Mumbai',
        experience: 5,
        rating: 4.5,
        description: 'Professional cooling systems expert. Quick service and reasonable rates.'
      },
      {
        name: 'Electrical & AC Pro',
        email: 'provider3@gmail.com',
        password: 'provider123',
        skills: [hvacSkill._id, electricalSkill._id, applianceSkill._id],
        city: 'Mumbai',
        experience: 12,
        rating: 4.9,
        description: 'Multi-skilled technician with expertise in AC, electrical, and appliance repair.'
      }
    ];
    
    for (const providerData of providers) {
      const providerPassword = await bcrypt.hash(providerData.password, 10);
      
      const user = await User.create({
        name: providerData.name,
        email: providerData.email,
        passwordHash: providerPassword,
        phone: '+91 9876543211',
        role: 'SERVICE_PROVIDER',
        status: 'ACTIVE'
      });
      
      await ProviderProfile.create({
        user: user._id,
        displayName: providerData.name,
        bio: providerData.description,
        experienceYears: providerData.experience,
        serviceAreas: [{ city: providerData.city, state: 'Maharashtra', postalCode: '400001' }],
        skills: providerData.skills,
        verificationStatus: 'VERIFIED',
        ratingSummary: {
          averageRating: providerData.rating,
          reviewCount: Math.floor(Math.random() * 20) + 10
        },
        pricing: {
          currency: 'INR',
          baseHourlyRate: 300,
          minimumVisitCharge: 200
        }
      });
      
      console.log(`✅ Provider created: ${providerData.email} / ${providerData.password}`);
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('🧪 TESTING SCENARIO SETUP COMPLETE');
    console.log('='.repeat(70));
    console.log('\n📋 TEST ACCOUNTS:');
    console.log('Customer: testcustomer@gmail.com / test123');
    console.log('Provider 1: provider1@gmail.com / provider123 (AC Specialist, 4.8★)');
    console.log('Provider 2: provider2@gmail.com / provider123 (Cooling Expert, 4.5★)');
    console.log('Provider 3: provider3@gmail.com / provider123 (Electrical & AC Pro, 4.9★)');
    
    console.log('\n🎯 TEST SERVICE REQUEST DETAILS:');
    console.log('Title: Air Conditioner Not Cooling');
    console.log('Description: My AC is not cooling properly. It was working fine yesterday, but today it\'s just blowing warm air. I tried cleaning the filter but it didn\'t help. The AC makes a strange humming sound when I turn it on.');
    console.log('Category: Appliance Repair');
    console.log('Location: Mumbai, Maharashtra');
    console.log('Urgency: HIGH');
    console.log('Preferred Time: Within 2 days');
    
    console.log('\n📝 TESTING STEPS:');
    console.log('1. Login as customer: testcustomer@gmail.com / test123');
    console.log('2. Create service request with the details above');
    console.log('3. Submit for AI analysis');
    console.log('4. Check provider matching results');
    console.log('5. Login as different providers to see matched requests');
    console.log('6. Submit quotes as providers');
    console.log('7. Accept quote as customer and test booking');
    
    console.log('\n💡 EXPECTED BEHAVIOR:');
    console.log('- AI should identify the issue as AC/HVAC related');
    console.log('- Should match with providers having HVAC skills');
    console.log('- All 3 providers should appear in matches (Mumbai location)');
    console.log('- Provider 3 should have highest match (most skills + highest rating)');
    console.log('- You can compare providers by rating, experience, and skills');
    
    console.log('\n' + '='.repeat(70));
    
  } catch (err) {
    console.error('Test setup failed:', err);
  }
  
  process.exit(0);
}).catch((err) => {
  console.error('Database connection failed:', err);
  process.exit(1);
});