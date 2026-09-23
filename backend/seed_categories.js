const mongoose = require('mongoose');
const ServiceCategory = require('./src/models/ServiceCategory');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careconnect';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to DB');
  
  const count = await ServiceCategory.countDocuments();
  if (count === 0) {
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
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
