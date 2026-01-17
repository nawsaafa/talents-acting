'use server';

import { auth } from '@/lib/auth/auth';
import { getStripe, isStripeConfigured } from './stripe';
import { PRICING, CURRENCY, getPaymentTypeForRole } from './config';
import { createPaymentRecord } from './queries';
import { getOrCreateStripeCustomer } from './subscription';
import { getPriceId } from './products';
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
    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      return { success: false, error: 'Payment system is not configured. Please contact support.' };
    }

    const session = await auth();

    if (!session?.user?.id || !session?.user?.email) {
      return { success: false, error: 'You must be logged in to make a payment' };
    }

    const pricing = PRICING[paymentType];
    if (!pricing) {
      return { success: false, error: 'Invalid payment type' };
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(session.user.id, session.user.email);

    // Get the price ID for this payment type
    const priceId = await getPriceId(paymentType);

    // Create subscription checkout session
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        userEmail: session.user.email,
        paymentType,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          paymentType,
        },
      },
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
      periodEnd: undefined, // Will be set by webhook when subscription is created
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
    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      return { success: false, error: 'Payment system is not configured' };
    }

    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    const stripe = getStripe();
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
