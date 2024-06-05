import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       role: string;
//     } & DefaultSession["user"];
//   }
// }

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
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);
      if (!dbUser) {
        return token;
      }

      token.role = dbUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
