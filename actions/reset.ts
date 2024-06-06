"use server";

import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordReset } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;
  const dbUser = await getUserByEmail(email);
  if (!dbUser) {
    return { error: "User with this email does not exist!" };
  }

  const resetToken = await generatePasswordResetToken(email);
  await sendPasswordReset({
    email: resetToken.email,
    token: resetToken.token,
  });

  return { success: "Reset email sent!" };
};
