"use server"

import {ActionResponse, ErrorResponse} from "@/types/global";
import action from "@/lib/handlers/action";
import {SignInSchema, SignUpSchema} from "@/lib/validation";
import handleError from "@/lib/handlers/error";
import mongoose from "mongoose";
import User, {IUserDoc} from "@/database/user.model";
import bcrypt from 'bcryptjs';
import Account, {IAccountDoc} from "@/database/account.model";
import {signIn} from "@/auth";
import {NotFoundError} from "@/lib/http-errors";


export async function authWithCredentials(params: AuthWithCredentialParams): Promise<ActionResponse> {
    const validationResult = await action({params, schema: SignUpSchema})

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {name, username, password, email} = validationResult.params

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const existedUser = await User.findOne({ email }).session(session)

        if (existedUser) {
            throw new Error('User already exists')
        }

        const existedUserName = await User.findOne({ username }).session(session)

        if (existedUserName) {
            throw new Error('Username already exists')
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const [newUser] = await User.create([{ username, name, email }], { session })

        await Account.create([
            {
                userId: newUser._id,
                name,
                password: hashedPassword,
                provider: 'credentials',
                providerAccountId: email
            }],
            { session }
        )

        await session.commitTransaction();
        await signIn('credentials', { email, password, redirect: false})

        return { success: true }
    } catch (error) {
        await session.abortTransaction()
        return handleError(error) as ErrorResponse
    } finally {
        await session.endSession()
    }
}

export async function loginWithCredentials(params: Pick<AuthWithCredentialParams, 'email' | 'password'>): Promise<ActionResponse> {
    const validationResult = await action({params, schema: SignInSchema})

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {password, email} = validationResult.params

    try {
        const user = await User.findOne({ email }) as IUserDoc

        if (!user) throw new NotFoundError('User')

        const existedUserAccount = await Account.findOne({provider: 'credentials', providerAccountId: email}) as IAccountDoc

        if (!existedUserAccount) throw new NotFoundError('Account')

        const isValidPassword = await bcrypt.compare(password, existedUserAccount.password!)

        if (!isValidPassword) throw new Error('Wrong Email or Password')

        await signIn('credentials', { email, password, redirect: false})
        return { success: true }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}