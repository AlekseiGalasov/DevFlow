import {FilterQuery} from "mongoose";

import Questions from "@/database/question.model";
import Tags from "@/database/tag.model";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {GetTagQuestionsSchema, PaginationSearchParamsSchema} from "@/lib/validation";
import {QuestionByTagParams} from "@/types/action";
import {
    ActionResponse,
    ErrorResponse,
    PaginationSearchParams,
    Question,
    Tag
} from "@/types/global";



export async function getAllTags(params: PaginationSearchParams): Promise<ActionResponse<{ tags: Tag[], isNext: boolean}>> {

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
        const totalTags = await Tags.countDocuments(filterQuery)

        const tags = await Tags.find(filterQuery)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit)
        if (!tags) {
            throw new Error("Tags not found");
        }

        const isNext = totalTags > skip + tags.length

        return { success: true, data: {tags: JSON.parse(JSON.stringify(tags)), isNext }}
    } catch (error) {
        return handleError(error) as ErrorResponse
    }

}

export async function getQuestionsByTag(params: QuestionByTagParams): Promise<ActionResponse<{ tag: Tag, questions: Question[], isNext: boolean}>> {

    const validationResult = await action<QuestionByTagParams>({
        params,
        schema: GetTagQuestionsSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { page = 1, pageSize = 10, query, tagId} = validationResult.params
    const skip = (Number(page) - 1) * pageSize
    const limit = Number(pageSize)

    try {

        const tag = await Tags.findById(tagId)

        if (!tag) {
            throw new Error('Tag not found')
        }

        const filterQuery: FilterQuery<typeof Questions> = {
            tags: { $in: [tagId]}
        }

        if (query) {
            filterQuery.title = {name: {$regex: new RegExp(query, 'i')}}
        }

        const totalQuestions = await Questions.countDocuments(filterQuery)

        const questions = await Questions.find(filterQuery)
            .select('_id title views answers upvotes downvotes author createdAt')
            .populate([
                { path: 'author', select: 'name image'},
                { path: 'tags', select: 'name'},
            ])
            .skip(skip)
            .limit(limit)
        if (!questions) {
            throw new Error("Questions not found");
        }

        const isNext = totalQuestions > skip + questions.length

        return {
            success: true,
            data: {
                tag: JSON.parse(JSON.stringify(tag)),
                questions: JSON.parse(JSON.stringify(questions)),
                isNext
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }

}

export async function getTopTags(): Promise<ActionResponse<{ tags: Tag[]}>> {

    try {
        const topTags = await Tags.find()
            .select('name questions')
            .sort({ questions: -1})
            .limit(5)

        if (!topTags) {
            throw new Error('Top tags not found')
        }

        return {
            success: true,
            data: {
                tags: JSON.parse(JSON.stringify(topTags)),
            }
        }

    } catch (error) {
        return handleError(error) as ErrorResponse
    }

}