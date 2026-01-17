import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { PaymentType, SubscriptionStatus } from '@prisma/client';
import {
  completePayment,
  failPayment,
  getPaymentBySessionId,
  findProfileBySubscriptionId,
  updateTalentSubscription,
  updateProfessionalSubscriptionFull,
  updateCompanySubscriptionFull,
  createPaymentRecord,
} from './queries';
import { mapStripeStatus } from './subscription';
import { sendPaymentConfirmationEmail } from './email';
import { getStripe, isStripeConfigured } from './stripe';

interface WebhookResult {
  success: boolean;
  error?: string;
  message?: string;
}

// Handle checkout.session.completed for subscriptions
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
  const userEmail = session.metadata?.userEmail || session.customer_email;

  if (!userId || !paymentType) {
    return { success: false, error: 'Missing required metadata' };
  }

  try {
    // For subscriptions, get period end from subscription
    const subscriptionId = session.subscription as string;
    let periodEnd: Date | null = null;

    if (subscriptionId) {
      const stripe = getStripe();
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subData = subscription as any;
      periodEnd = new Date(subData.current_period_end * 1000);

      // Update profile with subscription ID
      await updateUserSubscriptionWithId(userId, paymentType, 'ACTIVE', periodEnd, subscriptionId);
    }

    // Update payment record
    await completePayment(sessionId, {
      stripePaymentIntent: session.payment_intent as string | undefined,
      stripeCustomerId: session.customer as string,
      metadata: {
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
        subscriptionId,
      },
    });

    // Update payment period end
    if (periodEnd) {
      await prisma.payment.update({
        where: { stripeSessionId: sessionId },
        data: { periodEnd },
      });
    }

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

    return { success: true, message: 'Subscription checkout processed successfully' };
  } catch (error) {
    console.error('Error processing checkout completion:', error);
    return { success: false, error: 'Failed to process payment' };
  }
}

// Handle customer.subscription.updated (status changes, renewals)
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<WebhookResult> {
  const subscriptionId = subscription.id;
  const status = mapStripeStatus(subscription.status);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subData = subscription as any;
  const periodEnd = new Date(subData.current_period_end * 1000);

  try {
    const profileResult = await findProfileBySubscriptionId(subscriptionId);

    if (!profileResult) {
      return { success: true, message: 'No profile found for subscription' };
    }

    const { type, profile } = profileResult;

    // Update subscription status
    switch (type) {
      case 'TALENT':
        await updateTalentSubscription(profile.userId, status, periodEnd);
        break;
      case 'PROFESSIONAL':
        await updateProfessionalSubscriptionFull(profile.userId, status, periodEnd);
        break;
      case 'COMPANY':
        await updateCompanySubscriptionFull(profile.userId, status, periodEnd);
        break;
    }

    return { success: true, message: `Subscription updated to ${status}` };
  } catch (error) {
    console.error('Error handling subscription update:', error);
    return { success: false, error: 'Failed to update subscription status' };
  }
}

// Handle customer.subscription.deleted
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<WebhookResult> {
  const subscriptionId = subscription.id;

  try {
    const profileResult = await findProfileBySubscriptionId(subscriptionId);

    if (!profileResult) {
      return { success: true, message: 'No profile found for subscription' };
    }

    const { type, profile } = profileResult;
    const status: SubscriptionStatus = 'CANCELLED';

    // Mark subscription as cancelled
    switch (type) {
      case 'TALENT':
        await updateTalentSubscription(profile.userId, status, null);
        break;
      case 'PROFESSIONAL':
        await updateProfessionalSubscriptionFull(profile.userId, status, null);
        break;
      case 'COMPANY':
        await updateCompanySubscriptionFull(profile.userId, status, null);
        break;
    }

    return { success: true, message: 'Subscription cancelled' };
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
    return { success: false, error: 'Failed to cancel subscription' };
  }
}

// Handle invoice.paid (for renewals)
export async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<WebhookResult> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invoiceData = invoice as any;

  // Skip if this is the first invoice (handled by checkout.session.completed)
  if (invoice.billing_reason === 'subscription_create') {
    return { success: true, message: 'Initial invoice, handled by checkout' };
  }

  const subscriptionId = invoiceData.subscription as string;
  if (!subscriptionId) {
    return { success: true, message: 'No subscription on invoice' };
  }

  try {
    const profileResult = await findProfileBySubscriptionId(subscriptionId);

    if (!profileResult) {
      return { success: true, message: 'No profile found for subscription' };
    }

    const { type, profile } = profileResult;

    // Get subscription details for period end
    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subData = subscription as any;
    const periodEnd = new Date(subData.current_period_end * 1000);
    const periodStart = new Date(subData.current_period_start * 1000);

    // Update subscription status to ACTIVE
    switch (type) {
      case 'TALENT':
        await updateTalentSubscription(profile.userId, 'ACTIVE', periodEnd);
        break;
      case 'PROFESSIONAL':
        await updateProfessionalSubscriptionFull(profile.userId, 'ACTIVE', periodEnd);
        break;
      case 'COMPANY':
        await updateCompanySubscriptionFull(profile.userId, 'ACTIVE', periodEnd);
        break;
    }

    // Create payment record for renewal
    const paymentType = getPaymentTypeFromProfile(type);
    await createPaymentRecord({
      userId: profile.userId,
      stripeSessionId: invoice.id, // Use invoice ID as session ID for renewals
      paymentType,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      description: `Renewal - ${paymentType.replace('_', ' ').toLowerCase()}`,
      periodStart,
      periodEnd,
    });

    // Mark as completed immediately
    await completePayment(invoice.id, {
      stripePaymentIntent: invoiceData.payment_intent as string | undefined,
      stripeCustomerId: invoice.customer as string,
      stripeInvoiceId: invoice.id,
    });

    // Send renewal confirmation email
    if (profile.user.email) {
      await sendPaymentConfirmationEmail({
        email: profile.user.email,
        paymentType,
        amount: invoice.amount_paid,
        currency: invoice.currency.toUpperCase(),
        periodEnd,
      });
    }

    return { success: true, message: 'Renewal payment processed' };
  } catch (error) {
    console.error('Error handling invoice paid:', error);
    return { success: false, error: 'Failed to process renewal' };
  }
}

// Handle invoice.payment_failed
export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<WebhookResult> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invoiceData = invoice as any;
  const subscriptionId = invoiceData.subscription as string;
  if (!subscriptionId) {
    return { success: true, message: 'No subscription on invoice' };
  }

  try {
    const profileResult = await findProfileBySubscriptionId(subscriptionId);

    if (!profileResult) {
      return { success: true, message: 'No profile found for subscription' };
    }

    const { type, profile } = profileResult;

    // Update subscription status to PAST_DUE
    switch (type) {
      case 'TALENT':
        await updateTalentSubscription(profile.userId, 'PAST_DUE', null);
        break;
      case 'PROFESSIONAL':
        await updateProfessionalSubscriptionFull(profile.userId, 'PAST_DUE', null);
        break;
      case 'COMPANY':
        await updateCompanySubscriptionFull(profile.userId, 'PAST_DUE', null);
        break;
    }

    // TODO: Send payment failed email notification

    return { success: true, message: 'Marked subscription as past due' };
  } catch (error) {
    console.error('Error handling invoice payment failure:', error);
    return { success: false, error: 'Failed to update subscription status' };
  }
}

// Handle checkout.session.expired
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

// Helper: Update user subscription with stripe subscription ID
async function updateUserSubscriptionWithId(
  userId: string,
  paymentType: PaymentType,
  status: SubscriptionStatus,
  periodEnd: Date | null,
  stripeSubscriptionId: string
) {
  switch (paymentType) {
    case 'TALENT_MEMBERSHIP':
      await updateTalentSubscription(userId, status, periodEnd, stripeSubscriptionId);
      break;
    case 'PROFESSIONAL_ACCESS':
      await updateProfessionalSubscriptionFull(userId, status, periodEnd, stripeSubscriptionId);
      break;
    case 'COMPANY_ACCESS':
      await updateCompanySubscriptionFull(userId, status, periodEnd, stripeSubscriptionId);
      break;
  }
}

// Helper: Get payment type from profile type
function getPaymentTypeFromProfile(
  profileType: 'TALENT' | 'PROFESSIONAL' | 'COMPANY'
): PaymentType {
  const mapping: Record<string, PaymentType> = {
    TALENT: 'TALENT_MEMBERSHIP',
    PROFESSIONAL: 'PROFESSIONAL_ACCESS',
    COMPANY: 'COMPANY_ACCESS',
  };
  return mapping[profileType];
}

// Construct webhook event with signature verification
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  if (!isStripeConfigured()) {
    throw new Error('Stripe is not configured');
  }
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
