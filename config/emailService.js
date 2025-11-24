import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Gmail STARTTLS port
  secure: false, // 🔥 quan trọng: phải false với port 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // 🔥 tránh lỗi SSL trên Render
  },
});

// Kiểm tra SMTP kết nối
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
      text,
      html,
    });

    console.log("📨 Gmail sent email to:", to);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending Gmail email:", error.message);
    return { success: false, error: error.message };
  }
}
