'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { signIn, signOut } from './auth';
import { redirect } from 'next/navigation';
import { Role, Gender, ValidationStatus } from '@prisma/client';

// Validation helpers
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
}

// Action result types
type ActionResult = {
  success: boolean;
  error?: string;
};

/**
 * Register a new talent user
 */
export async function registerTalent(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const gender = formData.get('gender') as Gender;
  const ageRangeMin = parseInt(formData.get('ageRangeMin') as string);
  const ageRangeMax = parseInt(formData.get('ageRangeMax') as string);

  // Validation
  if (!email || !password || !firstName || !lastName || !gender) {
    return { success: false, error: 'All required fields must be filled' };
  }

  if (!validateEmail(email)) {
    return { success: false, error: 'Invalid email format' };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { success: false, error: passwordError };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' };
  }

  if (isNaN(ageRangeMin) || isNaN(ageRangeMax) || ageRangeMin < 0 || ageRangeMax < ageRangeMin) {
    return { success: false, error: 'Invalid age range' };
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { success: false, error: 'An account with this email already exists' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    // Create user and talent profile in transaction
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: Role.TALENT,
        },
      });

      await tx.talentProfile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          gender,
          ageRangeMin,
          ageRangeMax,
          validationStatus: ValidationStatus.PENDING,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
}

/**
 * Register a new professional user
 */
export async function registerProfessional(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const profession = formData.get('profession') as string;
  const company = formData.get('company') as string | null;
  const accessReason = formData.get('accessReason') as string;

  // Validation
  if (!email || !password || !firstName || !lastName || !profession || !accessReason) {
    return { success: false, error: 'All required fields must be filled' };
  }

  if (!validateEmail(email)) {
    return { success: false, error: 'Invalid email format' };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { success: false, error: passwordError };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' };
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { success: false, error: 'An account with this email already exists' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    // Create user and professional profile in transaction
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: Role.PROFESSIONAL,
        },
      });

      await tx.professionalProfile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          profession,
          company: company || null,
          accessReason,
          validationStatus: ValidationStatus.PENDING,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
}

/**
 * Register a new company user
 */
export async function registerCompany(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const companyName = formData.get('companyName') as string;
  const industry = formData.get('industry') as string | null;
  const contactEmail = formData.get('contactEmail') as string;
  const contactPhone = formData.get('contactPhone') as string | null;
  const website = formData.get('website') as string | null;
  const city = formData.get('city') as string | null;
  const country = formData.get('country') as string | null;

  // Validation
  if (!email || !password || !companyName || !contactEmail) {
    return { success: false, error: 'All required fields must be filled' };
  }

  if (!validateEmail(email) || !validateEmail(contactEmail)) {
    return { success: false, error: 'Invalid email format' };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { success: false, error: passwordError };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' };
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { success: false, error: 'An account with this email already exists' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    // Create user and company profile in transaction
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: Role.COMPANY,
        },
      });

      await tx.companyProfile.create({
        data: {
          userId: user.id,
          companyName,
          industry: industry || null,
          contactEmail,
          contactPhone: contactPhone || null,
          website: website || null,
          city: city || null,
          country: country || null,
          validationStatus: ValidationStatus.PENDING,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
}

/**
 * Sign in with credentials
 */
export async function login(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Invalid email or password' };
  }
}

/**
 * Sign out the current user
 */
export async function logout() {
  await signOut({ redirect: false });
  redirect('/');
}
