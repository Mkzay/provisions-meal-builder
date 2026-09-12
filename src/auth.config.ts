import type { NextAuthConfig } from "next-auth";

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
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "provisions-secret-salt-development-key-32chars",
  providers: [],
};
