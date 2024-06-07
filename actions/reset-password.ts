"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { ResetPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";

interface resetPasswordInterface {
  values: z.infer<typeof ResetPasswordSchema>;
  token?: string | null;
}

export const resetPassword = async ({
  values,
  token,
}: resetPasswordInterface) => {
  const validatedFields = ResetPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!token) {
    return { error: "Missing token!" };
  }

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const dbUser = await getUserByEmail(existingToken.email);
  if (!dbUser) {
    return { error: "email does not exist!" };
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password updated successfully!" };
};
