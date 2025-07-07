const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

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
      bio: 'Platform administrator managing FarmWork Hub operations.',
    },
  });

  // Create sample employers
  const employers = await Promise.all([
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
    prisma.user.upsert({
      where: { email: 'marysmith@sunshineagri.com' },
      update: {},
      create: {
        email: 'marysmith@sunshineagri.com',
        password: hashedPassword,
        firstName: 'Mary',
        lastName: 'Smith',
        userType: 'EMPLOYER',
        isVerified: true,
        location: 'Eldoret, Kenya',
        phoneNumber: '+254733234567',
        bio: 'Agricultural consultant and farm manager with 15 years of experience.',
        rating: 4.8,
        totalRatings: 20,
      },
    }),
    prisma.user.upsert({
      where: { email: 'peter@goldenharvest.co.ke' },
      update: {},
      create: {
        email: 'peter@goldenharvest.co.ke',
        password: hashedPassword,
        firstName: 'Peter',
        lastName: 'Kiprotich',
        userType: 'EMPLOYER',
        isVerified: true,
        location: 'Kitale, Kenya',
        phoneNumber: '+254744345678',
        bio: 'Managing Director of Golden Harvest Cooperative, focusing on maize and wheat production.',
        rating: 4.2,
        totalRatings: 8,
      },
    }),
  ]);

  // Create sample workers
  const workers = await Promise.all([
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
    prisma.user.upsert({
      where: { email: 'samuel@worker.com' },
      update: {},
      create: {
        email: 'samuel@worker.com',
        password: hashedPassword,
        firstName: 'Samuel',
        lastName: 'Mutua',
        userType: 'WORKER',
        isVerified: true,
        location: 'Machakos, Kenya',
        phoneNumber: '+254766567890',
        bio: 'Agricultural technician with expertise in greenhouse management and pest control.',
        skills: ['Greenhouse Management', 'Pest Control', 'Soil Testing', 'Harvesting'],
        rating: 4.3,
        totalRatings: 10,
      },
    }),
    prisma.user.upsert({
      where: { email: 'esther@worker.com' },
      update: {},
      create: {
        email: 'esther@worker.com',
        password: hashedPassword,
        firstName: 'Esther',
        lastName: 'Nyong',
        userType: 'WORKER',
        isVerified: false,
        location: 'Mombasa, Kenya',
        phoneNumber: '+254777678901',
        bio: 'Young agricultural graduate seeking opportunities in modern farming techniques.',
        skills: ['Modern Farming', 'Data Collection', 'Equipment Operation'],
        rating: 4.0,
        totalRatings: 3,
      },
    }),
  ]);

  // Create sample job postings
  const jobs = await Promise.all([
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
    prisma.job.create({
      data: {
        title: 'Seasonal Maize Harvesters',
        description: 'Join our harvest team for the upcoming maize season. We need skilled harvesters who can work efficiently and handle harvesting equipment.',
        category: 'Harvesting',
        location: 'Kitale, Kenya',
        salary: 800,
        salaryType: 'DAILY',
        jobType: 'SEASONAL',
        startDate: new Date('2025-09-15'),
        endDate: new Date('2025-11-30'),
        workersNeeded: 15,
        skills: ['Harvesting', 'Equipment Operation', 'Physical Fitness'],
        requirements: 'Previous harvesting experience preferred, ability to work long hours during harvest season.',
        employerId: employers[2].id,
        status: 'ACTIVE',
        isBoosted: true,
        boostedUntil: new Date('2025-08-15'),
      },
    }),
    prisma.job.create({
      data: {
        title: 'Dairy Farm Assistant',
        description: 'Looking for a reliable dairy farm assistant to help with milking, feeding, and general care of dairy cows. Early morning shifts required.',
        category: 'Livestock',
        location: 'Nakuru, Kenya',
        salary: 25000,
        salaryType: 'MONTHLY',
        jobType: 'PERMANENT',
        startDate: new Date('2025-07-15'),
        workersNeeded: 2,
        skills: ['Dairy Farming', 'Animal Care', 'Milking'],
        requirements: 'Experience with dairy cattle, available for early morning shifts, knowledge of animal health basics.',
        employerId: employers[0].id,
        status: 'ACTIVE',
      },
    }),
    prisma.job.create({
      data: {
        title: 'Greenhouse Technician',
        description: 'We need a skilled greenhouse technician to manage our tomato and cucumber production. Knowledge of hydroponic systems is a plus.',
        category: 'Greenhouse',
        location: 'Eldoret, Kenya',
        salary: 35000,
        salaryType: 'MONTHLY',
        jobType: 'PERMANENT',
        startDate: new Date('2025-08-01'),
        workersNeeded: 1,
        skills: ['Greenhouse Management', 'Hydroponics', 'Pest Control', 'Climate Control'],
        requirements: 'Certificate in horticulture or related field, 2+ years greenhouse experience, knowledge of modern growing techniques.',
        employerId: employers[1].id,
        status: 'ACTIVE',
      },
    }),
    prisma.job.create({
      data: {
        title: 'Weekend Farm Workers',
        description: 'Part-time weekend work available for general farm maintenance, weeding, and light harvesting tasks.',
        category: 'General Labor',
        location: 'Kiambu, Kenya',
        salary: 600,
        salaryType: 'DAILY',
        jobType: 'TEMPORARY',
        startDate: new Date('2025-07-12'),
        endDate: new Date('2025-12-31'),
        workersNeeded: 5,
        skills: ['General Farm Work', 'Weeding', 'Harvesting'],
        requirements: 'No previous experience required, willingness to learn, available on weekends.',
        employerId: employers[1].id,
        status: 'ACTIVE',
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
        coverLetter: 'I have extensive experience in maize harvesting and am available for the entire harvest season. I can operate various harvesting equipment.',
        proposedSalary: 800,
      },
    }),
    prisma.application.create({
      data: {
        jobId: jobs[2].id,
        applicantId: workers[2].id,
        status: 'PENDING',
        coverLetter: 'As a recent agriculture graduate, I am eager to start my career in dairy farming. I am a quick learner and very reliable.',
        proposedSalary: 23000,
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
        comment: 'Good employer, pays on time and provides all necessary equipment.',
        fromUserId: workers[1].id,
        toUserId: employers[2].id,
        jobId: jobs[1].id,
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

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Seeded data summary:');
  console.log(`- Users: ${(await prisma.user.count())} (1 admin, 3 employers, 3 workers)`);
  console.log(`- Jobs: ${(await prisma.job.count())}`);
  console.log(`- Applications: ${(await prisma.application.count())}`);
  console.log(`- Ratings: ${(await prisma.rating.count())}`);
  console.log('\n🔑 Login credentials for testing:');
  console.log('Admin: admin@farmworkhub.com / password123');
  console.log('Employer: johndoe@greenvalley.co.ke / password123');
  console.log('Worker: grace@worker.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });