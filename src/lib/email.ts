import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "PawCare <notifications@pawcare.app>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email send error:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error("Failed to send email:", err);
    throw err;
  }
}

export async function sendAppointmentReminder(
  to: string,
  petName: string,
  appointmentTitle: string,
  appointmentDate: string,
  location?: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
        .badge { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 4px 12px; border-radius: 20px; font-size: 14px; }
        .detail { margin: 12px 0; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #667eea; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0;">🐾 Appointment Reminder</h1>
          <p style="margin:8px 0 0 0; opacity: 0.9;">Don't forget about ${petName}'s upcoming appointment!</p>
        </div>
        <div class="content">
          <div class="detail">
            <strong>📋 Appointment:</strong> ${appointmentTitle}
          </div>
          <div class="detail">
            <strong>🐾 Pet:</strong> ${petName}
          </div>
          <div class="detail">
            <strong>📅 When:</strong> ${appointmentDate}
          </div>
          ${location ? `<div class="detail"><strong>📍 Where:</strong> ${location}</div>` : ""}
          <p style="margin-top: 20px;">Make sure to prepare any documents or records your vet might need.</p>
        </div>
        <div class="footer">
          <p>Sent by PawCare - Your Pet Care Companion</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `🐾 Reminder: ${petName}'s ${appointmentTitle}`,
    html,
  });
}

export async function sendMedicationReminder(
  to: string,
  petName: string,
  medicationName: string,
  dosage: string,
  frequency: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
        .detail { margin: 12px 0; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #f5576c; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0;">💊 Medication Reminder</h1>
          <p style="margin:8px 0 0 0; opacity: 0.9;">Time for ${petName}'s medication!</p>
        </div>
        <div class="content">
          <div class="detail">
            <strong>💊 Medication:</strong> ${medicationName}
          </div>
          <div class="detail">
            <strong>🐾 Pet:</strong> ${petName}
          </div>
          <div class="detail">
            <strong>📏 Dosage:</strong> ${dosage}
          </div>
          <div class="detail">
            <strong>🔄 Frequency:</strong> ${frequency}
          </div>
          <p style="margin-top: 20px;">Remember to administer the medication as prescribed by your veterinarian.</p>
        </div>
        <div class="footer">
          <p>Sent by PawCare - Your Pet Care Companion</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `💊 Medication Reminder: ${medicationName} for ${petName}`,
    html,
  });
}

export async function sendWelcomeEmail(to: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
        .feature { display: flex; align-items: center; margin: 16px 0; padding: 16px; background: white; border-radius: 8px; }
        .feature-icon { font-size: 24px; margin-right: 16px; }
        .cta { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0; font-size: 28px;">🐾 Welcome to PawCare!</h1>
          <p style="margin:12px 0 0 0; opacity: 0.9; font-size: 16px;">Hi ${name}, we're excited to help you care for your furry friends!</p>
        </div>
        <div class="content">
          <h2>Here's what you can do:</h2>
          <div class="feature">
            <span class="feature-icon">📋</span>
            <div>
              <strong>Track Pet Profiles</strong>
              <p style="margin:4px 0 0 0; color: #6b7280;">Keep all your pet's info in one place</p>
            </div>
          </div>
          <div class="feature">
            <span class="feature-icon">📅</span>
            <div>
              <strong>Schedule Appointments</strong>
              <p style="margin:4px 0 0 0; color: #6b7280;">Never miss a vet visit with Google Calendar sync</p>
            </div>
          </div>
          <div class="feature">
            <span class="feature-icon">💊</span>
            <div>
              <strong>Medication Reminders</strong>
              <p style="margin:4px 0 0 0; color: #6b7280;">Stay on top of your pet's medication schedule</p>
            </div>
          </div>
          <div class="feature">
            <span class="feature-icon">📊</span>
            <div>
              <strong>Health Records</strong>
              <p style="margin:4px 0 0 0; color: #6b7280;">Store vaccination records, lab results, and more</p>
            </div>
          </div>
          <p style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta">Get Started →</a>
          </p>
        </div>
        <div class="footer">
          <p>Sent by PawCare - Your Pet Care Companion</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: "🐾 Welcome to PawCare! Let's get started",
    html,
  });
}
