import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, text: string) {
  if (!process.env.SENDGRID_API_KEY && !process.env.SMTP_HOST) {
    // dev noop
    // eslint-disable-next-line no-console
    console.log(`[email:dev] to=${to} subject=${subject} text=${text}`);
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  await transporter.sendMail({ from: process.env.EMAIL_FROM || 'no-reply@express.com', to, subject, text });
}
