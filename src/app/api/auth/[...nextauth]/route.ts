import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from '@/libs/db';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error('Credentials not provided');

        const userFound = await db.user.findUnique({
          where: {
            name: credentials.name,
          },
        });

        if (!userFound) throw new Error('No user found');

        const matchPassword = await bcrypt.compare(credentials.password, userFound.password);

        if (!matchPassword) throw new Error('Wrong password');

        return {
          id: userFound.id,
          name: userFound.name,
          email: userFound.email,
          isAdmin: userFound.isAdmin,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };