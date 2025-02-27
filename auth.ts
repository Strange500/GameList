import NextAuth from "next-auth";
import Authentik from "next-auth/providers/authentik";
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  
  providers: [Authentik({
    clientId: process.env.AUTH_AUTHENTIK_ID,
    clientSecret: process.env.AUTH_AUTHENTIK_SECRET,
    issuer: process.env.AUTH_AUTHENTIK_ISSUER
  })],
  trustHost: true,
});