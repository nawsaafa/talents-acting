import { getAppUrl } from '../send';

interface CollectionSharedEmailProps {
  sharerName: string;
  collectionName: string;
  actionLink: string;
}

export function getCollectionSharedEmailHtml({
  sharerName,
  collectionName,
  actionLink,
}: CollectionSharedEmailProps): string {
  const appUrl = getAppUrl();
  const fullActionLink = actionLink.startsWith('http') ? actionLink : `${appUrl}${actionLink}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Collection Shared - Talents Acting</title>
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
              <h2 style="margin: 0 0 20px; color: #18181b; font-size: 20px; font-weight: 600;">A collection has been shared with you</h2>

              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                <strong>${sharerName}</strong> shared a talent collection with you on Talents Acting.
              </p>

              <!-- Collection Info Box -->
              <div style="margin: 0 0 30px; padding: 20px; background-color: #f4f4f5; border-radius: 8px; text-align: center;">
                <div style="margin: 0 0 8px;">
                  <span style="display: inline-block; padding: 4px 12px; background-color: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 500; border-radius: 4px; text-transform: uppercase;">
                    Collection
                  </span>
                </div>
                <p style="margin: 0; color: #18181b; font-size: 18px; font-weight: 600;">
                  ${collectionName}
                </p>
              </div>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${fullActionLink}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      View Collection
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #a1a1aa; font-size: 14px; line-height: 1.6;">
                Collections are curated lists of talents selected for specific projects or purposes.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f4f4f5; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 10px; color: #71717a; font-size: 12px; text-align: center;">
                You're receiving this email because you have an account on Talents Acting.
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

export function getCollectionSharedEmailText({
  sharerName,
  collectionName,
  actionLink,
}: CollectionSharedEmailProps): string {
  const appUrl = getAppUrl();
  const fullActionLink = actionLink.startsWith('http') ? actionLink : `${appUrl}${actionLink}`;

  return `
A collection has been shared with you on Talents Acting

${sharerName} shared the following collection with you:

Collection: ${collectionName}

View the collection:
${fullActionLink}

Collections are curated lists of talents selected for specific projects or purposes.

---
You're receiving this email because you have an account on Talents Acting.
Manage your notification preferences: ${appUrl}/settings/notifications

Talents Acting by Acting Institute Morocco
  `.trim();
}
