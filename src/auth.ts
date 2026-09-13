import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByUsername } from "@/lib/db";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const username = String(credentials.username).trim();
        const password = String(credentials.password);

        try {
          const user = await findUserByUsername(username);
          if (!user || !user.password_hash) {
            return null;
          }

          const isValid = bcrypt.compareSync(password, user.password_hash);
          if (!isValid) {
            return null;
          }

          return {
            id: String(user.id),
            name: user.owner_name,
            username: user.username,
            ownerName: user.owner_name,
          };
        } catch (error) {
          console.error("Auth error during authorize:", error);
          return null;
        }
      },
    }),
  ],
});
