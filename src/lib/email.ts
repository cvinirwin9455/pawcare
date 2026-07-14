import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Paw Tender Care <reminders@pawtendercare.com>",
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Failed to send email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}

export function buildMedicationReminderEmail(params: {
  petName: string;
  medicationName: string;
  dosage: string;
  instructions?: string;
  time: string;
}) {
  return {
    subject: `Paw Tender Care Reminder: ${params.medicationName} for ${params.petName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #7c3aed; margin: 0; font-size: 24px;">Paw Tender Care</h1>
            <p style="color: #6b7280; margin: 4px 0 0;">Medication Reminder</p>
          </div>
          
          <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 12px; color: #1f2937; font-size: 18px;">
              Time to give ${params.petName} their medication
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Medication:</td>
                <td style="padding: 8px 0; color: #1f2937;">${params.medicationName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Dosage:</td>
                <td style="padding: 8px 0; color: #1f2937;">${params.dosage}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Scheduled:</td>
                <td style="padding: 8px 0; color: #1f2937;">${params.time}</td>
              </tr>
              ${params.instructions ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Instructions:</td>
                <td style="padding: 8px 0; color: #1f2937;">${params.instructions}</td>
              </tr>
              ` : ""}
            </table>
          </div>
          
          <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 24px 0 0;">
            You received this email because you have medication reminders enabled in Paw Tender Care.
          </p>
        </div>
      </body>
      </html>
    `,
  };
}

export function buildAppointmentReminderEmail(params: {
  petName: string;
  appointmentTitle: string;
  type: string;
  dateTime: string;
  providerName?: string;
  providerAddress?: string;
  notes?: string;
}) {
  return {
    subject: `Paw Tender Care Reminder: ${params.appointmentTitle} for ${params.petName} tomorrow`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #7c3aed; margin: 0; font-size: 24px;">Paw Tender Care</h1>
            <p style="color: #6b7280; margin: 4px 0 0;">Appointment Reminder</p>
          </div>
          
          <div style="background: #ede9fe; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 12px; color: #5b21b6; font-size: 18px;">
              Upcoming appointment for ${params.petName}
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Appointment:</td>
                <td style="padding: 8px 0; color: #1f2937;">${params.appointmentTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Type:</td>
                <td style="padding: 8px 0; color: #1f2937;">${params.type}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">When:</td>
                <td style="padding: 8px 0; color: #1f2937;">${params.dateTime}</td>
              </tr>
              ${params.providerName ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Provider:</td>
                <td style="padding: 8px 0; color: #1f2937;">${params.providerName}</td>
              </tr>
              ` : ""}
              ${params.providerAddress ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Address:</td>
                <td style="padding: 8px 0; color: #1f2937;">${params.providerAddress}</td>
              </tr>
              ` : ""}
              ${params.notes ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Notes:</td>
                <td style="padding: 8px 0; color: #1f2937;">${params.notes}</td>
              </tr>
              ` : ""}
            </table>
          </div>
          
          <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 24px 0 0;">
            You received this email because you have appointment reminders enabled in Paw Tender Care.
          </p>
        </div>
      </body>
      </html>
    `,
  };
}
