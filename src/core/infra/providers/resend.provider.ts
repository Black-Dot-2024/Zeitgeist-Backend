import { Resend } from 'resend';
import { EnvConfigKeys } from '../../../utils/constants';

const resend = new Resend(process.env[EnvConfigKeys.RESEND_API_KEY]);

/**
 * Sends an email using Resend to the specified email addresses.
 * The email contains the subject and body, the body can be in HTML format.
 *
 * @param emailTo [string] - Array of emails to send the message to.
 * @param subject string - Subject of the email.
 * @param body string - Body of the email.
 * @returns data - The data returned from the email provider.
 */
async function sendEmail(emailTo: string[], subject: string, body: string) {
  try {
    const emailsFormatted = emailTo.join(', ');
    const { data, error } = await resend.emails.send({
      from: `Link Bridge <${process.env[EnvConfigKeys.RESEND_EMAIL_FROM]}>`,
      to: emailsFormatted,
      subject,
      html: body,
    });

    if (error) {
      return console.error(error);
    }

    return data;
  } catch (error) {
    console.error({ error });
  }
}

export const EmailProvider = { sendEmail };