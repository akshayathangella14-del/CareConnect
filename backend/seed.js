const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const ServiceCategory = require('./src/models/ServiceCategory');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careconnect';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to DB');
  
  try {
    // Seed categories
    const categoryCount = await ServiceCategory.countDocuments();
    if (categoryCount === 0) {
      await ServiceCategory.insertMany([
        { name: 'Plumbing', slug: 'plumbing', description: 'Plumbing and water works' },
        { name: 'Electrical', slug: 'electrical', description: 'Electrical repairs' },
        { name: 'Appliance Repair', slug: 'appliance-repair', description: 'Fixing home appliances' },
        { name: 'Cleaning', slug: 'cleaning', description: 'Home cleaning' }
      ]);
      console.log('Seeded 4 categories successfully.');
    } else {
      console.log('Categories already exist, skipping seed.');
    }

    // Seed customer user
    const customerCount = await User.countDocuments({ role: 'CUSTOMER' });
    if (customerCount === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Test Customer',
        email: 'customer@example.com',
        password: hashedPassword,
        role: 'CUSTOMER',
        status: 'ACTIVE'
      });
      console.log('Seeded customer user successfully.');
    } else {
      console.log('Customer user already exists, skipping seed.');
    }

    console.log('Seeding completed successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
  }
  
  process.exit(0);
}).catch((err) => {
  console.error('Database connection failed:', err);
  process.exit(1);
});