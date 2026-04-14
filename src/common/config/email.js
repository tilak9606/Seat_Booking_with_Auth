import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"${process.env.SMTP_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    text,
  });
};

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/auth/verifyemail/${token}`;
  await sendEmail(
    email,
    "Verify Your Email",
    `<h2>Welcome!</h2><p>Please click the link below to verify your email address:</p><a href="${url}">Verify Email</a>`,
  );
};

const sendResetPasswordEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await sendEmail(
    email,
    "Reset Your Password",
    `<h2>Password Reset Request</h2><p>Please click the link below to reset your password:</p><a href="${url}">Reset Password link expires in 15 minutes.</a>`,
  );
};

export {
  sendVerificationEmail,
  sendResetPasswordEmail,
};
