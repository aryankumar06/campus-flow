import sgMail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailParams) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.log("SendGrid API Key not found, skipping email sending");
    return;
  }

  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL || "noreply@college-events.com", // Verify this sender in SendGrid
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent to", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const subject = "Welcome to College Event Platform";
  const html = `
    <h1>Welcome, ${name}!</h1>
    <p>Thank you for signing up for our College Event Management Platform.</p>
    <p>You can now browse and register for upcoming events.</p>
  `;
  await sendEmail({ to: email, subject, html });
};

export const sendRegistrationEmail = async (
  email: string,
  userName: string,
  eventName: string,
  eventDate: Date,
  venue: string,
  qrCode: string
) => {
  const subject = `Registration Confirmed: ${eventName}`;
  const html = `
    <h1>Registration Confirmed!</h1>
    <p>Hi ${userName},</p>
    <p>You have successfully registered for <strong>${eventName}</strong>.</p>
    <p><strong>Date:</strong> ${eventDate.toLocaleString()}</p>
    <p><strong>Venue:</strong> ${venue}</p>
    <p>Please show the QR code below at the venue:</p>
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCode}" alt="QR Code" />
    <p>Ticket ID: ${qrCode}</p>
  `;
  await sendEmail({ to: email, subject, html });
};
