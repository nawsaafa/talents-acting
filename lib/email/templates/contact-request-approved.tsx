import { getAppUrl } from '../send';

interface ContactRequestApprovedEmailProps {
  talentName: string;
  projectType: string;
  projectName: string | null;
  actionLink: string;
}

export function getContactRequestApprovedEmailHtml({
  talentName,
  projectType,
  projectName,
  actionLink,
}: ContactRequestApprovedEmailProps): string {
  const appUrl = getAppUrl();
  const fullActionLink = actionLink.startsWith('http') ? actionLink : `${appUrl}${actionLink}`;
  const projectDisplay = projectName ? `${projectType}: ${projectName}` : projectType;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Request Approved - Talents Acting</title>
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
              <!-- Success Icon -->
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: inline-block; width: 60px; height: 60px; background-color: #dcfce7; border-radius: 50%; line-height: 60px; font-size: 28px;">
                  &#10003;
                </div>
              </div>

              <h2 style="margin: 0 0 20px; color: #18181b; font-size: 20px; font-weight: 600; text-align: center;">Contact Request Approved!</h2>

              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6; text-align: center;">
                Great news! <strong>${talentName}</strong> has approved your contact request.
              </p>

              <!-- Project Details Box -->
              <div style="margin: 0 0 30px; padding: 16px; background-color: #f4f4f5; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 8px; color: #71717a; font-size: 12px; font-weight: 600; text-transform: uppercase;">Project</p>
                <p style="margin: 0; color: #18181b; font-size: 16px; font-weight: 500;">${projectDisplay}</p>
              </div>

              <p style="margin: 0 0 30px; color: #52525b; font-size: 16px; line-height: 1.6; text-align: center;">
                You can now view their contact information and reach out to discuss your project.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${fullActionLink}" style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      View Contact Info
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #a1a1aa; font-size: 14px; line-height: 1.6; text-align: center;">
                Please be professional and respectful when contacting the talent.
              </p>
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

export function getContactRequestApprovedEmailText({
  talentName,
  projectType,
  projectName,
  actionLink,
}: ContactRequestApprovedEmailProps): string {
  const appUrl = getAppUrl();
  const fullActionLink = actionLink.startsWith('http') ? actionLink : `${appUrl}${actionLink}`;
  const projectDisplay = projectName ? `${projectType}: ${projectName}` : projectType;

  return `
Contact Request Approved!

Great news! ${talentName} has approved your contact request.

Project: ${projectDisplay}

You can now view their contact information and reach out to discuss your project.

View contact information:
${fullActionLink}

Please be professional and respectful when contacting the talent.

---
You're receiving this email because you submitted a contact request on Talents Acting.
Manage your notification preferences: ${appUrl}/settings/notifications

Talents Acting by Acting Institute Morocco
  `.trim();
}
