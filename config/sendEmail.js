// config/sendEmail.js
import { sendEmail } from "./emailService.js";

const sendEmailFun = async ({ to, subject, text, html }) => {
  const result = await sendEmail(to, subject, text, html);
  if (result.success) {
    console.log("✅ Email sent successfully");
  } else {
    console.error("❌ Failed to send email:", result.error);
  }
  return result;
};

export default sendEmailFun;
