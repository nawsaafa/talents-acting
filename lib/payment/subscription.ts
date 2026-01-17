import Stripe from 'stripe';
import { stripe } from './stripe';
import { prisma } from '@/lib/prisma';
import { SubscriptionStatus, PaymentType } from '@prisma/client';

// Get or create a Stripe customer for a user
export async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  // Check if user already has a Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });

  // Save customer ID to user
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

// Get Stripe customer by user ID
export async function getStripeCustomerId(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  return user?.stripeCustomerId || null;
}

// Get subscription from Stripe
export async function getStripeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch {
    return null;
  }
}

// Map Stripe subscription status to our SubscriptionStatus enum
export function mapStripeStatus(stripeStatus: Stripe.Subscription.Status): SubscriptionStatus {
  const statusMap: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
    active: 'ACTIVE',
    trialing: 'TRIAL',
    past_due: 'PAST_DUE',
    canceled: 'CANCELLED',
    unpaid: 'PAST_DUE',
    incomplete: 'NONE',
    incomplete_expired: 'EXPIRED',
    paused: 'CANCELLED',
  };

  return statusMap[stripeStatus] || 'NONE';
}

// Get subscription status for a user from Stripe
export async function getSubscriptionStatusFromStripe(
  subscriptionId: string
): Promise<{ status: SubscriptionStatus; currentPeriodEnd: Date | null }> {
  const subscription = await getStripeSubscription(subscriptionId);

  if (!subscription) {
    return { status: 'NONE', currentPeriodEnd: null };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subData = subscription as any;
  return {
    status: mapStripeStatus(subscription.status),
    currentPeriodEnd: new Date(subData.current_period_end * 1000),
  };
}

// Cancel a subscription at period end
export async function cancelSubscriptionAtPeriodEnd(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

// Cancel a subscription immediately
export async function cancelSubscriptionImmediately(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.cancel(subscriptionId);
}

// Reactivate a cancelled subscription (if still within period)
export async function reactivateSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

// Get upcoming invoice for a subscription
export async function getUpcomingInvoice(
  customerId: string
): Promise<Stripe.UpcomingInvoice | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invoices = stripe.invoices as any;
    return await invoices.retrieveUpcoming({
      customer: customerId,
    });
  } catch {
    return null;
  }
}

// List invoices for a customer
export async function listCustomerInvoices(
  customerId: string,
  limit: number = 10
): Promise<Stripe.Invoice[]> {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit,
  });

  return invoices.data;
}

// Get payment type from subscription metadata
export function getPaymentTypeFromMetadata(metadata: Stripe.Metadata | null): PaymentType | null {
  if (!metadata?.payment_type) {
    return null;
  }

  const validTypes: PaymentType[] = ['TALENT_MEMBERSHIP', 'PROFESSIONAL_ACCESS', 'COMPANY_ACCESS'];

  if (validTypes.includes(metadata.payment_type as PaymentType)) {
    return metadata.payment_type as PaymentType;
  }

  return null;
}

// Check if subscription is in grace period (past_due but not cancelled)
export function isInGracePeriod(status: SubscriptionStatus): boolean {
  return status === 'PAST_DUE';
}

// Check if subscription allows access
export function hasActiveAccess(status: SubscriptionStatus): boolean {
  return status === 'ACTIVE' || status === 'TRIAL' || status === 'PAST_DUE';
}

// Format subscription end date for display
export function formatSubscriptionEndDate(date: Date | null): string {
  if (!date) {
    return 'N/A';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Calculate days until subscription ends
export function daysUntilExpiration(endDate: Date | null): number | null {
  if (!endDate) {
    return null;
  }

  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

// Check if subscription is expiring soon (within 30 days)
export function isExpiringSoon(endDate: Date | null, days: number = 30): boolean {
  const daysLeft = daysUntilExpiration(endDate);
  return daysLeft !== null && daysLeft > 0 && daysLeft <= days;
}
