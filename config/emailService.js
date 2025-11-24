// config/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,
  port: Number(process.env.BREVO_PORT),
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.BREVO_FROM,
      to,
      subject,
      html,
    });

    console.log("📨 Email sent via Brevo:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Email send error:", error);
    return { success: false, error };
  }
}
