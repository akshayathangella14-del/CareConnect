const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careconnect';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to DB');
  
  try {
    // Find and update provider user
    const provider = await User.findOne({ email: 'provider1@mail.com' });
    
    if (provider) {
      const hashedPassword = await bcrypt.hash('provider1@123', 10);
      provider.passwordHash = hashedPassword;
      await provider.save();
      console.log('Provider user password reset successfully.');
      console.log('Email: provider1@mail.com');
      console.log('Password: provider1@123');
    } else {
      // Create new provider user if doesn't exist
      const hashedPassword = await bcrypt.hash('provider1@123', 10);
      await User.create({
        name: 'Test Provider',
        email: 'provider1@mail.com',
        passwordHash: hashedPassword,
        role: 'SERVICE_PROVIDER',
        status: 'ACTIVE'
      });
      console.log('Provider user created successfully.');
      console.log('Email: provider1@mail.com');
      console.log('Password: provider1@123');
    }
    
    // List all users for verification
    const allUsers = await User.find({}, 'email role status');
    console.log('\nAll users in database:');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - ${user.status}`);
    });
    
  } catch (err) {
    console.error('Password reset failed:', err);
  }
  
  process.exit(0);
}).catch((err) => {
  console.error('Database connection failed:', err);
  process.exit(1);
});