const mongoose = require('mongoose');
const User = require('./src/models/User');
const ProviderProfile = require('./src/models/ProviderProfile');
const ServiceRequest = require('./src/models/ServiceRequest');
const Skill = require('./src/models/Skill');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careconnect';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to DB');
  
  try {
    // Check if test customer exists
    const customer = await User.findOne({ email: 'testcustomer@gmail.com' });
    console.log('\n👤 CUSTOMER:');
    console.log(customer ? `✅ Found: ${customer.email} (${customer.name})` : '❌ Not found');
    
    // Check service requests
    const serviceRequests = await ServiceRequest.find({ customer: customer?._id });
    console.log(`\n📋 SERVICE REQUESTS: ${serviceRequests.length}`);
    
    if (serviceRequests.length > 0) {
      serviceRequests.forEach((req, index) => {
        console.log(`\nRequest ${index + 1}:`);
        console.log(`- Title: ${req.title}`);
        console.log(`- Status: ${req.status}`);
        console.log(`- Category: ${req.category}`);
        console.log(`- AI Skills: ${req.aiUnderstanding?.requiredSkills?.length || 0} skills`);
        console.log(`- Location: ${req.location?.city}, ${req.location?.state}`);
        console.log(`- Created: ${req.createdAt}`);
      });
    } else {
      console.log('❌ No service requests found for test customer');
    }
    
    // Check providers
    const providers = await User.find({ role: 'SERVICE_PROVIDER' });
    console.log(`\n👥 PROVIDERS: ${providers.length}`);
    
    if (providers.length > 0) {
      console.log('\nProvider details:');
      for (const provider of providers) {
        const profile = await ProviderProfile.findOne({ user: provider._id })
          .populate('skills');
        
        console.log(`\n- ${provider.email} (${provider.name})`);
        console.log(`  Skills: ${profile?.skills?.map(s => s.name).join(', ') || 'None'}`);
        console.log(`  Service Areas: ${profile?.serviceAreas?.map(sa => sa.city).join(', ') || 'None'}`);
        console.log(`  Status: ${profile?.verificationStatus}`);
      }
    }
    
    // Check matching logic
    if (serviceRequests.length > 0 && providers.length > 0) {
      console.log('\n🔍 MATCHING ANALYSIS:');
      
      const request = serviceRequests[0];
      const requiredSkills = request.aiUnderstanding?.requiredSkills || request.confirmedUnderstanding?.requiredSkills || [];
      const requestCity = request.location?.city;
      
      console.log(`\nService Request Requirements:`);
      console.log(`- Required Skills: ${requiredSkills.length} skills`);
      console.log(`- Location: ${requestCity}`);
      console.log(`- Status: ${request.status}`);
      
      console.log(`\nProvider Compatibility Check:`);
      
      for (const provider of providers) {
        const profile = await ProviderProfile.findOne({ user: provider._id })
          .populate('skills');
        
        const providerSkills = profile?.skills?.map(s => s._id.toString()) || [];
        const providerCities = profile?.serviceAreas?.map(sa => sa.city.toLowerCase()) || [];
        
        const skillMatch = requiredSkills.some(skillId => 
          providerSkills.includes(skillId.toString())
        );
        
        const locationMatch = providerCities.some(city => 
          city.includes(requestCity?.toLowerCase() || '')
        );
        
        const statusMatch = profile?.verificationStatus === 'VERIFIED';
        
        console.log(`\n${provider.email}:`);
        console.log(`  Skills Match: ${skillMatch ? '✅' : '❌'}`);
        console.log(`  Location Match: ${locationMatch ? '✅' : '❌'}`);
        console.log(`  Status Match: ${statusMatch ? '✅' : '❌'}`);
        console.log(`  Overall Match: ${skillMatch && locationMatch && statusMatch ? '✅ SHOULD MATCH' : '❌ NO MATCH'}`);
      }
    }
    
  } catch (err) {
    console.error('Verification failed:', err);
  }
  
  process.exit(0);
}).catch((err) => {
  console.error('Database connection failed:', err);
  process.exit(1);
});