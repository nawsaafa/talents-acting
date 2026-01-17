import { getAppUrl } from '../send';
import { PaymentType } from '@prisma/client';

interface SubscriptionRenewedEmailProps {
  paymentType: PaymentType;
  amount: number;
  currency: string;
  periodEnd: Date;
}

function getPaymentTypeLabel(paymentType: PaymentType): string {
  switch (paymentType) {
    case 'TALENT_MEMBERSHIP':
      return 'Talent Membership';
    case 'PROFESSIONAL_ACCESS':
      return 'Professional Database Access';
    case 'COMPANY_ACCESS':
      return 'Company Database Access';
    default:
      return 'Subscription';
  }
}

function formatAmount(amount: number, currency: string): string {
  const displayAmount = amount / 100;
  return `${displayAmount.toLocaleString('fr-MA')} ${currency.toUpperCase()}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getSubscriptionRenewedEmailHtml({
  paymentType,
  amount,
  currency,
  periodEnd,
}: SubscriptionRenewedEmailProps): string {
  const appUrl = getAppUrl();
  const typeLabel = getPaymentTypeLabel(paymentType);
  const formattedAmount = formatAmount(amount, currency);
  const validUntil = formatDate(periodEnd);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Renewed - Talents Acting</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #e4e4e7;">
              <h1 style="margin: 0; color: #18181b; font-size: 24px; font-weight: 600;">Talents Acting</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 64px; height: 64px; background-color: #dbeafe; border-radius: 50%; line-height: 64px; font-size: 32px;">
                  &#8635;
                </div>
              </div>

              <h2 style="margin: 0 0 20px; color: #18181b; font-size: 20px; font-weight: 600; text-align: center;">Subscription Renewed</h2>

              <p style="margin: 0 0 30px; color: #52525b; font-size: 16px; line-height: 1.6; text-align: center;">
                Your ${typeLabel} has been automatically renewed. Thank you for continuing with Talents Acting!
              </p>

              <!-- Renewal Details -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f5; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Subscription</td>
                        <td style="padding: 8px 0; color: #18181b; font-size: 14px; text-align: right; font-weight: 600;">${typeLabel}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Amount Charged</td>
                        <td style="padding: 8px 0; color: #18181b; font-size: 14px; text-align: right; font-weight: 600;">${formattedAmount}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Next Renewal Date</td>
                        <td style="padding: 8px 0; color: #18181b; font-size: 14px; text-align: right; font-weight: 600;">${validUntil}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${appUrl}/dashboard" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      View Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #a1a1aa; font-size: 14px; line-height: 1.6; text-align: center;">
                You can manage your subscription settings from your account dashboard at any time.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f4f4f5; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; color: #71717a; font-size: 12px; text-align: center;">
                &copy; ${new Date().getFullYear()} Talents Acting by Acting Institute Morocco.<br>
                <a href="${appUrl}" style="color: #2563eb; text-decoration: none;">${appUrl}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getSubscriptionRenewedEmailText({
  paymentType,
  amount,
  currency,
  periodEnd,
}: SubscriptionRenewedEmailProps): string {
  const appUrl = getAppUrl();
  const typeLabel = getPaymentTypeLabel(paymentType);
  const formattedAmount = formatAmount(amount, currency);
  const validUntil = formatDate(periodEnd);

  return `
Subscription Renewed - Talents Acting

Your ${typeLabel} has been automatically renewed. Thank you for continuing with Talents Acting!

Renewal Details:
- Subscription: ${typeLabel}
- Amount Charged: ${formattedAmount}
- Next Renewal Date: ${validUntil}

View your dashboard: ${appUrl}/dashboard

You can manage your subscription settings from your account dashboard at any time.

---
Talents Acting by Acting Institute Morocco
${appUrl}
  `.trim();
}
