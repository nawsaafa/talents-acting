import { PrismaClient, Role, ValidationStatus, Gender, Physique, HairColor, EyeColor, HairLength, BeardType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data (in reverse order of dependencies)
  await prisma.companyProfile.deleteMany();
  await prisma.professionalProfile.deleteMany();
  await prisma.talentProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@talentsacting.com',
      password: '$2a$10$placeholder_hash_admin', // Placeholder - will be hashed properly in auth
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log('Created admin user:', adminUser.email);

  // Create Talent Users with Profiles
  const talent1 = await prisma.user.create({
    data: {
      email: 'ahmed.hassan@example.com',
      password: '$2a$10$placeholder_hash_talent1',
      role: Role.TALENT,
      isActive: true,
      talentProfile: {
        create: {
          firstName: 'Ahmed',
          lastName: 'Hassan',
          gender: Gender.MALE,
          ageRangeMin: 25,
          ageRangeMax: 35,
          height: 180,
          physique: Physique.ATHLETIC,
          ethnicAppearance: 'Middle Eastern',
          hairColor: HairColor.BLACK,
          eyeColor: EyeColor.BROWN,
          hairLength: HairLength.SHORT,
          beardType: BeardType.STUBBLE,
          hasTattoos: false,
          hasScars: false,
          languages: ['Arabic', 'English', 'French'],
          accents: ['Gulf Arabic', 'Egyptian Arabic', 'British'],
          athleticSkills: ['Swimming', 'Martial Arts', 'Horse Riding'],
          musicalInstruments: ['Oud', 'Piano'],
          performanceSkills: ['Drama', 'Voice Acting', 'Improvisation'],
          danceStyles: ['Traditional', 'Contemporary'],
          hasShowreel: true,
          showreel: 'https://example.com/ahmed-showreel',
          presentationVideo: 'https://example.com/ahmed-intro',
          isAvailable: true,
          dailyRate: 500.00,
          rateNegotiable: true,
          validationStatus: ValidationStatus.APPROVED,
          validatedAt: new Date(),
          validatedBy: adminUser.id,
          isPublic: true,
          bio: 'Experienced actor with 10 years in film and television. Specializing in dramatic roles and action sequences.',
          location: 'Dubai, UAE',
          contactEmail: 'ahmed.hassan@example.com',
          portfolio: ['https://example.com/portfolio1', 'https://example.com/portfolio2'],
          socialMedia: {
            instagram: '@ahmed_actor',
            twitter: '@ahmedhassan',
          },
        },
      },
    },
    include: { talentProfile: true },
  });
  console.log('Created talent:', talent1.email);

  const talent2 = await prisma.user.create({
    data: {
      email: 'sara.alami@example.com',
      password: '$2a$10$placeholder_hash_talent2',
      role: Role.TALENT,
      isActive: true,
      talentProfile: {
        create: {
          firstName: 'Sara',
          lastName: 'Alami',
          gender: Gender.FEMALE,
          ageRangeMin: 20,
          ageRangeMax: 30,
          height: 165,
          physique: Physique.SLIM,
          ethnicAppearance: 'Middle Eastern',
          hairColor: HairColor.BROWN,
          eyeColor: EyeColor.GREEN,
          hairLength: HairLength.LONG,
          hasTattoos: false,
          hasScars: false,
          languages: ['Arabic', 'English', 'Spanish'],
          accents: ['Levantine Arabic', 'American'],
          athleticSkills: ['Yoga', 'Dance'],
          musicalInstruments: ['Guitar', 'Violin'],
          performanceSkills: ['Stand-up Comedy', 'Drama', 'Musical Theater'],
          danceStyles: ['Ballet', 'Hip Hop', 'Contemporary'],
          hasShowreel: true,
          showreel: 'https://example.com/sara-showreel',
          isAvailable: true,
          dailyRate: 400.00,
          rateNegotiable: true,
          validationStatus: ValidationStatus.APPROVED,
          validatedAt: new Date(),
          validatedBy: adminUser.id,
          isPublic: true,
          bio: 'Versatile actress and comedian. Known for comedic timing and musical performances.',
          location: 'Beirut, Lebanon',
          contactEmail: 'sara.alami@example.com',
        },
      },
    },
    include: { talentProfile: true },
  });
  console.log('Created talent:', talent2.email);

  // Create pending talent (not yet approved)
  const talent3 = await prisma.user.create({
    data: {
      email: 'omar.farouk@example.com',
      password: '$2a$10$placeholder_hash_talent3',
      role: Role.TALENT,
      isActive: true,
      talentProfile: {
        create: {
          firstName: 'Omar',
          lastName: 'Farouk',
          gender: Gender.MALE,
          ageRangeMin: 35,
          ageRangeMax: 45,
          height: 175,
          physique: Physique.AVERAGE,
          ethnicAppearance: 'Middle Eastern',
          hairColor: HairColor.GRAY,
          eyeColor: EyeColor.BROWN,
          hairLength: HairLength.SHORT,
          beardType: BeardType.FULL,
          hasTattoos: false,
          hasScars: true,
          scarDescription: 'Small scar on left eyebrow',
          languages: ['Arabic', 'English'],
          accents: ['Egyptian Arabic'],
          athleticSkills: [],
          musicalInstruments: [],
          performanceSkills: ['Drama', 'Voice Acting'],
          danceStyles: [],
          hasShowreel: false,
          isAvailable: true,
          rateNegotiable: true,
          validationStatus: ValidationStatus.PENDING,
          isPublic: false,
          bio: 'Character actor with experience in supporting roles.',
          location: 'Cairo, Egypt',
        },
      },
    },
    include: { talentProfile: true },
  });
  console.log('Created pending talent:', talent3.email);

  // Create Professional User
  const professional = await prisma.user.create({
    data: {
      email: 'director@filmstudio.com',
      password: '$2a$10$placeholder_hash_pro',
      role: Role.PROFESSIONAL,
      isActive: true,
      professionalProfile: {
        create: {
          firstName: 'Khalid',
          lastName: 'Mansour',
          profession: 'Casting Director',
          company: 'Gulf Film Studios',
          accessReason: 'Casting for upcoming feature film production',
          validationStatus: ValidationStatus.APPROVED,
          validatedAt: new Date(),
          validatedBy: adminUser.id,
          contactEmail: 'khalid@gulffilmstudios.com',
          website: 'https://gulffilmstudios.com',
        },
      },
    },
    include: { professionalProfile: true },
  });
  console.log('Created professional:', professional.email);

  // Create Company User
  const company = await prisma.user.create({
    data: {
      email: 'info@menaproductions.com',
      password: '$2a$10$placeholder_hash_company',
      role: Role.COMPANY,
      isActive: true,
      companyProfile: {
        create: {
          companyName: 'MENA Productions',
          industry: 'Film Production',
          description: 'Leading film and television production company in the MENA region.',
          website: 'https://menaproductions.com',
          contactEmail: 'casting@menaproductions.com',
          contactPhone: '+971-4-123-4567',
          city: 'Dubai',
          country: 'UAE',
          validationStatus: ValidationStatus.APPROVED,
          validatedAt: new Date(),
          validatedBy: adminUser.id,
          isVerifiedCompany: true,
        },
      },
    },
    include: { companyProfile: true },
  });
  console.log('Created company:', company.email);

  // Create Visitor User (no profile)
  const visitor = await prisma.user.create({
    data: {
      email: 'visitor@example.com',
      password: '$2a$10$placeholder_hash_visitor',
      role: Role.VISITOR,
      isActive: true,
    },
  });
  console.log('Created visitor:', visitor.email);

  console.log('\nSeed completed successfully!');
  console.log('Summary:');
  console.log('- 1 Admin user');
  console.log('- 3 Talent users (2 approved, 1 pending)');
  console.log('- 1 Professional user');
  console.log('- 1 Company user');
  console.log('- 1 Visitor user');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
