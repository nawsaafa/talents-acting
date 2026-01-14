import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Role } from "@prisma/client";

// Extend NextAuth types to include role
declare module "next-auth" {
  interface User {
    role: Role;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      role: Role;
    };
  }
}

// Extend JWT type
export interface ExtendedJWT extends JWT {
  id: string;
  role: Role;
}

/**
 * Edge-compatible auth config (no bcrypt/prisma imports)
 * Used by middleware for route protection
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnAuth = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

      if (isOnAdmin) {
        if (isLoggedIn && auth?.user?.role === "ADMIN") return true;
        return false;
      }

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }

      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token as ExtendedJWT;
    },
    session({ session, token }) {
      const extToken = token as ExtendedJWT;
      if (extToken) {
        session.user.id = extToken.id;
        session.user.role = extToken.role;
      }
      return session;
    },
  },
  providers: [], // Providers added in auth.ts (not edge-compatible)
};
