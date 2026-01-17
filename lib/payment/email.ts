import { sendEmail } from '@/lib/email/send';
import {
  getPaymentConfirmationEmailHtml,
  getPaymentConfirmationEmailText,
} from '@/lib/email/templates/payment-confirmation';
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
