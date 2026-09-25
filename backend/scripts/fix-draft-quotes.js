const mongoose = require('mongoose');
const Quote = require('../src/models/Quote');
require('dotenv').config();

async function fixDraftQuotes() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to configured MongoDB database.');

  const result = await Quote.updateMany(
    { status: 'DRAFT' },
    { $set: { status: 'SUBMITTED' } }
  );

  console.log(`Updated ${result.modifiedCount} draft quote(s) to SUBMITTED.`);
}

fixDraftQuotes()
  .catch((error) => {
    console.error('Failed to update draft quotes:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
