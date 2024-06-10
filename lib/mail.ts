import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const { NEXT_PUBLIC_APP_URI: domain } = process.env;

export const sendEmailVerification = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Email Confirmation.",
    html: `<p>Click <a href='${confirmLink}'>here</a> to confirm your email.</p>`,
  });
};

export const sendPasswordReset = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const resetLink = `${domain}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Email Confirmation.",
    html: `<p>Click <a href='${resetLink}'>here</a> to reset your password.</p>`,
  });
};

export const sendTwoFactorMail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code is: ${token}</p>`,
  });
};
