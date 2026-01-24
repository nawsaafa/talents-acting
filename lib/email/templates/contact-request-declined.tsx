import { getAppUrl } from '../send';

interface ContactRequestDeclinedEmailProps {
  talentName: string;
  projectType: string;
  projectName: string | null;
  declineReason: string | null;
}

export function getContactRequestDeclinedEmailHtml({
  talentName,
  projectType,
  projectName,
  declineReason,
}: ContactRequestDeclinedEmailProps): string {
  const appUrl = getAppUrl();
  const projectDisplay = projectName ? `${projectType}: ${projectName}` : projectType;

  const reasonSection = declineReason
    ? `
              <!-- Reason Box -->
              <div style="margin: 0 0 30px; padding: 16px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
                <p style="margin: 0 0 8px; color: #71717a; font-size: 12px; font-weight: 600; text-transform: uppercase;">Reason</p>
                <p style="margin: 0; color: #52525b; font-size: 14px; line-height: 1.6;">
                  "${declineReason}"
                </p>
              </div>
    `
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Request Update - Talents Acting</title>
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
              <h2 style="margin: 0 0 20px; color: #18181b; font-size: 20px; font-weight: 600;">Contact Request Update</h2>

              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Unfortunately, <strong>${talentName}</strong> has declined your contact request at this time.
              </p>

              <!-- Project Details Box -->
              <div style="margin: 0 0 20px; padding: 16px; background-color: #f4f4f5; border-radius: 8px;">
                <p style="margin: 0 0 8px; color: #71717a; font-size: 12px; font-weight: 600; text-transform: uppercase;">Project</p>
                <p style="margin: 0; color: #18181b; font-size: 16px; font-weight: 500;">${projectDisplay}</p>
              </div>

              ${reasonSection}

              <p style="margin: 0 0 30px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Don't be discouraged! Talents receive many requests and may have scheduling conflicts or other commitments. We encourage you to explore other talented professionals on our platform.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${appUrl}/talents" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      Browse Talents
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f4f4f5; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 10px; color: #71717a; font-size: 12px; text-align: center;">
                You're receiving this email because you submitted a contact request on Talents Acting.
              </p>
              <p style="margin: 0; color: #71717a; font-size: 12px; text-align: center;">
                &copy; ${new Date().getFullYear()} Talents Acting by Acting Institute Morocco.<br>
                <a href="${appUrl}/settings/notifications" style="color: #2563eb; text-decoration: none;">Manage notification preferences</a>
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

export function getContactRequestDeclinedEmailText({
  talentName,
  projectType,
  projectName,
  declineReason,
}: ContactRequestDeclinedEmailProps): string {
  const appUrl = getAppUrl();
  const projectDisplay = projectName ? `${projectType}: ${projectName}` : projectType;

  const reasonText = declineReason ? `\nReason: "${declineReason}"\n` : '';

  return `
Contact Request Update

Unfortunately, ${talentName} has declined your contact request at this time.

Project: ${projectDisplay}
${reasonText}
Don't be discouraged! Talents receive many requests and may have scheduling conflicts or other commitments. We encourage you to explore other talented professionals on our platform.

Browse more talents:
${appUrl}/talents

---
You're receiving this email because you submitted a contact request on Talents Acting.
Manage your notification preferences: ${appUrl}/settings/notifications

Talents Acting by Acting Institute Morocco
  `.trim();
}
