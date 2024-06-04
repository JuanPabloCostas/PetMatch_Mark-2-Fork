

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import db from "@/libs/db";
import bcrypt from "bcrypt";
// import { authOptions } from "@/libs/authOptions";

interface CustomCredentials extends CredentialInput {
  name: string;
  password: string;
}

interface CustomAuthOptions extends AuthOptions {
  providers: (
    | GoogleProvider.Options
    | CredentialsProvider.CredentialsProviderOptions<CustomCredentials>
  )[];
  pages: {
    signIn: string;
  };
  secret: string;
  session: {
    strategy: "jwt";
  };
  jwt: {
    secret: string;
  };
}




export const authOptions: CustomAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "*" },
      },
      async authorize(credentials: CustomCredentials) {
        // ... (resto del código authorize)
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET as string,
  },
};



const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
