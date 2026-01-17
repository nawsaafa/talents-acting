import { sendEmail } from '@/lib/email/send';
import {
  getPaymentConfirmationEmailHtml,
  getPaymentConfirmationEmailText,
} from '@/lib/email/templates/payment-confirmation';
import {
  getSubscriptionRenewedEmailHtml,
  getSubscriptionRenewedEmailText,
} from '@/lib/email/templates/subscription-renewed';
import {
  getPaymentFailedEmailHtml,
  getPaymentFailedEmailText,
} from '@/lib/email/templates/payment-failed';
import { PaymentType } from '@prisma/client';

interface SendPaymentConfirmationParams {
  email: string;
  paymentType: PaymentType;
  amount: number;
  currency: string;
  periodEnd: Date | null;
}

export async function sendPaymentConfirmationEmail({
  email,
  paymentType,
  amount,
  currency,
  periodEnd,
}: SendPaymentConfirmationParams) {
  const html = getPaymentConfirmationEmailHtml({
    paymentType,
    amount,
    currency,
    periodEnd,
  });

  const text = getPaymentConfirmationEmailText({
    paymentType,
    amount,
    currency,
    periodEnd,
  });

  return sendEmail({
    to: email,
    subject: 'Payment Confirmed - Talents Acting',
    html,
    text,
  });
}

interface SendSubscriptionRenewedParams {
  email: string;
  paymentType: PaymentType;
  amount: number;
  currency: string;
  periodEnd: Date;
}

export async function sendSubscriptionRenewedEmail({
  email,
  paymentType,
  amount,
  currency,
  periodEnd,
}: SendSubscriptionRenewedParams) {
  const html = getSubscriptionRenewedEmailHtml({
    paymentType,
    amount,
    currency,
    periodEnd,
  });

  const text = getSubscriptionRenewedEmailText({
    paymentType,
    amount,
    currency,
    periodEnd,
  });

  return sendEmail({
    to: email,
    subject: 'Subscription Renewed - Talents Acting',
    html,
    text,
  });
}

interface SendPaymentFailedParams {
  email: string;
  paymentType: PaymentType;
  amount: number;
  currency: string;
}

export async function sendPaymentFailedEmail({
  email,
  paymentType,
  amount,
  currency,
}: SendPaymentFailedParams) {
  const html = getPaymentFailedEmailHtml({
    paymentType,
    amount,
    currency,
  });

  const text = getPaymentFailedEmailText({
    paymentType,
    amount,
    currency,
  });

  return sendEmail({
    to: email,
    subject: 'Payment Failed - Action Required - Talents Acting',
    html,
    text,
  });
}
