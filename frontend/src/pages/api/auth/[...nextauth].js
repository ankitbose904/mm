import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/",
    },
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub;
            return session;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl;
        },
    },
});
