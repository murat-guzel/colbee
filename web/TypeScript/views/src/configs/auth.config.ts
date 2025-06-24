import type { NextAuthConfig } from 'next-auth'
import validateCredential from '../server/actions/user/validateCredential'
import Credentials from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

import type { SignInCredential } from '@/@types/auth'

// NextAuth User tipini genişlet
declare module "next-auth" {
    interface User {
        profilePhotoUrl?: string;
        jwtToken?: string;
    }
}

export default {
    providers: [
        Github({
            clientId: process.env.GITHUB_AUTH_CLIENT_ID,
            clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                /** validate credentials from backend here */
                const user = await validateCredential(
                    credentials as SignInCredential,
                )
                if (!user) {
                    return null
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profilePhotoUrl: user.profilePhotoUrl,
                    jwtToken: user.jwtToken,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.profilePhotoUrl = user.profilePhotoUrl;
                token.jwtToken = user.jwtToken;
            }
            return token;
        },
        async session({ session, token }) {
            /** apply extra user attributes here, for example, we add 'authority' & 'id' in this section */
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                    profilePhotoUrl: token.profilePhotoUrl as string,
                    jwtToken: token.jwtToken as string,
                    authority: ['admin', 'user'],
                },
            }
        },
    },
} satisfies NextAuthConfig
