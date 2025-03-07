import {NotFoundError, ValidationError} from "@/lib/http-errors";
import handleError from "@/lib/handlers/error";
import {APIErrorResponse} from "@/types/global";
import {AccountSchema} from "@/lib/validation";
import {NextResponse} from "next/server";
import Account from "@/database/account.model";
import dbConnect from "@/lib/mongooseConn";

// get single account with special ID
export async function GET(_: Request, {params}: {params: Promise<{id: string}>}) {

    const {id} = await params;

    if (!id) throw new NotFoundError('Account')

    try {
        await dbConnect();

        const account = await Account.findById(id)

        if (!account) throw new NotFoundError('Account')

        return NextResponse.json({success: true, data: account}, {status: 200})
    } catch (e) {
        return handleError(e, 'api') as APIErrorResponse
    }
}

// delete account with special ID
export async function DELETE(_: Request, {params}: {params: Promise<{id: string}>}) {

    const {id} = await params;

    if (!id) throw new NotFoundError('User')

    try {
        await dbConnect();

        const deletedAccount = await Account.findByIdAndDelete(id)

        if (!deletedAccount) throw new NotFoundError('Account')

        return NextResponse.json({success: true, data: deletedAccount}, {status: 204})
    } catch (e) {
        return handleError(e, 'api') as APIErrorResponse
    }
}

// Update specific user
export async function PUT(request: Request, {params}: {params: Promise<{id: string}>}) {

    const {id} = await params;

    if (!id) throw new NotFoundError('Account')

    try {
        await dbConnect();

        const body = await request.json();
        const validatedData = AccountSchema.partial().safeParse(body)

        if (!validatedData.success) {
            throw new ValidationError(validatedData.error.flatten().fieldErrors) // Validation Error
        }

        const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, { new: true})

        if (!updatedAccount) throw new NotFoundError('Account')

        return NextResponse.json({success: true, data: updatedAccount}, {status: 200})
    } catch (e) {
        return handleError(e, 'api') as APIErrorResponse
    }
}