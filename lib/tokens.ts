// to generate the token!!
import { v4 as uuidV4 } from "uuid";
import { getVerificationTokenByEmail } from "@/data/verify-token";
import { db } from "@/lib/db";

export const generateVerificationToken = async (email: string) => {
  const token = uuidV4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1hr

  // remove an existing token from the db id one exists
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // create a verification token
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};
