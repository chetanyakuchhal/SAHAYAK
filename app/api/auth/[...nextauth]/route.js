import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDB from "@/utils/db"; // Utility function for DB connection
import User from "@/models/User"; // Correct import for User model

const providers = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      identifier: { label: "Email or Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const rawIdentifier = credentials?.identifier || credentials?.email;

      if (!rawIdentifier || !credentials?.password) {
        throw new Error("Email/username and password are required");
      }

      await connectDB();
      const identifier = String(rawIdentifier).trim();
      const identifierLower = identifier.toLowerCase();

      const user = await User.findOne({
        $or: [
          { email: identifierLower },
          { username: identifier },
          { username: identifierLower },
          { name: identifier },
        ],
      });

      if (!user || !user.password) {
        throw new Error("Invalid credentials");
      }

      const isValidPassword = await bcrypt.compare(credentials.password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name || user.username,
        username: user.username,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions = {
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB(); // Connect to MongoDB

        const existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          const newUser = new User({
            email: profile.email,
            username: profile.email.split("@")[0],
            name: profile.name,
          });
          await newUser.save();
          user.name = newUser.username;
        } else {
          user.name = existingUser.username;
        }
      }
      return true;
    },

    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      if (token?.username) {
        session.user.username = token.username;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user?.username) {
        token.username = user.username;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
