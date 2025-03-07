import NextAuth from "next-auth"
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import {ActionResponse} from "@/types/global";
import {api} from "@/lib/api";
import {IUserDoc} from "@/database/user.model";
import {SignInSchema} from "@/lib/validation";
import {IAccountDoc} from "@/database/account.model";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub,
        Google,
        Credentials({
            authorize: async (credentials) => {
                let user = null;
                const validatedData = SignInSchema.safeParse(credentials)

                if (validatedData.success) {
                    const {password, email} = validatedData.data

                    const {data: existingAccount} = await api.account.getByProvider(email) as ActionResponse<IAccountDoc>
                    if (!existingAccount) return null

                    const {data: existingUser} = await api.users.getById(existingAccount.userId.toString()) as ActionResponse<IUserDoc>
                    if (!existingUser) return null

                    const isValidPassword = bcrypt.compare(password, existingAccount.password!)

                    if (isValidPassword) {
                        user = {
                            id: existingUser.id,
                            name: existingUser.name,
                            email: existingUser.email,
                            image: existingUser.image,
                        }
                    }
                }
                return user
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub as string;
            return session;
        },
        async signIn({ user, profile, account }) {
            if (account?.type === "credentials") return true;
            if (!account || !user) return false;

            const userInfo = {
                name: user.name!,
                email: user.email!,
                image: user.image!,
                username:
                    account.provider === "github"
                        ? (profile?.login as string)
                        : (user.name?.toLowerCase() as string),
            };

            const { success } = (await api.auth.oAuthSignIn({
                user: userInfo,
                provider: account.provider as "github" | "google",
                providerAccountId: account.providerAccountId,
            })) as ActionResponse;

            return success;
        },
        async jwt({ token, account }) {
            if (account) {
                const { data: existingAccount, success } =
                    (await api.account.getByProvider(
                        account.type === "credentials"
                            ? token.email!
                            : account.providerAccountId
                    )) as ActionResponse<IAccountDoc>;

                if (!success || !existingAccount) return token;

                const userId = existingAccount.userId;

                if (userId) token.sub = userId.toString();
            }

            return token;
        },
    },
})