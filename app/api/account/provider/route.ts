import {NotFoundError, ValidationError} from "@/lib/http-errors";
import dbConnect from "@/lib/mongooseConn";
import handleError from "@/lib/handlers/error";
import {APIErrorResponse} from "@/types/global";
import {NextResponse} from "next/server";
import {AccountSchema} from "@/lib/validation";
import Account from "@/database/account.model";

export async function POST(request: Request) {

    const { providerAccountId } = await request.json();
    try {
        await dbConnect();
        const validatedProviderId = AccountSchema.partial().safeParse({providerAccountId})

        if (!validatedProviderId.success) {
            throw new ValidationError(validatedProviderId.error.flatten().fieldErrors) // Validation Error
        }

        const account = await Account.findOne({ providerAccountId })


        if (!account) throw new NotFoundError('Account')

        return NextResponse.json({success: true, data: account}, {status: 200})
    } catch (e) {
        return handleError(e, 'api') as APIErrorResponse
    }
}