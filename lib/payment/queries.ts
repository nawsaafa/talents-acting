import { prisma } from '@/lib/prisma';
import { PaymentType, Prisma } from '@prisma/client';

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
