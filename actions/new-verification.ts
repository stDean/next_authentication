"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verify-token";

interface NewVerificationInterface {
  token?: string | null;
}

export const newVerification = async ({ token }: NewVerificationInterface) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { error: "Token does not exist" };
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
    data: { emailVerified: new Date(), email: existingToken.email },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified!!" };
};
