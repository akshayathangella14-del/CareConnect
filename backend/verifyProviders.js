const mongoose = require('mongoose');
const User = require('./src/models/User');
const ProviderProfile = require('./src/models/ProviderProfile');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careconnect';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to DB');
  
  try {
    // Check users
    const users = await User.find({ role: 'SERVICE_PROVIDER' });
    console.log(`\n👥 SERVICE PROVIDER USERS: ${users.length}`);
    
    if (users.length > 0) {
      console.log('Sample users:');
      users.slice(0, 5).forEach(user => {
        console.log(`- ${user.email} (${user.name})`);
      });
    }
    
    // Check provider profiles
    const profiles = await ProviderProfile.find({});
    console.log(`\n📋 PROVIDER PROFILES: ${profiles.length}`);
    
    if (profiles.length > 0) {
      console.log('Sample profiles:');
      profiles.slice(0, 5).forEach(profile => {
        console.log(`- ${profile.displayName} (Status: ${profile.verificationStatus})`);
      });
    }
    
    // Check if they match
    console.log(`\n🔍 MATCH CHECK:`);
    console.log(`Users: ${users.length}`);
    console.log(`Profiles: ${profiles.length}`);
    console.log(`Match: ${users.length === profiles.length ? '✅ YES' : '❌ NO'}`);
    
    if (users.length !== profiles.length) {
      console.log('\n⚠️  WARNING: User and Profile counts do not match!');
      console.log('This means some users don\'t have profiles or vice versa.');
    }
    
  } catch (err) {
    console.error('Verification failed:', err);
  }
  
  process.exit(0);
}).catch((err) => {
  console.error('Database connection failed:', err);
  process.exit(1);
});