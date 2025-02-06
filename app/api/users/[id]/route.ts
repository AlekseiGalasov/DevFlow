import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import {NextResponse} from "next/server";
import {NotFoundError, ValidationError} from "@/lib/http-errors";
import {APIErrorResponse} from "@/types/global";
import {UserSchema} from "@/lib/validation";

// get single user with special ID
export async function GET(_: Request, {params}: {params: Promise<{id: string}>}) {

    const {id} = await params;

    if (!id) throw new NotFoundError('User')

    try {
        await dbConnect();

        const user = await User.findById(id)

        if (!user) throw new NotFoundError('Can not find User')

        return NextResponse.json({success: true, data: user}, {status: 200})
    } catch (e) {
        return handleError(e, 'api') as APIErrorResponse
    }
}

// delete single user with special ID
export async function DELETE(_: Request, {params}: {params: Promise<{id: string}>}) {

    const {id} = await params;

    if (!id) throw new NotFoundError('User')

    try {
        await dbConnect();

        const deletedUser = await User.findByIdAndDelete(id)

        if (!deletedUser) throw new NotFoundError('User')

        return NextResponse.json({success: true, data: deletedUser}, {status: 204})
    } catch (e) {
        return handleError(e, 'api') as APIErrorResponse
    }
}

// Update specific user
export async function PUT(request: Request, {params}: {params: Promise<{id: string}>}) {

    const {id} = await params;

    if (!id) throw new NotFoundError('User')

    try {
        await dbConnect();

        const body = await request.json();
        const validatedData = UserSchema.partial().safeParse(body)

        if (!validatedData.success) {
            throw new ValidationError(validatedData.error.flatten().fieldErrors) // Validation Error
        }

        const updatedUser = await User.findByIdAndUpdate(id, validatedData, { new: true})

        if (!updatedUser) throw new NotFoundError('User')

        return NextResponse.json({success: true, data: updatedUser}, {status: 200})
    } catch (e) {
        return handleError(e, 'api') as APIErrorResponse
    }
}