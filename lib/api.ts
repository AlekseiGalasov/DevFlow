import {fetchHandler} from "@/lib/handlers/fetch";
import {IUser} from "@/database/user.model";
import {IAccount} from "@/database/account.model";
import ROUTES from "@/constans/routes";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

export const api = {
    auth: {
        oAuthSignIn: ({
                          user,
                          provider,
                          providerAccountId,
                      }: SignInWithOAuthParams) =>
            fetchHandler(`${API_BASE_URL}/auth/${ROUTES.SIGN_IN_WITH_OAUTH}`, {
                method: "POST",
                body: JSON.stringify({ user, provider, providerAccountId }),
            }),
    },
    users: {
        getAll: () => fetchHandler(`${API_BASE_URL}/users`),
        getById: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`),
        getByEmail: (email: string) => fetchHandler(`${API_BASE_URL}/users/email`, {
            method: 'POST',
            body: JSON.stringify({email})
        }),
        create: (userData: Partial<IUser>) => fetchHandler(`${API_BASE_URL}/users`, {
            method: 'POST',
            body: JSON.stringify(userData)
        }),
        update: (id: string, userData: Partial<IUser>) => fetchHandler(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        }),
        delete: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`, { method: 'DELETE'})
    },
    account: {
        getAll: () => fetchHandler(`${API_BASE_URL}/account`),
        getById: (id: string) => fetchHandler(`${API_BASE_URL}/account/${id}`),
        getByProvider: (providerAccountId: string) => fetchHandler(`${API_BASE_URL}/account/provider`, {
            method: 'POST',
            body: JSON.stringify({providerAccountId})
        }),
        create: (accountData: Partial<IAccount>) => fetchHandler(`${API_BASE_URL}/account`, {
            method: 'POST',
            body: JSON.stringify(accountData)
        }),
        update: (id: string, accountData: Partial<IAccount>) => fetchHandler(`${API_BASE_URL}/account/${id}`, {
            method: 'PUT',
            body: JSON.stringify(accountData)
        }),
        delete: (id: string) => fetchHandler(`${API_BASE_URL}/account/${id}`, { method: 'DELETE'})
    }
}