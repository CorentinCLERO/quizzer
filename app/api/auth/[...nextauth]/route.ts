import NextAuth, { Account, Profile, User } from "next-auth"
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signIn({ user, account, profile }: { user: User | AdapterUser; account: Account | null; profile?: Profile | undefined }) {
      // console.log("signIn", user, account, profile)
      let isNewUser: boolean = false;
      const userEmail = user.email;
      console.log("User email:", userEmail);
      console.log('process.env : ', process.env)
      if (userEmail) {
        console.log("Fetching user data...", `${process.env.NEXTAUTH_URL}/api/user?email=${encodeURIComponent(userEmail)}`);
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user?email=${encodeURIComponent(userEmail)}`);
        console.log("Response:", response);
        const userData = await response.json();
        console.log("Fetched user data:", userData);
        isNewUser = response.status === 404;
        console.log("Is new user:", isNewUser, response.status, response.status === 404);
      } else {
        return false;
      }

      if (isNewUser) {
        console.log("Creating new user...");
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            picture: user.image
          })
        });
        console.log("Response:", response);
        return true;
      } else {
        console.log("User already exists.");
      }
      return true
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }