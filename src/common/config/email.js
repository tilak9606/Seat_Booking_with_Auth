import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: '"${process.env.SMTP_NAME}" <${process.env.SMTP_FROM_EMAIL}>',
    to,
    subject,
    html, 
  });
};

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/auth/verifyemail/${token}`;
  await sendEmail(
    email,
    "Verify Your Email",
    ` <h2>Welcome!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Verify Email</a>
      <p>Or copy and paste this link: ${verificationUrl}</p>
      <p>This link expires in 15 minutes.</p>`,
  );
};

const sendResetPasswordEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await sendEmail(
    email,
    "Reset Your Password",
    `<h2>Password Reset Request</h2>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#28a745;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>Or copy and paste this link: ${resetUrl}</p>
      <p>This link expires in 15 minutes.</p>`,
  );
};

export {
  sendVerificationEmail,
  sendResetPasswordEmail,
};