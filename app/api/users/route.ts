import {NextResponse} from "next/server";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import {ValidationError} from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import {UserSchema} from "@/lib/validation";

// Get all users

export async function GET() {
    try {
        await dbConnect();

        const users = await User.find()

        return NextResponse.json({success: true, data: users}, {status: 200})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}

// Create user
export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();

        const vaildatedData = UserSchema.safeParse(body)

        if (!vaildatedData.success) {
            throw new ValidationError(vaildatedData.error.flatten().fieldErrors) // Validation Error
        }

        const { email, username} = vaildatedData.data;

        const existingUser = await User.findOne({email})
        if (existingUser) throw new Error('User Already exist')

        const existingUsername = await User.findOne({username})
        if (existingUsername) throw new Error('Username already exists')

        const newUser = await User.create(vaildatedData.data);
        return NextResponse.json({success: true, data: newUser}, {status: 201})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}