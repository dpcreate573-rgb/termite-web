import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// List of allowed emails (e.g., company employees)
const ALLOWED_EMAILS = [
  // "employee@yourcompany.com",
];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google") {
        // Uncomment the following lines to restrict access to specific emails
        // if (user.email && ALLOWED_EMAILS.includes(user.email)) {
        //   return true;
        // }
        // return false; // Return false to deny access

        // Currently allowing all Google logins for testing. 
        // In production, restrict this.
        return true; 
      }
      return false;
    },
  },
  pages: {
    signIn: '/login', // Optional: Custom login page
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
