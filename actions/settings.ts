"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { SettingsSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendEmailVerification } from "@/lib/mail";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const { user } = await currentUser();

  if (user && user.id) {
    const dbUser = await getUserById(user?.id);

    if (!dbUser) {
      return { error: "Unauthorized" };
    }

    // if user sign in using OAuth don't update these values
    if (user.isOAuth) {
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
      values.isTwoFactorEnabled = undefined;
    }

    // if a new email is typed and different from the former email
    // then first check if that new email is currently in use
    if (values.email && values.email !== user.email) {
      const existingUser = await getUserByEmail(values.email);
      if (existingUser && existingUser.id !== user.id) {
        return { error: "A user with this email exists!" };
      }

      // create a new verification token to confirm email
      const verificationToken = await generateVerificationToken(
        values.email as string
      );
      await sendEmailVerification({
        email: verificationToken.email,
        token: verificationToken.token,
      });

      return { success: "Verification email sent!" };
    }

    /**
     * if password and new password fields have values
     * check if the password matches the password in the DB
     * if not return an error
     * else hash the newly entered password
     * set the values.password to the newly hashed password before updating the DB
     */
    if (values.password && values.newPassword && dbUser.password) {
      const passwordMatch = await bcrypt.compare(
        values.password,
        dbUser.password
      );
      if (!passwordMatch) {
        return { error: "incorrect password entered!" };
      }

      const hashPassword = await bcrypt.hash(values.newPassword, 10);
      values.password = hashPassword;
      values.newPassword = undefined;
    }

    await db.user.update({
      where: { id: dbUser.id },
      data: { ...values },
    });

    return { success: "Update Successful!" };
  } else {
    return { error: "Unauthorized" };
  }
};
