import { PaymentType } from '@prisma/client';

// Currency configuration
export const CURRENCY = {
  code: 'mad',
  symbol: 'MAD',
  name: 'Moroccan Dirham',
} as const;

// Pricing in smallest currency unit (centimes for MAD)
// 1 MAD = 100 centimes
export const PRICING = {
  TALENT_MEMBERSHIP: {
    amount: 30000, // 300 MAD in centimes
    displayAmount: 300,
    description: 'Annual Talent Membership',
    periodMonths: 12,
  },
  PROFESSIONAL_ACCESS: {
    amount: 150000, // 1500 MAD in centimes
    displayAmount: 1500,
    description: 'Annual Professional Database Access',
    periodMonths: 12,
  },
  COMPANY_ACCESS: {
    amount: 350000, // 3500 MAD in centimes
    displayAmount: 3500,
    description: 'Annual Company Database Access',
    periodMonths: 12,
  },
} as const;

export type PricingKey = keyof typeof PRICING;

export function getPricing(paymentType: PaymentType) {
  return PRICING[paymentType];
}

export function getPaymentTypeForRole(role: 'TALENT' | 'PROFESSIONAL' | 'COMPANY'): PaymentType {
  const mapping: Record<string, PaymentType> = {
    TALENT: 'TALENT_MEMBERSHIP',
    PROFESSIONAL: 'PROFESSIONAL_ACCESS',
    COMPANY: 'COMPANY_ACCESS',
  };
  return mapping[role];
}

export function formatPrice(amountInCentimes: number): string {
  const amount = amountInCentimes / 100;
  return `${amount.toLocaleString('fr-MA')} ${CURRENCY.symbol}`;
}

export function calculatePeriodEnd(periodMonths: number): Date {
  const now = new Date();
  return new Date(now.setMonth(now.getMonth() + periodMonths));
}

export function isValidPaymentType(type: string): type is PaymentType {
  return Object.keys(PRICING).includes(type);
}
