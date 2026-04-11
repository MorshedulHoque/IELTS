import NextAuth, { type NextAuthOptions, type User } from "next-auth";

// Extend the User type to include the role property
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role?: string;
    };
  }
}
import { getToken } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/user/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
            {
              method: "POST",
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );

          const response = await res.json();

          // Check if API response is successful and has data
          if (!response.success || !response.data?.[0]) return null;

          const userData = response.data[0];

          console.log("UserData", userData);

          return {
            id: userData._id, // Map _id to id
            name: userData.username, // Map username to name
            email: userData.email,
            role: userData.role,
            // Removed erroneous line as it is misplaced and unnecessary
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Optional: Add custom scopes
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      // LinkedIn requires specific scope for email and profile
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      // Optional: Use v2 of LinkedIn API
      issuer: "https://www.linkedin.com/oauth",
      // Optional: Customize token endpoint if needed
      token: "https://www.linkedin.com/oauth/v2/accessToken",
      // Optional: Customize userinfo endpoint if needed
      userinfo:
        "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))",
    }),
  ],
  callbacks: {
    // In your auth.ts, update the jwt callback
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user?.role;
      }

      if (account?.provider !== "credentials" && user) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/oauth-user`,
            {
              method: "POST",
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                provider: account.provider,
                providerId: user.id,
                image: user.image,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );

          const userData = await res.json();

          if (userData.success && userData.data) {
            token.role = userData.data.role;
            token.id = userData.data._id || userData.data.id;
            token.isNewUser = userData.data.isNewUser; // Add this flag
          }
        } catch (error) {
          console.error("Error syncing OAuth user:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as string,
        },
      };
    },
    // Optional: Redirect after OAuth sign in
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30,
  },
};
