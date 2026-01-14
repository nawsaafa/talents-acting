import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

const { auth } = NextAuth(authConfig);

export default auth(() => {
  // The authorized callback in authConfig handles route protection
});

export const config = {
  matcher: [
    // Match all routes except static files and api routes (except auth)
    "/((?!_next/static|_next/image|favicon.ico|api(?!/auth)).*)",
  ],
};
