// config/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Email connection failed:", error.message);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

export async function sendEmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: `"Mộc Thiên Long" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("📨 Email sent successfully to:", to);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    return { success: false, error: error.message };
  }
}
