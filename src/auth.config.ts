import type { NextAuthConfig } from "next-auth";

const FALLBACK_AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "32f3c9046052408d9107cc3459dc736db39e23517214acbc7c903cf9027f0a22";

if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  process.env.AUTH_SECRET = FALLBACK_AUTH_SECRET;
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.ownerName = (user as any).ownerName;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id as string) || session.user.id;
        session.user.username = (token.username as string) || "";
        session.user.ownerName = (token.ownerName as string) || "";
        session.user.name = (token.ownerName as string) || session.user.name;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: FALLBACK_AUTH_SECRET,
  providers: [],
};
