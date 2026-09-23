const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const ProviderProfile = require('./src/models/ProviderProfile');
const ServiceCategory = require('./src/models/ServiceCategory');
const Skill = require('./src/models/Skill');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careconnect';

// Indian first names
const firstNames = [
  'Rahul', 'Amit', 'Vikram', 'Arjun', 'Rajesh', 'Suresh', 'Mahesh', 'Dinesh', 'Ramesh', 'Suresh',
  'Arun', 'Deepak', 'Sanjay', 'Vijay', 'Ajay', 'Sunil', 'Anil', 'Ravi', 'Rajeev', 'Vikas',
  'Pradeep', 'Prakash', 'Naresh', 'Rakesh', 'Mukesh', 'Ashok', 'Kumar', 'Srinivas', 'Venkat', 'Krishna',
  'Ramesh', 'Suresh', 'Mohan', 'Sohan', 'Rohan', 'Pawan', 'Nitin', 'Manish', 'Harish', 'Girish'
];

// Indian last names
const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Jain', 'Reddy', 'Nair', 'Iyer',
  'Sharma', 'Das', 'Das', 'Mishra', 'Pandey', 'Tiwari', 'Dubey', 'Yadav', 'Singh', 'Kaur',
  'Kapoor', 'Khanna', 'Malhotra', 'Mehta', 'Shah', 'Patel', 'Joshi', 'Desai', 'Menon', 'Nair',
  'Pillai', 'Rao', 'Murthy', 'Iyengar', 'Iyer', 'Gopalakrishnan', 'Venkatesh', 'Balasubramanian', 'Chatterjee', 'Mukherjee'
];

// Indian service areas
const serviceAreas = [
  { city: 'Mumbai', state: 'Maharashtra', postalCode: '400001' },
  { city: 'Delhi', state: 'Delhi', postalCode: '110001' },
  { city: 'Bangalore', state: 'Karnataka', postalCode: '560001' },
  { city: 'Chennai', state: 'Tamil Nadu', postalCode: '600001' },
  { city: 'Kolkata', state: 'West Bengal', postalCode: '700001' },
  { city: 'Hyderabad', state: 'Telangana', postalCode: '500001' },
  { city: 'Pune', state: 'Maharashtra', postalCode: '411001' },
  { city: 'Ahmedabad', state: 'Gujarat', postalCode: '380001' },
  { city: 'Jaipur', state: 'Rajasthan', postalCode: '302001' },
  { city: 'Lucknow', state: 'Uttar Pradesh', postalCode: '226001' }
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
  const domains = ['gmail.com', 'yahoo.co.in', 'hotmail.com', 'rediffmail.com', 'outlook.com'];
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

// Generate Indian phone number
const generatePhone = () => {
  const mobileNumber = randomInt(7000000000, 9999999999);
  return `+91 ${mobileNumber}`;
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
        description: `Professional ${firstName} with expertise in ${providerSkills.length} services. Reliable and experienced service provider committed to quality work across ${serviceArea.city}.`,
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