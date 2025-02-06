
// Get all users

import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import {APIErrorResponse} from "@/types/global";
import {AccountSchema} from "@/lib/validation";
import {ValidationError} from "@/lib/http-errors";
import Account from "@/database/account.model";
import {NextResponse} from "next/server";


// Get all Accounts
export async function GET() {
    try {
        await dbConnect();

        const accounts = await Account.find()

        return NextResponse.json({success: true, data: accounts}, {status: 200})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}

// Create Account
export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();

        const validatedData = AccountSchema.safeParse(body)

        if (!validatedData.success) {
            throw new ValidationError(validatedData.error.flatten().fieldErrors) // Validation Error
        }

        const { provider, providerAccountId} = validatedData.data;

        const existingAccount = await Account.findOne({
            provider,
            providerAccountId
        })

        if (existingAccount) throw new Error('Account Already exist')

        const newAccount = await User.create(validatedData);

        return NextResponse.json({success: true, data: newAccount}, {status: 201})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}