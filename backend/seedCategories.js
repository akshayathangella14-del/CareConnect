const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ServiceCategory = require('./src/models/ServiceCategory');
const Skill = require('./src/models/Skill');
const PricingRule = require('./src/models/PricingRule');

dotenv.config({ path: './src/config/.env' });
// Try root .env if src/config/.env fails
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: './.env' });
}

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careconnect';

const categoriesData = [
  {
    name: 'Appliance Repair',
    slug: 'appliance-repair',
    description: 'Repair and maintenance of household appliances',
    skills: ['Refrigerator repair', 'Washing machine repair', 'Appliance diagnostics'],
    basePrice: { min: 50, max: 150, type: 'FIXED' },
    subcategories: [
      {
        name: 'Refrigerators',
        slug: 'refrigerators',
        services: [
          { name: 'Refrigerator Not Cooling', slug: 'fridge-not-cooling' },
          { name: 'Ice Maker Not Working', slug: 'ice-maker-not-working' },
          { name: 'Leaking Water', slug: 'fridge-leaking' },
        ]
      },
      {
        name: 'Washing Machines',
        slug: 'washing-machines',
        services: [
          { name: 'Not Draining', slug: 'washer-not-draining' },
          { name: 'Not Spinning', slug: 'washer-not-spinning' },
        ]
      }
    ]
  },
  {
    name: 'Electrical',
    slug: 'electrical',
    description: 'Wiring, outlets, lighting, circuit breakers, etc.',
    skills: ['Electrical wiring', 'Outlet installation', 'Lighting installation'],
    basePrice: { min: 75, max: 200, type: 'FIXED' },
    subcategories: [
      {
        name: 'Wiring',
        slug: 'wiring',
        services: [
          { name: 'New Wiring', slug: 'new-wiring' },
          { name: 'Repair Wiring', slug: 'repair-wiring' },
        ]
      },
      {
        name: 'Outlets & Switches',
        slug: 'outlets-switches',
        services: [
          { name: 'Install Outlet', slug: 'install-outlet' },
          { name: 'Fix Flickering Lights', slug: 'fix-flickering-lights' },
        ]
      }
    ]
  },
  {
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Pipes, drains, water heaters, fixtures, etc.',
    skills: ['Pipe repair', 'Drain cleaning', 'Fixture installation'],
    basePrice: { min: 60, max: 180, type: 'FIXED' },
    subcategories: [
      {
        name: 'Pipes & Drains',
        slug: 'pipes-drains',
        services: [
          { name: 'Clogged Drain', slug: 'clogged-drain' },
          { name: 'Leaking Pipe', slug: 'leaking-pipe' },
        ]
      },
      {
        name: 'Fixtures',
        slug: 'fixtures',
        services: [
          { name: 'Install Fixture', slug: 'install-fixture' },
          { name: 'Repair Toilet', slug: 'repair-toilet' },
        ]
      }
    ]
  },
  {
    name: 'HVAC',
    slug: 'hvac',
    description: 'Air conditioning, heating, ventilation, etc.',
    skills: ['AC repair', 'Furnace repair', 'Thermostat installation'],
    basePrice: { min: 80, max: 250, type: 'FIXED' },
    subcategories: [
      {
        name: 'Air Conditioning',
        slug: 'air-conditioning',
        services: [
          { name: 'AC Not Cooling', slug: 'ac-not-cooling' },
          { name: 'AC Maintenance', slug: 'ac-maintenance' },
        ]
      },
      {
        name: 'Heating',
        slug: 'heating',
        services: [
          { name: 'Furnace Not Heating', slug: 'furnace-not-heating' },
        ]
      }
    ]
  },
  {
    name: 'Cleaning',
    slug: 'cleaning',
    description: 'Deep cleaning, regular cleaning, specialized cleaning',
    skills: ['Deep cleaning', 'Carpet cleaning', 'Office cleaning'],
    basePrice: { min: 100, max: 500, type: 'FIXED' },
    subcategories: [
      {
        name: 'Deep Cleaning',
        slug: 'deep-cleaning',
        services: [
          { name: 'Full House Deep Clean', slug: 'full-house-deep-clean' },
        ]
      },
      {
        name: 'Regular Cleaning',
        slug: 'regular-cleaning',
        services: [
          { name: 'Office Cleaning', slug: 'office-cleaning' },
          { name: 'Carpet Cleaning', slug: 'carpet-cleaning' },
        ]
      }
    ]
  },
  {
    name: 'Landscaping',
    slug: 'landscaping',
    description: 'Lawn care, tree services, irrigation, etc.',
    skills: ['Lawn care', 'Tree trimming', 'Irrigation installation'],
    basePrice: { min: 50, max: 200, type: 'FIXED' },
    subcategories: [
      {
        name: 'Lawn Care',
        slug: 'lawn-care',
        services: [
          { name: 'Lawn Mowing', slug: 'lawn-mowing' },
        ]
      },
      {
        name: 'Tree Services',
        slug: 'tree-services',
        services: [
          { name: 'Tree Trimming', slug: 'tree-trimming' },
        ]
      }
    ]
  },
  {
    name: 'Painting',
    slug: 'painting',
    description: 'Interior, exterior, commercial, residential',
    skills: ['Interior painting', 'Exterior painting', 'Wallpaper installation'],
    basePrice: { min: 200, max: 800, type: 'FIXED' },
    subcategories: [
      {
        name: 'Interior Painting',
        slug: 'interior-painting',
        services: [
          { name: 'Paint Room', slug: 'paint-room' },
          { name: 'Cabinet Painting', slug: 'cabinet-painting' },
        ]
      },
      {
        name: 'Exterior Painting',
        slug: 'exterior-painting',
        services: [
          { name: 'Paint House Exterior', slug: 'paint-house-exterior' },
        ]
      }
    ]
  },
  {
    name: 'General Handyman',
    slug: 'general-handyman',
    description: 'Assembly, repairs, installations, etc.',
    skills: ['Furniture assembly', 'General repairs', 'Installations'],
    basePrice: { min: 40, max: 120, type: 'HOURLY' },
    subcategories: [
      {
        name: 'Assembly',
        slug: 'assembly',
        services: [
          { name: 'Assemble Furniture', slug: 'assemble-furniture' },
        ]
      },
      {
        name: 'Minor Repairs',
        slug: 'minor-repairs',
        services: [
          { name: 'Hang Shelves', slug: 'hang-shelves' },
          { name: 'Fix Door', slug: 'fix-door' },
        ]
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    console.log('Clearing existing ServiceCategory and Skill collections...');
    await ServiceCategory.deleteMany({});
    await Skill.deleteMany({});

    console.log('Seeding categories and skills...');

    for (const mainCat of categoriesData) {
      // Create main category
      const mainCategory = await ServiceCategory.create({
        name: mainCat.name,
        slug: mainCat.slug,
        description: mainCat.description,
        isActive: true,
        parent: null
      });

      // Create skills
      const skillIds = [];
      for (const skillName of mainCat.skills) {
        const skill = await Skill.create({
          name: skillName,
          category: mainCategory._id,
          isActive: true
        });
        skillIds.push(skill._id);
      }

      // Create pricing rule
      await PricingRule.create({
        name: `${mainCat.name} Base Pricing`,
        category: mainCategory._id,
        pricingType: mainCat.basePrice.type,
        basePrice: mainCat.basePrice.min,
        description: `Base pricing for ${mainCat.name} services`,
        isActive: true
      });

      // Create subcategories
      for (const subCat of mainCat.subcategories) {
        const subCategory = await ServiceCategory.create({
          name: subCat.name,
          slug: subCat.slug,
          description: `Subcategory of ${mainCat.name}`,
          isActive: true,
          parent: mainCategory._id
        });

        // Create services
        for (const service of subCat.services) {
          await ServiceCategory.create({
            name: service.name,
            slug: service.slug,
            description: `Service for ${subCat.name}`,
            isActive: true,
            parent: subCategory._id
          });
        }
      }
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
