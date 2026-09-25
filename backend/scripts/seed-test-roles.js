const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
require('dotenv').config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@careconnect.com',
    password: 'Admin123',
    role: 'ADMIN',
    phone: '+91 98765 43210'
  },
  {
    name: 'Operations Manager',
    email: 'operations@careconnect.com',
    password: 'Ops123',
    role: 'OPERATIONS_MANAGER',
    phone: '+91 98765 43211'
  },
  {
    name: 'Support Agent',
    email: 'support@careconnect.com',
    password: 'Support123',
    role: 'SUPPORT_AGENT',
    phone: '+91 98765 43212'
  }
];

async function seedRoles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      const passwordHash = await bcrypt.hash(userData.password, 10);
      
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        passwordHash,
        role: userData.role,
        phone: userData.phone,
        status: 'ACTIVE'
      });

      console.log(`✓ Created ${userData.role}: ${userData.email}`);
    }

    console.log('\n=== ROLE USERS CREATED SUCCESSFULLY ===');
    console.log('\nCREDENTIALS FOR TESTING:');
    console.log('================================');
    users.forEach(user => {
      console.log(`\n${user.role}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
    });
    console.log('\n================================');

  } catch (error) {
    console.error('Error seeding roles:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedRoles();
