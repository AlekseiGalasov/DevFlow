import {NotFoundError, ValidationError} from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import {UserSchema} from "@/lib/validation";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import {APIErrorResponse} from "@/types/global";
import {NextResponse} from "next/server";

export async function POST(request: Request) {

    const {email} = await request.json();

    try {
        await dbConnect();
        const validatedEmail = UserSchema.partial().safeParse({email})

        if (!validatedEmail.success) {
            throw new ValidationError(validatedEmail.error.flatten().fieldErrors) // Validation Error
        }

        const user = await User.findOne({ email})

        if (!user) throw new NotFoundError('User')

        return NextResponse.json({success: true, data: user}, {status: 200})
    } catch (e) {
        return handleError(e, 'api') as APIErrorResponse
    }
}