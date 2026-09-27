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
    await ServiceCategory.deleteMany({}); // Clear old categories
    await ServiceCategory.insertMany([
      { name: 'Plumbing', slug: 'plumbing', description: 'Plumbing and water works', basePrice: 299 },
      { name: 'Electrical', slug: 'electrical', description: 'Electrical repairs and wiring', basePrice: 199 },
      { name: 'AC Repair', slug: 'ac-repair', description: 'Air conditioning service', basePrice: 499 },
      { name: 'Refrigerator Repair', slug: 'refrigerator-repair', description: 'Fridge & appliance repair', basePrice: 399 },
      { name: 'Cleaning', slug: 'cleaning', description: 'Deep home cleaning', basePrice: 999 },
      { name: 'Painting', slug: 'painting', description: 'Home painting & touchups', basePrice: 1499 },
      { name: 'Carpenter', slug: 'carpenter', description: 'Furniture & wood works', basePrice: 349 },
      { name: 'Pest Control', slug: 'pest-control', description: 'Complete pest management', basePrice: 799 }
    ]);
    console.log('Seeded 8 categories successfully.');

    // Seed customer user
    const customerCount = await User.countDocuments({ role: 'CUSTOMER' });
    if (customerCount === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Test Customer',
        email: 'customer@example.com',
        passwordHash: hashedPassword,
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