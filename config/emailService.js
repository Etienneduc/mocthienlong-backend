import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Gmail bắt buộc SSL
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  timeout: 20000, // 20s chống timeout trên Render
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email connection failed:", error.message);
  } else {
    console.log("✅ Gmail SMTP is ready!");
  }
});

export async function sendEmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: `"Mộc Thiên Long" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📨 Gmail sent email to:", to);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending Gmail email:", error.message);
    return { success: false, error: error.message };
  }
}
