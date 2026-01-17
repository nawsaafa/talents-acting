import { PaymentType } from '@prisma/client';
import { stripe } from './stripe';
import { PRICING, CURRENCY } from './config';

// Stripe Price IDs - set in environment or create programmatically
// These should be created in Stripe Dashboard for production
export const STRIPE_PRICE_IDS = {
  TALENT_MEMBERSHIP: process.env.STRIPE_PRICE_TALENT_MEMBERSHIP,
  PROFESSIONAL_ACCESS: process.env.STRIPE_PRICE_PROFESSIONAL_ACCESS,
  COMPANY_ACCESS: process.env.STRIPE_PRICE_COMPANY_ACCESS,
} as const;

// Product metadata for creating products in Stripe
const PRODUCT_METADATA = {
  TALENT_MEMBERSHIP: {
    name: 'Talent Membership',
    description: 'Annual membership for talents to be listed in the database',
  },
  PROFESSIONAL_ACCESS: {
    name: 'Professional Database Access',
    description: 'Annual access to the talent database for film professionals',
  },
  COMPANY_ACCESS: {
    name: 'Company Database Access',
    description: 'Annual access to the talent database for production companies',
  },
} as const;

export interface StripeProduct {
  productId: string;
  priceId: string;
}

// Get or create a Stripe product and price for a payment type
export async function getOrCreateStripePrice(paymentType: PaymentType): Promise<StripeProduct> {
  // Check if we have an existing price ID in environment
  const existingPriceId = STRIPE_PRICE_IDS[paymentType];
  if (existingPriceId) {
    const price = await stripe.prices.retrieve(existingPriceId);
    return {
      productId: price.product as string,
      priceId: price.id,
    };
  }

  // Create product and price programmatically
  const pricing = PRICING[paymentType];
  const metadata = PRODUCT_METADATA[paymentType];

  // Search for existing product by metadata
  const existingProducts = await stripe.products.search({
    query: `metadata['payment_type']:'${paymentType}'`,
  });

  let productId: string;

  if (existingProducts.data.length > 0) {
    productId = existingProducts.data[0].id;
  } else {
    // Create new product
    const product = await stripe.products.create({
      name: metadata.name,
      description: metadata.description,
      metadata: {
        payment_type: paymentType,
      },
    });
    productId = product.id;
  }

  // Search for existing price
  const existingPrices = await stripe.prices.list({
    product: productId,
    active: true,
    type: 'recurring',
  });

  if (existingPrices.data.length > 0) {
    return {
      productId,
      priceId: existingPrices.data[0].id,
    };
  }

  // Create new recurring price (annual subscription)
  const price = await stripe.prices.create({
    product: productId,
    unit_amount: pricing.amount,
    currency: CURRENCY.code,
    recurring: {
      interval: 'year',
      interval_count: 1,
    },
    metadata: {
      payment_type: paymentType,
    },
  });

  return {
    productId,
    priceId: price.id,
  };
}

// Get price ID for a payment type (throws if not found)
export async function getPriceId(paymentType: PaymentType): Promise<string> {
  const { priceId } = await getOrCreateStripePrice(paymentType);
  return priceId;
}

// Validate that all required prices exist
export async function validateStripePrices(): Promise<{
  valid: boolean;
  missing: PaymentType[];
}> {
  const missing: PaymentType[] = [];

  for (const paymentType of Object.keys(PRICING) as PaymentType[]) {
    const priceId = STRIPE_PRICE_IDS[paymentType];
    if (!priceId) {
      missing.push(paymentType);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}
