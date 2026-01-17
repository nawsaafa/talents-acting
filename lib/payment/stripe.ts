import Stripe from 'stripe';
import { log } from '@/lib/logger';

// Check if Stripe is configured
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_CONFIGURED = Boolean(STRIPE_SECRET_KEY);

// Initialize Stripe client only if API key is available
export const stripe: Stripe | null = STRIPE_CONFIGURED
  ? new Stripe(STRIPE_SECRET_KEY!, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  : null;

// Check if Stripe is available
export function isStripeConfigured(): boolean {
  return STRIPE_CONFIGURED;
}

// Get Stripe client with error if not configured
export function getStripe(): Stripe {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }
  return stripe;
}

// Log warning if Stripe is not configured (call at startup)
if (!STRIPE_CONFIGURED) {
  log.warn('STRIPE_SECRET_KEY not set - payment features will be disabled');
}

export function getStripePublishableKey(): string | null {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    log.warn('STRIPE_PUBLISHABLE_KEY not set - checkout will be disabled');
    return null;
  }
  return key;
}
