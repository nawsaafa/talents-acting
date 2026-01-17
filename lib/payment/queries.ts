import { prisma } from '@/lib/prisma';
import { PaymentType, Prisma, SubscriptionStatus } from '@prisma/client';

interface CreatePaymentData {
  userId: string;
  stripeSessionId: string;
  paymentType: PaymentType;
  amount: number;
  currency: string;
  description?: string;
  periodStart?: Date;
  periodEnd?: Date;
}

export async function createPaymentRecord(data: CreatePaymentData) {
  return prisma.payment.create({
    data: {
      userId: data.userId,
      stripeSessionId: data.stripeSessionId,
      paymentType: data.paymentType,
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
      status: 'PENDING',
    },
  });
}

export async function getPaymentBySessionId(sessionId: string) {
  return prisma.payment.findUnique({
    where: { stripeSessionId: sessionId },
  });
}

export async function getPaymentById(id: string) {
  return prisma.payment.findUnique({
    where: { id },
  });
}

export async function getUserPayments(userId: string) {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUserActivePayment(userId: string, paymentType: PaymentType) {
  return prisma.payment.findFirst({
    where: {
      userId,
      paymentType,
      status: 'COMPLETED',
      periodEnd: {
        gte: new Date(),
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function hasActiveSubscription(userId: string, paymentType: PaymentType) {
  const payment = await getUserActivePayment(userId, paymentType);
  return !!payment;
}

interface CompletePaymentData {
  stripePaymentIntent?: string;
  stripeCustomerId?: string;
  stripeInvoiceId?: string;
  metadata?: Prisma.InputJsonValue;
}

export async function completePayment(sessionId: string, data?: CompletePaymentData) {
  return prisma.payment.update({
    where: { stripeSessionId: sessionId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      stripePaymentIntent: data?.stripePaymentIntent,
      stripeCustomerId: data?.stripeCustomerId,
      stripeInvoiceId: data?.stripeInvoiceId,
      metadata: data?.metadata,
    },
  });
}

export async function failPayment(sessionId: string) {
  return prisma.payment.update({
    where: { stripeSessionId: sessionId },
    data: {
      status: 'FAILED',
    },
  });
}

export async function getPaymentStats() {
  const [total, completed, pending, failed] = await Promise.all([
    prisma.payment.count(),
    prisma.payment.count({ where: { status: 'COMPLETED' } }),
    prisma.payment.count({ where: { status: 'PENDING' } }),
    prisma.payment.count({ where: { status: 'FAILED' } }),
  ]);

  const revenue = await prisma.payment.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true },
  });

  return {
    total,
    completed,
    pending,
    failed,
    totalRevenue: revenue._sum.amount || 0,
  };
}

export async function getRecentPayments(limit: number = 10) {
  return prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

// Subscription-related queries

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  endsAt: Date | null;
  stripeSubscriptionId: string | null;
}

export async function getTalentSubscription(userId: string): Promise<SubscriptionInfo | null> {
  const profile = await prisma.talentProfile.findUnique({
    where: { userId },
    select: {
      subscriptionStatus: true,
      subscriptionEndsAt: true,
      stripeSubscriptionId: true,
    },
  });

  if (!profile) return null;

  return {
    status: profile.subscriptionStatus,
    endsAt: profile.subscriptionEndsAt,
    stripeSubscriptionId: profile.stripeSubscriptionId,
  };
}

export async function getProfessionalSubscription(
  userId: string
): Promise<SubscriptionInfo | null> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    select: {
      subscriptionStatus: true,
      subscriptionEndsAt: true,
      stripeSubscriptionId: true,
    },
  });

  if (!profile) return null;

  return {
    status: profile.subscriptionStatus,
    endsAt: profile.subscriptionEndsAt,
    stripeSubscriptionId: profile.stripeSubscriptionId,
  };
}

export async function getCompanySubscription(userId: string): Promise<SubscriptionInfo | null> {
  const profile = await prisma.companyProfile.findUnique({
    where: { userId },
    select: {
      subscriptionStatus: true,
      subscriptionEndsAt: true,
      stripeSubscriptionId: true,
    },
  });

  if (!profile) return null;

  return {
    status: profile.subscriptionStatus,
    endsAt: profile.subscriptionEndsAt,
    stripeSubscriptionId: profile.stripeSubscriptionId,
  };
}

export async function updateTalentSubscription(
  userId: string,
  status: SubscriptionStatus,
  endsAt: Date | null,
  stripeSubscriptionId?: string
) {
  return prisma.talentProfile.update({
    where: { userId },
    data: {
      subscriptionStatus: status,
      subscriptionEndsAt: endsAt,
      ...(stripeSubscriptionId && { stripeSubscriptionId }),
    },
  });
}

export async function updateProfessionalSubscriptionFull(
  userId: string,
  status: SubscriptionStatus,
  endsAt: Date | null,
  stripeSubscriptionId?: string
) {
  return prisma.professionalProfile.update({
    where: { userId },
    data: {
      subscriptionStatus: status,
      subscriptionEndsAt: endsAt,
      ...(stripeSubscriptionId && { stripeSubscriptionId }),
    },
  });
}

export async function updateCompanySubscriptionFull(
  userId: string,
  status: SubscriptionStatus,
  endsAt: Date | null,
  stripeSubscriptionId?: string
) {
  return prisma.companyProfile.update({
    where: { userId },
    data: {
      subscriptionStatus: status,
      subscriptionEndsAt: endsAt,
      ...(stripeSubscriptionId && { stripeSubscriptionId }),
    },
  });
}

// Find profile by Stripe subscription ID
export async function findProfileBySubscriptionId(subscriptionId: string) {
  // Check talent profiles
  const talent = await prisma.talentProfile.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
    include: { user: { select: { id: true, email: true, role: true } } },
  });
  if (talent) return { type: 'TALENT' as const, profile: talent };

  // Check professional profiles
  const professional = await prisma.professionalProfile.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
    include: { user: { select: { id: true, email: true, role: true } } },
  });
  if (professional) return { type: 'PROFESSIONAL' as const, profile: professional };

  // Check company profiles
  const company = await prisma.companyProfile.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
    include: { user: { select: { id: true, email: true, role: true } } },
  });
  if (company) return { type: 'COMPANY' as const, profile: company };

  return null;
}

// Get user's billing history with invoice details
export async function getUserBillingHistory(userId: string, limit: number = 20) {
  return prisma.payment.findMany({
    where: {
      userId,
      status: 'COMPLETED',
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      paymentType: true,
      amount: true,
      currency: true,
      description: true,
      periodStart: true,
      periodEnd: true,
      completedAt: true,
      stripeInvoiceId: true,
      createdAt: true,
    },
  });
}
