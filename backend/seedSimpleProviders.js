const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const ProviderProfile = require('./src/models/ProviderProfile');
const ServiceCategory = require('./src/models/ServiceCategory');
const Skill = require('./src/models/Skill');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careconnect';

// Simple Indian names
const firstNames = [
  'Rahul', 'Amit', 'Vikram', 'Arjun', 'Rajesh', 'Suresh', 'Mahesh', 'Dinesh', 'Ramesh', 'Suresh',
  'Arun', 'Deepak', 'Sanjay', 'Vijay', 'Ajay', 'Sunil', 'Anil', 'Ravi', 'Rajeev', 'Vikas',
  'Pradeep', 'Prakash', 'Naresh', 'Rakesh', 'Mukesh', 'Ashok', 'Kumar', 'Srinivas', 'Venkat', 'Krishna'
];

// Indian cities
const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

// Skills
const skillNames = [
  'Plumbing', 'Electrical', 'Appliance Repair', 'HVAC', 'Carpentry', 'Painting', 'Cleaning',
  'Landscaping', 'General Repair', 'Installation', 'Maintenance', 'Inspection'
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to DB');
  
  try {
    // Get or create skills
    let skills = await Skill.find({});
    if (skills.length === 0) {
      console.log('Creating skills...');
      for (const skillName of skillNames) {
        const skill = await Skill.create({
          name: skillName,
          slug: skillName.toLowerCase().replace(/\s+/g, '-'),
          description: `${skillName} services`
        });
        skills.push(skill);
      }
    }
    
    // Get categories
    const categories = await ServiceCategory.find({});
    
    // First, delete existing providers to avoid conflicts
    console.log('Cleaning up existing providers...');
    await User.deleteMany({ role: 'SERVICE_PROVIDER' });
    await ProviderProfile.deleteMany({});
    console.log('Existing providers removed.');
    
    // Create 30 simple providers
    const providers = [];
    const providerCredentials = [];
    
    console.log('Creating 30 simple provider accounts...');
    
    for (let i = 0; i < 30; i++) {
      const firstName = randomItem(firstNames);
      const city = randomItem(cities);
      const number = i + 1;
      
      // Simple email format: rahul1@gmail.com, amit2@gmail.com, etc.
      const email = `${firstName.toLowerCase()}${number}@gmail.com`;
      
      // Simple password: rahul123, amit123, etc.
      const password = `${firstName.toLowerCase()}123`;
      
      // Simple phone: +91 9876543210 + i
      const phone = `+91 98765432${number.toString().padStart(2, '0')}`;
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await User.create({
        name: `${firstName} ${number}`,
        email: email,
        passwordHash: passwordHash,
        phone: phone,
        role: 'SERVICE_PROVIDER',
        status: 'ACTIVE'
      });
      
      // Select random skills (2-3 skills per provider)
      const numSkills = randomInt(2, 3);
      const providerSkills = [];
      const shuffledSkills = [...skills].sort(() => 0.5 - Math.random());
      
      for (let j = 0; j < numSkills; j++) {
        providerSkills.push(shuffledSkills[j]._id);
      }
      
      // Create provider profile (matching actual model structure)
      const providerProfile = await ProviderProfile.create({
        user: user._id,
        displayName: `${firstName} ${number}`,
        bio: `Professional ${firstName} providing services in ${city}. Reliable and experienced with ${numSkills} skills.`,
        experienceYears: randomInt(2, 10),
        serviceAreas: [{ city: city, state: 'India', postalCode: '000000' }],
        skills: providerSkills,
        verificationStatus: 'VERIFIED',
        ratingSummary: {
          averageRating: parseFloat((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)),
          reviewCount: randomInt(5, 30)
        },
        pricing: {
          currency: 'INR',
          baseHourlyRate: randomInt(200, 500),
          minimumVisitCharge: randomInt(100, 300)
        }
      });
      
      providerCredentials.push({
        Name: `${firstName} ${number}`,
        Email: email,
        Password: password,
        Phone: phone,
        City: city,
        Skills: providerSkills.length,
        Rating: providerProfile.ratingSummary.averageRating
      });
      
      console.log(`Created provider ${i + 1}/30: ${email} / ${password}`);
    }
    
    console.log('\n✅ Successfully created 30 simple provider accounts!');
    console.log('\n📋 SIMPLE PROVIDER CREDENTIALS:\n');
    console.log('='.repeat(80));
    console.log('Name              Email                   Password        City        Rating');
    console.log('='.repeat(80));
    
    providerCredentials.forEach((cred) => {
      const name = cred.Name.padEnd(17, ' ').substring(0, 17);
      const email = cred.Email.padEnd(23, ' ').substring(0, 23);
      const password = cred.Password.padEnd(15, ' ').substring(0, 15);
      const city = cred.City.padEnd(11, ' ').substring(0, 11);
      const rating = cred.Rating.toString().padEnd(6, ' ').substring(0, 6);
      
      console.log(`${name} ${email} ${password} ${city} ${rating}`);
    });
    
    console.log('='.repeat(80));
    console.log(`\nTotal providers created: ${providerCredentials.length}`);
    console.log('\n💡 SIMPLE LOGIN PATTERN:');
    console.log('- Email: rahul1@gmail.com, amit2@gmail.com, vikram3@gmail.com, etc.');
    console.log('- Password: rahul123, amit123, vikram123, etc.');
    console.log('- Just use the name + number + @gmail.com');
    console.log('- Password is always name + 123');
    
    // Save to CSV
    const fs = require('fs');
    const csvContent = providerCredentials.map(cred => 
      `${cred.Name},${cred.Email},${cred.Password},${cred.Phone},${cred.City},${cred.Rating}`
    ).join('\n');
    
    fs.writeFileSync('simple_provider_credentials.csv', 
      'Name,Email,Password,Phone,City,Rating\n' + csvContent);
    console.log('\n📄 Simple credentials saved to simple_provider_credentials.csv');
    
  } catch (err) {
    console.error('Seeding failed:', err);
  }
  
  process.exit(0);
}).catch((err) => {
  console.error('Database connection failed:', err);
  process.exit(1);
});