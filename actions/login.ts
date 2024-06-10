"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { sendEmailVerification, sendTwoFactorMail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string
) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  /**
   * This checks if the email and password exists
   * Then checks if their email has been verified
   * If not verified send a verification email to the users email.
   */
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid Credentials!!" };
  }

  // restricting unverified emails
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendEmailVerification({
      email: verificationToken.email,
      token: verificationToken.token,
    });

    return { success: "Confirmation email sent!" };
  }

  // before sign in do 2FA
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      // verify code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "Invalid token!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid token!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return { error: "Code has expired!" };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    } else {
      // if no 2FA send do this!
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorMail({
        email: twoFactorToken.email,
        token: twoFactorToken.token,
      });

      return { twoFactor: true };
    }
  }

  // do this after everything above
  try {
    // sign in and redirect to the dashboard
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }

    throw error;
  }
};
