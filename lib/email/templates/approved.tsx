import { getAppUrl } from '../send';

interface ApprovedEmailProps {
  firstName: string;
}

export function getApprovedEmailHtml({ firstName }: ApprovedEmailProps): string {
  const appUrl = getAppUrl();
  const loginUrl = `${appUrl}/login`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Approved - Talents Acting</title>
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
              <!-- Success Badge -->
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="display: inline-block; padding: 8px 16px; background-color: #dcfce7; color: #166534; font-size: 14px; font-weight: 600; border-radius: 20px;">
                  Account Approved
                </span>
              </div>

              <h2 style="margin: 0 0 20px; color: #18181b; font-size: 20px; font-weight: 600; text-align: center;">
                Congratulations, ${firstName}!
              </h2>

              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Your professional account has been approved. You now have full access to the Talents Acting database.
              </p>

              <p style="margin: 0 0 30px; color: #52525b; font-size: 16px; line-height: 1.6;">
                With your account, you can:
              </p>

              <ul style="margin: 0 0 30px; padding-left: 20px; color: #52525b; font-size: 16px; line-height: 1.8;">
                <li>Browse detailed talent profiles</li>
                <li>Access contact information</li>
                <li>View showreels and portfolios</li>
                <li>Use advanced search filters</li>
              </ul>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      Start Browsing Talents
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #71717a; font-size: 14px; line-height: 1.6; text-align: center;">
                If you have any questions, please contact our support team.
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

export function getApprovedEmailText({ firstName }: ApprovedEmailProps): string {
  const appUrl = getAppUrl();
  const loginUrl = `${appUrl}/login`;

  return `
Congratulations, ${firstName}!

Your professional account on Talents Acting has been approved.

You now have full access to the talent database. With your account, you can:
- Browse detailed talent profiles
- Access contact information
- View showreels and portfolios
- Use advanced search filters

Log in to start browsing talents:
${loginUrl}

If you have any questions, please contact our support team.

---
Talents Acting by Acting Institute Morocco
  `.trim();
}
