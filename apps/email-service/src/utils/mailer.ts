import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});

const sendMail = async ({ email, subject, text }: { email: string; subject: string; text: string }) => {
    const res = await transporter.sendMail({
        from: '"BookMyVenue" <noreply@bookemyvenue.com>',
        to: email,
        subject,
        text,
    });

    console.log("MESSAGE SENT:", res);
};

export default sendMail;
