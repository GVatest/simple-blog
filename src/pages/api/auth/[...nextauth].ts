import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verify } from "argon2";
import { prisma } from "common/server";
import { SCredentials } from "schemas";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error(
    "Please provide process.env.NEXTAUTH_SECRET environment variable"
  );
}

export default NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // validate credentials
        const validation = SCredentials.safeParse(credentials);
        if (!validation.success) {
          throw new Error("Invalid credentials provided");
        }

        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        // check if user exists
        const user = await prisma.user.findFirst({
          where: { username },
        });
        if (!user) {
          throw new Error("Wrong credentials. Try again.");
        }

        // verify password
        const isValid = await verify(user.password, password);
        if (!isValid) {
          throw new Error("Wrong credentials. Try again.");
        }

        return { ...user, id: user.id.toString() };
      },
    }),
  ],
  session: {
    maxAge: 24 * 30 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    signOut: "/auth/signout",
  },
});
