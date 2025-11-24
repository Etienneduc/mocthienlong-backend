import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // đổi 465 -> 587
  secure: false, // phải là false khi dùng 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
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
