import { Resend } from 'resend';
import { log } from '@/lib/logger';

// Initialize Resend client (only if API key is available)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Email configuration
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@actinginstitute.ma';
const FROM_NAME = process.env.FROM_NAME || 'Talents Acting';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Development mode email logger
function logDevEmail(options: SendEmailOptions): SendEmailResult {
  log.info('=== DEV MODE: Email would be sent ===', {
    to: options.to,
    subject: options.subject,
  });
  console.log('\n--- EMAIL CONTENT ---');
  console.log(`To: ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`HTML:\n${options.html}`);
  console.log('--- END EMAIL ---\n');

  return {
    success: true,
    messageId: `dev-${Date.now()}`,
  };
}

// Send email using Resend or log in development
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  // In development without API key, just log
  if (!resend) {
    log.warn('RESEND_API_KEY not set - logging email to console');
    return logDevEmail(options);
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      log.error('Failed to send email', new Error(error.message), {
        to: options.to,
        subject: options.subject,
      });
      return {
        success: false,
        error: error.message,
      };
    }

    log.info('Email sent successfully', {
      to: options.to,
      subject: options.subject,
      messageId: data?.id,
    });

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error('Email sending failed', error instanceof Error ? error : new Error(errorMessage), {
      to: options.to,
      subject: options.subject,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Helper to generate verification URL
export function getVerificationUrl(token: string): string {
  return `${APP_URL}/verify-email?token=${token}`;
}

// Helper to get app URL
export function getAppUrl(): string {
  return APP_URL;
}
