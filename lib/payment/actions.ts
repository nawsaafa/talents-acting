'use server';

import { auth } from '@/lib/auth/auth';
import { stripe } from './stripe';
import { PRICING, CURRENCY, calculatePeriodEnd, getPaymentTypeForRole } from './config';
import { createPaymentRecord, getPaymentBySessionId } from './queries';
import { PaymentType } from '@prisma/client';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface CreateCheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function createCheckoutSession(
  paymentType: PaymentType
): Promise<CreateCheckoutResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: 'You must be logged in to make a payment' };
    }

    const pricing = PRICING[paymentType];
    if (!pricing) {
      return { success: false, error: 'Invalid payment type' };
    }

    // Check if user already has an active payment for this type
    const existingPayment = await getPaymentBySessionId(session.user.id);
    if (existingPayment && existingPayment.status === 'COMPLETED') {
      return { success: false, error: 'You already have an active subscription' };
    }

    const periodEnd = calculatePeriodEnd(pricing.periodMonths);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: CURRENCY.code,
            product_data: {
              name: pricing.description,
              description: `Valid for ${pricing.periodMonths} months`,
            },
            unit_amount: pricing.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        userEmail: session.user.email || '',
        paymentType,
        periodEnd: periodEnd.toISOString(),
      },
      customer_email: session.user.email || undefined,
      success_url: `${APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/payment/cancel`,
    });

    if (!checkoutSession.url) {
      return { success: false, error: 'Failed to create checkout session' };
    }

    // Create pending payment record
    await createPaymentRecord({
      userId: session.user.id,
      stripeSessionId: checkoutSession.id,
      paymentType,
      amount: pricing.amount,
      currency: CURRENCY.code,
      description: pricing.description,
      periodStart: new Date(),
      periodEnd,
    });

    return { success: true, url: checkoutSession.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { success: false, error: 'Failed to create checkout session' };
  }
}

export async function createTalentCheckout(): Promise<CreateCheckoutResult> {
  return createCheckoutSession('TALENT_MEMBERSHIP');
}

export async function createProfessionalCheckout(): Promise<CreateCheckoutResult> {
  return createCheckoutSession('PROFESSIONAL_ACCESS');
}

export async function createCompanyCheckout(): Promise<CreateCheckoutResult> {
  return createCheckoutSession('COMPANY_ACCESS');
}

export async function getCheckoutSessionStatus(sessionId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      success: true,
      data: {
        status: checkoutSession.status,
        paymentStatus: checkoutSession.payment_status,
        customerEmail: checkoutSession.customer_email,
        amountTotal: checkoutSession.amount_total,
        currency: checkoutSession.currency,
      },
    };
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return { success: false, error: 'Failed to retrieve session status' };
  }
}

export async function getUserPaymentStatus() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    const role = session.user.role;
    if (!role || !['TALENT', 'PROFESSIONAL', 'COMPANY'].includes(role)) {
      return { success: false, error: 'Invalid user role for payment' };
    }

    const paymentType = getPaymentTypeForRole(role as 'TALENT' | 'PROFESSIONAL' | 'COMPANY');
    const pricing = PRICING[paymentType];

    return {
      success: true,
      data: {
        paymentType,
        pricing: {
          amount: pricing.amount,
          displayAmount: pricing.displayAmount,
          description: pricing.description,
          periodMonths: pricing.periodMonths,
        },
        currency: CURRENCY,
      },
    };
  } catch (error) {
    console.error('Error getting payment status:', error);
    return { success: false, error: 'Failed to get payment status' };
  }
}
