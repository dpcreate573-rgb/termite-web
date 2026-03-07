import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"



export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "google") {
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
