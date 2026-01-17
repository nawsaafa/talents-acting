import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { completePayment, failPayment, getPaymentBySessionId } from './queries';
import { updateProfessionalSubscription } from '@/lib/professional/queries';
import { updateCompanySubscription } from '@/lib/company/queries';
import { sendPaymentConfirmationEmail } from './email';
import { PaymentType } from '@prisma/client';

interface WebhookResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<WebhookResult> {
  const sessionId = session.id;

  // Check if we already processed this payment (idempotency)
  const existingPayment = await getPaymentBySessionId(sessionId);
  if (!existingPayment) {
    return { success: false, error: 'Payment record not found' };
  }

  if (existingPayment.status === 'COMPLETED') {
    return { success: true, message: 'Payment already processed' };
  }

  const userId = session.metadata?.userId;
  const paymentType = session.metadata?.paymentType as PaymentType | undefined;
  const periodEndStr = session.metadata?.periodEnd;
  const userEmail = session.metadata?.userEmail || session.customer_email;

  if (!userId || !paymentType) {
    return { success: false, error: 'Missing required metadata' };
  }

  const periodEnd = periodEndStr ? new Date(periodEndStr) : null;

  try {
    // Update payment record
    await completePayment(sessionId, {
      stripePaymentIntent: session.payment_intent as string,
      stripeCustomerId: session.customer as string,
      metadata: {
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
      },
    });

    // Update subscription status based on payment type
    await updateUserSubscription(userId, paymentType, periodEnd);

    // Send confirmation email
    if (userEmail) {
      await sendPaymentConfirmationEmail({
        email: userEmail,
        paymentType,
        amount: session.amount_total || 0,
        currency: session.currency?.toUpperCase() || 'MAD',
        periodEnd,
      });
    }

    return { success: true, message: 'Payment processed successfully' };
  } catch (error) {
    console.error('Error processing checkout completion:', error);
    return { success: false, error: 'Failed to process payment' };
  }
}

export async function handleCheckoutExpired(
  session: Stripe.Checkout.Session
): Promise<WebhookResult> {
  const sessionId = session.id;

  const existingPayment = await getPaymentBySessionId(sessionId);
  if (!existingPayment) {
    return { success: true, message: 'No payment record found' };
  }

  if (existingPayment.status !== 'PENDING') {
    return { success: true, message: 'Payment not in pending state' };
  }

  try {
    await failPayment(sessionId);
    return { success: true, message: 'Payment marked as failed' };
  } catch (error) {
    console.error('Error handling checkout expiration:', error);
    return { success: false, error: 'Failed to update payment status' };
  }
}

export async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<WebhookResult> {
  // Find payment by payment intent
  const payment = await prisma.payment.findFirst({
    where: { stripePaymentIntent: paymentIntent.id },
  });

  if (!payment) {
    return { success: true, message: 'No payment record found' };
  }

  try {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });
    return { success: true, message: 'Payment marked as failed' };
  } catch (error) {
    console.error('Error handling payment failure:', error);
    return { success: false, error: 'Failed to update payment status' };
  }
}

async function updateUserSubscription(
  userId: string,
  paymentType: PaymentType,
  periodEnd: Date | null
) {
  switch (paymentType) {
    case 'PROFESSIONAL_ACCESS':
      await updateProfessionalSubscription(userId, 'ACTIVE', periodEnd);
      break;
    case 'COMPANY_ACCESS':
      await updateCompanySubscription(userId, 'ACTIVE', periodEnd);
      break;
    case 'TALENT_MEMBERSHIP':
      // Talents don't have subscription status in the current schema
      // Could add to TalentProfile in future if needed
      break;
  }
}

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
  });
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
