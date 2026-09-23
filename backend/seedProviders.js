const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const ProviderProfile = require('./src/models/ProviderProfile');
const ServiceCategory = require('./src/models/ServiceCategory');
const Skill = require('./src/models/Skill');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careconnect';

// Realistic first names
const firstNames = [
  'James', 'Michael', 'Robert', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles',
  'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth',
  'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan', 'Jacob',
  'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin'
];

// Realistic last names
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
];

// Service areas
const serviceAreas = [
  { city: 'New York', state: 'NY', postalCode: '10001' },
  { city: 'Los Angeles', state: 'CA', postalCode: '90001' },
  { city: 'Chicago', state: 'IL', postalCode: '60601' },
  { city: 'Houston', state: 'TX', postalCode: '77001' },
  { city: 'Phoenix', state: 'AZ', postalCode: '85001' },
  { city: 'Philadelphia', state: 'PA', postalCode: '19101' },
  { city: 'San Antonio', state: 'TX', postalCode: '78201' },
  { city: 'San Diego', state: 'CA', postalCode: '92101' },
  { city: 'Dallas', state: 'TX', postalCode: '75201' },
  { city: 'San Jose', state: 'CA', postalCode: '95101' }
];

// Skills/Services
const skillNames = [
  'Plumbing', 'Electrical', 'Appliance Repair', 'HVAC', 'Carpentry', 'Painting', 'Cleaning',
  'Landscaping', 'General Repair', 'Installation', 'Maintenance', 'Inspection'
];

// Generate random number between min and max
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate random item from array
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate random email
const generateEmail = (firstName, lastName) => {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const domain = randomItem(domains);
  const randomNum = randomInt(10, 99);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`;
};

// Generate simple password
const generatePassword = () => {
  const passwords = [
    'password123', 'service123', 'provider123', 'work123', 'job123',
    'fix123', 'repair123', 'help123', 'skill123', 'pro123'
  ];
  return randomItem(passwords);
};

// Generate phone number
const generatePhone = () => {
  const areaCode = randomInt(200, 999);
  const exchange = randomInt(200, 999);
  const number = randomInt(1000, 9999);
  return `(${areaCode}) ${exchange}-${number}`;
};

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to DB');
  
  try {
    // Get or create skills
    const existingSkills = await Skill.find({});
    let skills = existingSkills;
    
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
      console.log(`Created ${skills.length} skills`);
    }
    
    // Get categories
    const categories = await ServiceCategory.find({});
    
    // Generate 40 providers
    const providers = [];
    const providerCredentials = [];
    
    console.log('Creating 40 provider accounts...');
    
    for (let i = 0; i < 40; i++) {
      const firstName = randomItem(firstNames);
      const lastName = randomItem(lastNames);
      const fullName = `${firstName} ${lastName}`;
      const email = generateEmail(firstName, lastName);
      const password = generatePassword();
      const phone = generatePhone();
      const serviceArea = randomItem(serviceAreas);
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await User.create({
        name: fullName,
        email: email,
        passwordHash: passwordHash,
        phone: phone,
        role: 'SERVICE_PROVIDER',
        status: 'ACTIVE'
      });
      
      // Select random skills (2-4 skills per provider)
      const numSkills = randomInt(2, 4);
      const providerSkills = [];
      const shuffledSkills = [...skills].sort(() => 0.5 - Math.random());
      
      for (let j = 0; j < numSkills; j++) {
        providerSkills.push(shuffledSkills[j]._id);
      }
      
      // Create provider profile
      const providerProfile = await ProviderProfile.create({
        user: user._id,
        displayName: fullName,
        businessName: `${fullName} Services`,
        description: `Professional ${firstName} with expertise in ${providerSkills.length} services. Reliable and experienced service provider committed to quality work.`,
        phone: phone,
        serviceAreas: [serviceArea],
        skills: providerSkills,
        verificationStatus: 'VERIFIED',
        experienceYears: randomInt(2, 15),
        ratingSummary: {
          averageRating: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1), // Random rating between 3.5 and 5.0
          reviewCount: randomInt(5, 50)
        },
        availability: {
          availableWeekdays: true,
          availableWeekends: Math.random() > 0.3,
          responseTime: randomInt(1, 24) // hours
        }
      });
      
      providers.push({
        user: user._id,
        profile: providerProfile._id,
        name: fullName,
        email: email,
        password: password,
        phone: phone,
        skills: providerSkills,
        serviceArea: serviceArea
      });
      
      providerCredentials.push({
        Name: fullName,
        Email: email,
        Password: password,
        Phone: phone,
        Skills: providerSkills.length,
        Rating: providerProfile.ratingSummary.averageRating,
        ServiceArea: `${serviceArea.city}, ${serviceArea.state}`
      });
      
      console.log(`Created provider ${i + 1}/40: ${fullName} (${email})`);
    }
    
    console.log('\n✅ Successfully created 40 provider accounts!');
    console.log('\n📋 PROVIDER CREDENTIALS LIST:\n');
    console.log('='.repeat(100));
    console.log('Name                      Email                               Password        Rating   Skills  Service Area        ');
    console.log('='.repeat(100));
    
    providerCredentials.forEach((cred, index) => {
      const name = cred.Name.padEnd(24, ' ').substring(0, 24);
      const email = cred.Email.padEnd(35, ' ').substring(0, 35);
      const password = cred.Password.padEnd(15, ' ').substring(0, 15);
      const rating = cred.Rating.toString().padEnd(9, ' ').substring(0, 9);
      const skills = cred.Skills.toString().padEnd(7, ' ').substring(0, 7);
      const serviceArea = cred.ServiceArea.padEnd(19, ' ').substring(0, 19);
      
      console.log(`${name} ${email} ${password} ${rating} ${skills} ${serviceArea}`);
    });
    
    console.log('='.repeat(100));
    console.log(`\nTotal providers created: ${providerCredentials.length}`);
    console.log('\n💡 Tips for testing:');
    console.log('- Use any of these credentials to login as a provider');
    console.log('- All providers have VERIFIED status');
    console.log('- Each provider has 2-4 random skills');
    console.log('- Ratings range from 3.5 to 5.0 stars');
    console.log('- All are set to ACTIVE status');
    
    // Save credentials to file for reference
    const fs = require('fs');
    const credentialsContent = providerCredentials.map(cred => 
      `${cred.Name},${cred.Email},${cred.Password},${cred.Phone},${cred.Rating},${cred.Skills},${cred.ServiceArea}`
    ).join('\n');
    
    fs.writeFileSync('provider_credentials.csv', 
      'Name,Email,Password,Phone,Rating,Skills,ServiceArea\n' + credentialsContent);
    console.log('\n📄 Credentials saved to provider_credentials.csv');
    
  } catch (err) {
    console.error('Seeding failed:', err);
  }
  
  process.exit(0);
}).catch((err) => {
  console.error('Database connection failed:', err);
  process.exit(1);
});