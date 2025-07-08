const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Helper function to generate random dates
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate fake IP addresses
const generateRandomIP = () => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

// Helper function to create consent log entries
const createConsentLogEntry = (consent, country = 'Kenya') => {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Android 11; Mobile; rv:89.0) Gecko/89.0 Firefox/89.0',
  ];

  const languages = {
    'Kenya': ['en-US,en;q=0.9', 'sw-KE,sw;q=0.8,en;q=0.7'],
    'Nigeria': ['en-NG,en;q=0.9', 'yo-NG,yo;q=0.8,en;q=0.7', 'ig-NG,ig;q=0.8,en;q=0.7'],
    'Ghana': ['en-GH,en;q=0.9', 'tw-GH,tw;q=0.8,en;q=0.7'],
    'Uganda': ['en-UG,en;q=0.9', 'lg-UG,lg;q=0.8,en;q=0.7'],
    'Tanzania': ['en-TZ,en;q=0.9', 'sw-TZ,sw;q=0.8,en;q=0.7'],
    'South Africa': ['en-ZA,en;q=0.9', 'af-ZA,af;q=0.8,en;q=0.7'],
    'Egypt': ['ar-EG,ar;q=0.9', 'en-EG,en;q=0.7'],
    'Morocco': ['ar-MA,ar;q=0.9', 'fr-MA,fr;q=0.8,en;q=0.7'],
    'Ethiopia': ['am-ET,am;q=0.9', 'en-ET,en;q=0.7'],
    'Rwanda': ['rw-RW,rw;q=0.9', 'en-RW,en;q=0.8', 'fr-RW,fr;q=0.7']
  };

  return {
    id: crypto.randomUUID(),
    timestamp: randomDate(new Date('2024-01-01'), new Date()).toISOString(),
    consent,
    ip: generateRandomIP(),
    userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
    headers: {
      'accept-language': languages[country][Math.floor(Math.random() * languages[country].length)],
      'dnt': Math.random() > 0.5 ? '1' : '0',
      'referer': Math.random() > 0.3 ? 'https://farmworkhub.com/' : 'unknown'
    },
    metadata: {
      country,
      source: Math.random() > 0.7 ? 'mobile_app' : 'web_browser',
      version: Math.random() > 0.5 ? '2.0' : '1.0'
    },
    version: '1.0'
  };
};

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@farmworkhub.com' },
    update: {},
    create: {
      email: 'admin@farmworkhub.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      userType: 'ADMIN',
      isVerified: true,
      location: 'Nairobi, Kenya',
      phoneNumber: '+254700000000',
      bio: 'Platform administrator managing FarmWork Hub operations across Africa.',
    },
  });

  // African countries data
  const countries = [
    { name: 'Kenya', code: '+254' },
    { name: 'Nigeria', code: '+234' },
    { name: 'Ghana', code: '+233' },
    { name: 'Uganda', code: '+256' },
    { name: 'Tanzania', code: '+255' },
    { name: 'South Africa', code: '+27' },
    { name: 'Egypt', code: '+20' },
    { name: 'Morocco', code: '+212' },
    { name: 'Ethiopia', code: '+251' },
    { name: 'Rwanda', code: '+250' }
  ];

  // Create sample employers across Africa
  const employers = await Promise.all([
    // Kenya
    prisma.user.upsert({
      where: { email: 'johndoe@greenvalley.co.ke' },
      update: {},
      create: {
        email: 'johndoe@greenvalley.co.ke',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        userType: 'EMPLOYER',
        isVerified: true,
        location: 'Nakuru, Kenya',
        phoneNumber: '+254722123456',
        bio: 'Owner of Green Valley Farm specializing in organic vegetables and dairy farming.',
        rating: 4.5,
        totalRatings: 12,
      },
    }),
    // Nigeria
    prisma.user.upsert({
      where: { email: 'adunni@goldengrain.ng' },
      update: {},
      create: {
        email: 'adunni@goldengrain.ng',
        password: hashedPassword,
        firstName: 'Adunni',
        lastName: 'Okafor',
        userType: 'EMPLOYER',
        isVerified: true,
        location: 'Kaduna, Nigeria',
        phoneNumber: '+2348012345678',
        bio: 'Managing Director of Golden Grain Agribusiness, specializing in rice and maize production.',
        rating: 4.7,
        totalRatings: 18,
      },
    }),
    // Ghana
    prisma.user.upsert({
      where: { email: 'kwame@cocoapride.gh' },
      update: {},
      create: {
        email: 'kwame@cocoapride.gh',
        password: hashedPassword,
        firstName: 'Kwame',
        lastName: 'Asante',
        userType: 'EMPLOYER',
        isVerified: true,
        location: 'Kumasi, Ghana',
        phoneNumber: '+233244567890',
        bio: 'CEO of Cocoa Pride Plantation, leading sustainable cocoa farming initiatives.',
        rating: 4.6,
        totalRatings: 15,
      },
    }),
    // Uganda
    prisma.user.upsert({
      where: { email: 'sarah@coffeefields.ug' },
      update: {},
      create: {
        email: 'sarah@coffeefields.ug',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Namukasa',
        userType: 'EMPLOYER',
        isVerified: true,
        location: 'Jinja, Uganda',
        phoneNumber: '+256701234567',
        bio: 'Coffee plantation owner with 20 years experience in arabica coffee cultivation.',
        rating: 4.8,
        totalRatings: 22,
      },
    }),
    // South Africa
    prisma.user.upsert({
      where: { email: 'pieter@winelands.za' },
      update: {},
      create: {
        email: 'pieter@winelands.za',
        password: hashedPassword,
        firstName: 'Pieter',
        lastName: 'van der Merwe',
        userType: 'EMPLOYER',
        isVerified: true,
        location: 'Stellenbosch, South Africa',
        phoneNumber: '+27821234567',
        bio: 'Wine farm owner specializing in premium grape cultivation and sustainable farming.',
        rating: 4.4,
        totalRatings: 10,
      },
    }),
    // Morocco
    prisma.user.upsert({
      where: { email: 'hassan@olivegroves.ma' },
      update: {},
      create: {
        email: 'hassan@olivegroves.ma',
        password: hashedPassword,
        firstName: 'Hassan',
        lastName: 'Benali',
        userType: 'EMPLOYER',
        isVerified: true,
        location: 'Fez, Morocco',
        phoneNumber: '+212661234567',
        bio: 'Olive grove owner and producer of premium olive oil for export markets.',
        rating: 4.3,
        totalRatings: 8,
      },
    }),
  ]);

  // Create sample workers across Africa
  const workers = await Promise.all([
    // Kenya
    prisma.user.upsert({
      where: { email: 'grace@worker.com' },
      update: {},
      create: {
        email: 'grace@worker.com',
        password: hashedPassword,
        firstName: 'Grace',
        lastName: 'Wanjiku',
        userType: 'WORKER',
        isVerified: true,
        location: 'Kiambu, Kenya',
        phoneNumber: '+254755456789',
        bio: 'Experienced farm worker skilled in crop cultivation and livestock management.',
        skills: ['Crop Cultivation', 'Livestock Management', 'Irrigation Systems'],
        rating: 4.7,
        totalRatings: 15,
      },
    }),
    // Nigeria
    prisma.user.upsert({
      where: { email: 'emeka@worker.ng' },
      update: {},
      create: {
        email: 'emeka@worker.ng',
        password: hashedPassword,
        firstName: 'Emeka',
        lastName: 'Okwu',
        userType: 'WORKER',
        isVerified: true,
        location: 'Enugu, Nigeria',
        phoneNumber: '+2348098765432',
        bio: 'Agricultural engineer with expertise in mechanized farming and crop processing.',
        skills: ['Mechanized Farming', 'Crop Processing', 'Farm Equipment Maintenance'],
        rating: 4.5,
        totalRatings: 12,
      },
    }),
    // Ghana
    prisma.user.upsert({
      where: { email: 'ama@worker.gh' },
      update: {},
      create: {
        email: 'ama@worker.gh',
        password: hashedPassword,
        firstName: 'Ama',
        lastName: 'Boateng',
        userType: 'WORKER',
        isVerified: true,
        location: 'Accra, Ghana',
        phoneNumber: '+233209876543',
        bio: 'Skilled in cocoa farming and post-harvest processing with 10 years experience.',
        skills: ['Cocoa Farming', 'Post-Harvest Processing', 'Quality Control'],
        rating: 4.6,
        totalRatings: 14,
      },
    }),
    // Uganda
    prisma.user.upsert({
      where: { email: 'joseph@worker.ug' },
      update: {},
      create: {
        email: 'joseph@worker.ug',
        password: hashedPassword,
        firstName: 'Joseph',
        lastName: 'Kigozi',
        userType: 'WORKER',
        isVerified: true,
        location: 'Kampala, Uganda',
        phoneNumber: '+256777654321',
        bio: 'Coffee cultivation specialist with expertise in organic farming methods.',
        skills: ['Coffee Cultivation', 'Organic Farming', 'Quality Grading'],
        rating: 4.8,
        totalRatings: 20,
      },
    }),
    // Tanzania
    prisma.user.upsert({
      where: { email: 'fatuma@worker.tz' },
      update: {},
      create: {
        email: 'fatuma@worker.tz',
        password: hashedPassword,
        firstName: 'Fatuma',
        lastName: 'Mwalimu',
        userType: 'WORKER',
        isVerified: false,
        location: 'Dar es Salaam, Tanzania',
        phoneNumber: '+255712345678',
        bio: 'Young agricultural graduate specializing in sustainable farming practices.',
        skills: ['Sustainable Farming', 'Crop Rotation', 'Soil Conservation'],
        rating: 4.2,
        totalRatings: 6,
      },
    }),
    // South Africa
    prisma.user.upsert({
      where: { email: 'thabo@worker.za' },
      update: {},
      create: {
        email: 'thabo@worker.za',
        password: hashedPassword,
        firstName: 'Thabo',
        lastName: 'Mthembu',
        userType: 'WORKER',
        isVerified: true,
        location: 'Cape Town, South Africa',
        phoneNumber: '+27834567890',
        bio: 'Viticulture specialist with experience in grape cultivation and wine production.',
        skills: ['Viticulture', 'Wine Production', 'Pruning', 'Harvest Management'],
        rating: 4.4,
        totalRatings: 9,
      },
    }),
  ]);

  // Create sample job postings across Africa
  const jobs = await Promise.all([
    // Kenya - Farm Manager
    prisma.job.create({
      data: {
        title: 'Experienced Farm Manager Needed',
        description: 'We are looking for an experienced farm manager to oversee our 100-acre mixed farm. Responsibilities include managing day-to-day operations, supervising workers, and ensuring optimal crop and livestock production.',
        category: 'Management',
        location: 'Nakuru, Kenya',
        salary: 45000,
        salaryType: 'MONTHLY',
        jobType: 'PERMANENT',
        startDate: new Date('2025-08-01'),
        workersNeeded: 1,
        skills: ['Farm Management', 'Leadership', 'Crop Production', 'Livestock Management'],
        requirements: 'Minimum 5 years experience in farm management, diploma in agriculture or related field, strong leadership skills.',
        employerId: employers[0].id,
        status: 'ACTIVE',
      },
    }),
    // Nigeria - Rice Harvesters
    prisma.job.create({
      data: {
        title: 'Rice Harvest Workers Needed',
        description: 'Join our rice harvest team for the dry season. We need experienced workers familiar with rice harvesting techniques and equipment operation.',
        category: 'Harvesting',
        location: 'Kaduna, Nigeria',
        salary: 1500,
        salaryType: 'DAILY',
        jobType: 'SEASONAL',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2025-12-31'),
        workersNeeded: 20,
        skills: ['Rice Harvesting', 'Equipment Operation', 'Physical Fitness'],
        requirements: 'Previous rice farming experience, ability to work in hot conditions, team player.',
        employerId: employers[1].id,
        status: 'ACTIVE',
        isBoosted: true,
        boostedUntil: new Date('2025-08-30'),
      },
    }),
    // Ghana - Cocoa Farm Assistant
    prisma.job.create({
      data: {
        title: 'Cocoa Farm Assistant',
        description: 'Looking for dedicated workers to assist with cocoa cultivation, including pruning, harvesting, and post-harvest processing.',
        category: 'Crop Production',
        location: 'Kumasi, Ghana',
        salary: 800,
        salaryType: 'DAILY',
        jobType: 'PERMANENT',
        startDate: new Date('2025-07-15'),
        workersNeeded: 3,
        skills: ['Cocoa Farming', 'Pruning', 'Post-Harvest Processing'],
        requirements: 'Knowledge of cocoa cultivation, physical fitness, willingness to learn new techniques.',
        employerId: employers[2].id,
        status: 'ACTIVE',
      },
    }),
    // Uganda - Coffee Processing Technician
    prisma.job.create({
      data: {
        title: 'Coffee Processing Technician',
        description: 'We need skilled technicians to manage our coffee processing facility. Knowledge of wet and dry processing methods required.',
        category: 'Processing',
        location: 'Jinja, Uganda',
        salary: 600000,
        salaryType: 'MONTHLY',
        jobType: 'PERMANENT',
        startDate: new Date('2025-08-01'),
        workersNeeded: 2,
        skills: ['Coffee Processing', 'Quality Control', 'Equipment Maintenance'],
        requirements: 'Certificate in food processing or related field, 2+ years experience in coffee processing.',
        employerId: employers[3].id,
        status: 'ACTIVE',
      },
    }),
    // South Africa - Vineyard Worker
    prisma.job.create({
      data: {
        title: 'Seasonal Vineyard Workers',
        description: 'Seasonal positions available for grape harvest and general vineyard maintenance. Wine farm experience preferred.',
        category: 'Harvesting',
        location: 'Stellenbosch, South Africa',
        salary: 250,
        salaryType: 'DAILY',
        jobType: 'SEASONAL',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-04-30'),
        workersNeeded: 8,
        skills: ['Grape Harvesting', 'Pruning', 'Vineyard Maintenance'],
        requirements: 'Previous vineyard experience preferred, physical fitness, attention to detail.',
        employerId: employers[4].id,
        status: 'ACTIVE',
      },
    }),
    // Morocco - Olive Harvest Team
    prisma.job.create({
      data: {
        title: 'Olive Harvest Team Members',
        description: 'Seeking experienced workers for olive harvest season. Traditional and modern harvesting techniques will be used.',
        category: 'Harvesting',
        location: 'Fez, Morocco',
        salary: 120,
        salaryType: 'DAILY',
        jobType: 'SEASONAL',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2025-12-15'),
        workersNeeded: 12,
        skills: ['Olive Harvesting', 'Tree Climbing', 'Quality Sorting'],
        requirements: 'Experience in olive or fruit harvesting, physical fitness, teamwork skills.',
        employerId: employers[5].id,
        status: 'ACTIVE',
        isBoosted: true,
        boostedUntil: new Date('2025-09-01'),
      },
    }),
  ]);

  // Create sample applications
  const applications = await Promise.all([
    prisma.application.create({
      data: {
        jobId: jobs[0].id,
        applicantId: workers[0].id,
        status: 'PENDING',
        coverLetter: 'I am very interested in the farm manager position. With my 8 years of experience in mixed farming and proven leadership skills, I believe I would be a great fit for your team.',
        proposedSalary: 45000,
      },
    }),
    prisma.application.create({
      data: {
        jobId: jobs[1].id,
        applicantId: workers[1].id,
        status: 'ACCEPTED',
        coverLetter: 'I have extensive experience in rice farming and processing. I am available for the entire harvest season and can work with various equipment.',
        proposedSalary: 1500,
      },
    }),
    prisma.application.create({
      data: {
        jobId: jobs[2].id,
        applicantId: workers[2].id,
        status: 'PENDING',
        coverLetter: 'I have grown up around cocoa farms and understand the cultivation process well. I am eager to contribute to your plantation.',
        proposedSalary: 800,
      },
    }),
    prisma.application.create({
      data: {
        jobId: jobs[3].id,
        applicantId: workers[3].id,
        status: 'ACCEPTED',
        coverLetter: 'As a coffee cultivation specialist, I am excited about the opportunity to work in processing. My experience in quality grading would be valuable.',
        proposedSalary: 600000,
      },
    }),
  ]);

  // Create sample ratings
  await Promise.all([
    prisma.rating.create({
      data: {
        rating: 5,
        comment: 'Excellent worker, very reliable and skilled. Highly recommend!',
        fromUserId: employers[0].id,
        toUserId: workers[0].id,
        jobId: jobs[0].id,
      },
    }),
    prisma.rating.create({
      data: {
        rating: 4,
        comment: 'Good employer, pays on time and provides all necessary equipment. Safe working conditions.',
        fromUserId: workers[1].id,
        toUserId: employers[1].id,
        jobId: jobs[1].id,
      },
    }),
    prisma.rating.create({
      data: {
        rating: 5,
        comment: 'Outstanding coffee processing skills and attention to detail. A true professional.',
        fromUserId: employers[3].id,
        toUserId: workers[3].id,
        jobId: jobs[3].id,
      },
    }),
  ]);

  // Create admin settings
  await prisma.adminSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      jobPostingFee: 500,
      jobBoostingFee: 1000,
      commissionRate: 0.05,
      premiumMembershipFee: 2000,
    },
  });

  // Create consent log entries
  console.log('📝 Creating consent log entries...');
  
  const logsDir = path.resolve(__dirname, '../logs');
  try {
    await fs.access(logsDir);
  } catch (error) {
    await fs.mkdir(logsDir, { recursive: true });
  }

  const logPath = path.join(logsDir, 'consent.log');
  const consentEntries = [];

  // Generate consent logs for different countries
  countries.forEach(country => {
    // Generate 15-25 consent entries per country
    const entriesCount = Math.floor(Math.random() * 11) + 15;
    
    for (let i = 0; i < entriesCount; i++) {
      const consent = Math.random() > 0.25 ? 'accepted' : 'declined'; // 75% acceptance rate
      consentEntries.push(createConsentLogEntry(consent, country.name));
    }
  });

  // Write consent entries to log file
  const logContent = consentEntries.map(entry => JSON.stringify(entry)).join('\n') + '\n';
  await fs.writeFile(logPath, logContent, 'utf8');

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Seeded data summary:');
  console.log(`- Users: ${(await prisma.user.count())} (1 admin, ${employers.length} employers, ${workers.length} workers)`);
  console.log(`- Jobs: ${(await prisma.job.count())} across ${countries.length} African countries`);
  console.log(`- Applications: ${(await prisma.application.count())}`);
  console.log(`- Ratings: ${(await prisma.rating.count())}`);
  console.log(`- Consent logs: ${consentEntries.length} entries`);
  console.log(`- Countries covered: ${countries.map(c => c.name).join(', ')}`);
  
  console.log('\n🔑 Login credentials for testing:');
  console.log('Admin: admin@farmworkhub.com / password123');
  console.log('Employer (Kenya): johndoe@greenvalley.co.ke / password123');
  console.log('Employer (Nigeria): adunni@goldengrain.ng / password123');
  console.log('Worker (Kenya): grace@worker.com / password123');
  console.log('Worker (Nigeria): emeka@worker.ng / password123');
  
  console.log('\n🌍 Geographic distribution:');
  console.log('- Kenya: 1 employer, 1 worker, 1 job');
  console.log('- Nigeria: 1 employer, 1 worker, 1 job');
  console.log('- Ghana: 1 employer, 1 worker, 1 job');
  console.log('- Uganda: 1 employer, 1 worker, 1 job');
  console.log('- South Africa: 1 employer, 1 worker, 1 job');
  console.log('- Morocco: 1 employer, 0 workers, 1 job');
  
  console.log('\n📋 Consent statistics:');
  const accepted = consentEntries.filter(e => e.consent === 'accepted').length;
  const declined = consentEntries.filter(e => e.consent === 'declined').length;
  console.log(`- Accepted: ${accepted} (${Math.round((accepted / consentEntries.length) * 100)}%)`);
  console.log(`- Declined: ${declined} (${Math.round((declined / consentEntries.length) * 100)}%)`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });