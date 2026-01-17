import { getAppUrl } from '../send';
import { PaymentType } from '@prisma/client';

interface PaymentFailedEmailProps {
  paymentType: PaymentType;
  amount: number;
  currency: string;
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

export function getPaymentFailedEmailHtml({
  paymentType,
  amount,
  currency,
}: PaymentFailedEmailProps): string {
  const appUrl = getAppUrl();
  const typeLabel = getPaymentTypeLabel(paymentType);
  const formattedAmount = formatAmount(amount, currency);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Failed - Talents Acting</title>
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
                <div style="display: inline-block; width: 64px; height: 64px; background-color: #fee2e2; border-radius: 50%; line-height: 64px; font-size: 32px;">
                  &#9888;
                </div>
              </div>

              <h2 style="margin: 0 0 20px; color: #18181b; font-size: 20px; font-weight: 600; text-align: center;">Payment Failed</h2>

              <p style="margin: 0 0 30px; color: #52525b; font-size: 16px; line-height: 1.6; text-align: center;">
                We were unable to process your payment for your ${typeLabel}. Please update your payment method to continue your subscription.
              </p>

              <!-- Payment Details -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef2f2; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Subscription</td>
                        <td style="padding: 8px 0; color: #18181b; font-size: 14px; text-align: right; font-weight: 600;">${typeLabel}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Amount Due</td>
                        <td style="padding: 8px 0; color: #dc2626; font-size: 14px; text-align: right; font-weight: 600;">${formattedAmount}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Status</td>
                        <td style="padding: 8px 0; color: #dc2626; font-size: 14px; text-align: right; font-weight: 600;">Past Due</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px; color: #52525b; font-size: 14px; line-height: 1.6; text-align: center;">
                <strong>Important:</strong> Your access may be limited until payment is resolved. Please update your payment method as soon as possible to avoid service interruption.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${appUrl}/dashboard" style="display: inline-block; padding: 14px 32px; background-color: #dc2626; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      Update Payment Method
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #a1a1aa; font-size: 14px; line-height: 1.6; text-align: center;">
                If you believe this is an error or need assistance, please contact our support team.
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

export function getPaymentFailedEmailText({
  paymentType,
  amount,
  currency,
}: PaymentFailedEmailProps): string {
  const appUrl = getAppUrl();
  const typeLabel = getPaymentTypeLabel(paymentType);
  const formattedAmount = formatAmount(amount, currency);

  return `
Payment Failed - Talents Acting

We were unable to process your payment for your ${typeLabel}. Please update your payment method to continue your subscription.

Payment Details:
- Subscription: ${typeLabel}
- Amount Due: ${formattedAmount}
- Status: Past Due

IMPORTANT: Your access may be limited until payment is resolved. Please update your payment method as soon as possible to avoid service interruption.

Update your payment method: ${appUrl}/dashboard

If you believe this is an error or need assistance, please contact our support team.

---
Talents Acting by Acting Institute Morocco
${appUrl}
  `.trim();
}
