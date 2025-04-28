import {FilterQuery} from "mongoose";

import User, {IUserDoc} from "@/database/user.model";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {PaginationSearchParamsSchema} from "@/lib/validation";
import {ActionResponse, ErrorResponse, PaginationSearchParams} from "@/types/global";

import Tags from "../../database/tag.model";


export async function getAllUsers(params: PaginationSearchParams): Promise<ActionResponse<{users: IUserDoc[], isNext: boolean}>> {

    const validationResult = await action<PaginationSearchParams>({
        params,
        schema: PaginationSearchParamsSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { filter, page = 1, pageSize = 10, query} = validationResult.params
    const skip = (Number(page) - 1) * pageSize
    const limit = Number(pageSize)

    const filterQuery: FilterQuery<typeof Tags> = {}

    if (filter === 'recommended') {
        return {success: true, data: {users: [], isNext: false} }
    }

    if (query) {
        filterQuery.$or = [
            {username: {$regex: new RegExp(query, 'i')}},
            {email: {$regex: new RegExp(query, 'i')}},
            {name: {$regex: new RegExp(query, 'i')}},
        ]
    }

    let sortCriteria = {}

    switch (filter) {
        case 'popular':
            sortCriteria = { questions: -1 };
            break;
        case 'recent':
            sortCriteria = { createdAt: -1 };
            break;
        case 'oldest':
            sortCriteria = { createdAt: 1 };
            break;
        case 'name':
            sortCriteria = { name: 1 };
            break;
        default:
            sortCriteria = { createdAt: -1 };
            break;
    }

    try {
        const totalUsers = await User.countDocuments(filterQuery)

        const users = await User.find(filterQuery)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit)

        if (!users) {
            throw new Error("Users not found");
        }

        const isNext = totalUsers > skip + users.length

        return { success: true, data: {users: JSON.parse(JSON.stringify(users)), isNext }}
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}