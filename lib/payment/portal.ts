'use server';

import { stripe } from './stripe';
import { auth } from '@/lib/auth/auth';
import { getStripeCustomerId } from './subscription';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface PortalSessionResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Create a Stripe Customer Portal session
export async function createPortalSession(returnUrl?: string): Promise<PortalSessionResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: 'You must be logged in' };
    }

    const customerId = await getStripeCustomerId(session.user.id);

    if (!customerId) {
      return { success: false, error: 'No billing account found' };
    }

    // Determine return URL based on user role
    const defaultReturnUrl =
      session.user.role === 'TALENT'
        ? `${APP_URL}/dashboard/talent/billing`
        : session.user.role === 'COMPANY'
          ? `${APP_URL}/dashboard/company/billing`
          : `${APP_URL}/dashboard/professional/billing`;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || defaultReturnUrl,
    });

    return { success: true, url: portalSession.url };
  } catch (error) {
    console.error('Error creating portal session:', error);
    return { success: false, error: 'Failed to create billing portal session' };
  }
}
