import { getAppUrl } from '../send';

interface RejectedEmailProps {
  firstName: string;
  reason: string;
}

export function getRejectedEmailHtml({ firstName, reason }: RejectedEmailProps): string {
  const appUrl = getAppUrl();
  const contactUrl = `${appUrl}/contact`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Update - Talents Acting</title>
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
              <h2 style="margin: 0 0 20px; color: #18181b; font-size: 20px; font-weight: 600;">
                Hello ${firstName},
              </h2>

              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                We have reviewed your professional registration request for Talents Acting. Unfortunately, we are unable to approve your account at this time.
              </p>

              <!-- Reason Box -->
              <div style="margin: 0 0 30px; padding: 20px; background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 4px;">
                <p style="margin: 0 0 8px; color: #991b1b; font-size: 14px; font-weight: 600;">
                  Reason:
                </p>
                <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.6;">
                  ${reason}
                </p>
              </div>

              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                If you believe this decision was made in error, or if you would like to provide additional information, please contact our support team.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${contactUrl}" style="display: inline-block; padding: 14px 32px; background-color: #52525b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      Contact Support
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                We appreciate your interest in Talents Acting and hope to work with you in the future.
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

export function getRejectedEmailText({ firstName, reason }: RejectedEmailProps): string {
  const appUrl = getAppUrl();

  return `
Hello ${firstName},

We have reviewed your professional registration request for Talents Acting. Unfortunately, we are unable to approve your account at this time.

Reason:
${reason}

If you believe this decision was made in error, or if you would like to provide additional information, please contact our support team.

We appreciate your interest in Talents Acting and hope to work with you in the future.

---
Talents Acting by Acting Institute Morocco
${appUrl}
  `.trim();
}
