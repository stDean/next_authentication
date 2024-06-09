import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification!
      if (account?.provider !== "credentials") {
        return true;
      }

      if (user.id) {
        const dbUser = await getUserById(user.id);

        // prevent sign in without email verification
        if (!dbUser?.emailVerified) {
          return false;
        }

        // TODO: 2FA check
        if (dbUser.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
            dbUser.id
          );

          if (!twoFactorConfirmation) return false;

          // delete 2FA for next sign in
          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id },
          });

          return true;
        }
      }

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user && token.role) {
        session.user.role = token.role;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        session.user.isOAuth = token.isOAuth;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);
      if (!dbUser) {
        return token;
      }

      const existingAccount = await getAccountByUserId({ userId: dbUser?.id });

      // updating the token when a user changes his data
      token.name = dbUser.name;
      token.email = dbUser.email;

      // adding new fields to the token
      token.isOAuth = !!existingAccount;
      token.role = dbUser.role;
      token.isTwoFactorEnabled = dbUser.isTwoFactorEnabled;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
