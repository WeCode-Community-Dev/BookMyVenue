import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

export const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Qalam Academy " <${process.env.GOOGLE_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    console.log(`Preview URL: %s`, nodemailer.getTestMessageUrl(info));
  } catch (error) {
    
   throw new Error("SMTP_Failure provide a valid email",error.message)
  }
};
