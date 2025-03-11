import {ActionResponse, ErrorResponse, PaginationSearchParams} from "@/types/global";
import action from "@/lib/handlers/action";
import {PaginationSearchParamsSchema} from "@/lib/validation";
import Tag, {ITagDoc} from "@/database/tag.model";
import handleError from "@/lib/handlers/error";
import {FilterQuery} from "mongoose";


export async function getAllTags(params: PaginationSearchParams): Promise<ActionResponse<{ tags: ITagDoc[], isNext: boolean}>> {

    const validationResult = await action({
        params,
        schema: PaginationSearchParamsSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {sort, filter, page = 1, pageSize = 10, query} = validationResult.params
    const skip = (Number(page) - 1) * pageSize
    const limit = Number(pageSize)

    const filterQuery: FilterQuery<typeof Tag> = {}

    if (filter === 'recommended') {
        return {success: true, data: {tags: [], isNext: false} }
    }

    if (query) {
        filterQuery.$or = [
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
        const totalTags = await Tag.countDocuments(filterQuery)

        const tags = await Tag.find(filterQuery)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit)
        if (!tags) {
            throw new Error("Question not found");
        }

        const isNext = totalTags > skip + tags.length

        return { success: true, data: {tags: JSON.parse(JSON.stringify(tags)), isNext }}
    } catch (error) {
        return handleError(error) as ErrorResponse
    }

}