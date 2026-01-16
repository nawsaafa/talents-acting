import { getVerificationUrl, getAppUrl } from '../send';

interface VerificationEmailProps {
  firstName: string;
  verificationToken: string;
}

export function getVerificationEmailHtml({
  firstName,
  verificationToken,
}: VerificationEmailProps): string {
  const verificationUrl = getVerificationUrl(verificationToken);
  const appUrl = getAppUrl();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Talents Acting</title>
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
              <h2 style="margin: 0 0 20px; color: #18181b; font-size: 20px; font-weight: 600;">Welcome, ${firstName}!</h2>

              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Thank you for registering as a professional on Talents Acting. Please verify your email address to continue with your registration.
              </p>

              <p style="margin: 0 0 30px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Click the button below to verify your email:
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 20px; color: #71717a; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>

              <p style="margin: 0 0 20px; padding: 12px; background-color: #f4f4f5; border-radius: 4px; word-break: break-all;">
                <a href="${verificationUrl}" style="color: #2563eb; font-size: 14px; text-decoration: none;">${verificationUrl}</a>
              </p>

              <p style="margin: 30px 0 0; color: #a1a1aa; font-size: 14px; line-height: 1.6;">
                This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.
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

export function getVerificationEmailText({
  firstName,
  verificationToken,
}: VerificationEmailProps): string {
  const verificationUrl = getVerificationUrl(verificationToken);

  return `
Welcome to Talents Acting, ${firstName}!

Thank you for registering as a professional. Please verify your email address to continue with your registration.

Verify your email by clicking this link:
${verificationUrl}

This link will expire in 24 hours.

If you did not create an account, you can safely ignore this email.

---
Talents Acting by Acting Institute Morocco
  `.trim();
}
