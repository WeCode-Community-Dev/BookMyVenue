import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (
  to,
  otp,
  purpose = "verification"
) => {
  try {
    const subject =
      purpose === "reset"
        ? "Password Reset OTP"
        : "Email Verification OTP";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding:20px;">
        <h2>${subject}</h2>

        <p>Your OTP code is:</p>

        <h1 style="letter-spacing: 5px;">
          ${otp}
        </h1>

        <p>
          This OTP will expire in 
          <strong>10 minutes</strong>.
        </p>

        <p>
          Ignore this email if you did not request it.
        </p>
      </div>
    `;

    await emailApi.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL,
        name: process.env.SENDER_NAME,
      },

      to: [{ email: to }],

      subject,
      htmlContent,
    });

    return true;
  } catch (error) {
    console.log(
      "Email error:",
      error.response?.body || error.message
    );

    throw new Error("Failed to send email");
  }
};

export default sendEmail;