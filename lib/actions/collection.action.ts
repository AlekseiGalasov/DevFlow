'use server'

import mongoose, {PipelineStage} from "mongoose";
import {revalidatePath} from "next/cache";

import ROUTES from "@/constans/routes";
import {Collection, Questions} from "@/database";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {AddToCollectionSchema, PaginationSearchParamsSchema} from "@/lib/validation";
import {AddToCollectionParams, HasCollectionResponse} from "@/types/action";
import {ActionResponse, ErrorResponse, PaginationSearchParams, Collection as CollectionInterface} from "@/types/global";

export async function AddOrRemoveToCollection(params: AddToCollectionParams): Promise<ActionResponse<{isAdded: boolean}>> {

    const validationResult = await action({
        params,
        schema: AddToCollectionSchema,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {questionId} = validationResult.params as AddToCollectionParams
    const userId = validationResult.session?.user?.id

    try {
        const question = await Questions.findById(questionId)

        if (!question) throw new Error("Questions not found");

        const collection = await Collection.findOne({
            author: userId,
            question: questionId
        })

        let isAdded = false;
        if (!collection) {
            isAdded = true
            await Collection.create({author: userId, question: questionId})
        } else {
            await Collection.findOneAndDelete({author: userId, question: questionId})
        }

        revalidatePath(ROUTES.QUESTION(questionId))

        return {success: true, data: {isAdded}}

    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function GetAllUserCollection(params: PaginationSearchParams): Promise<ActionResponse<{ collection: CollectionInterface[], isNext: boolean}>> {

    const validationResult = await action({
        params,
        schema: PaginationSearchParamsSchema,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {sort, filter, page = 1, pageSize = 10, query} = validationResult.params as PaginationSearchParams
    const userId = validationResult.session?.user?.id;

    const skip = (Number(page) - 1) * pageSize
    const limit = Number(pageSize)

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
        mostrecent: {"question.createdAt": -1},
        oldest: {"question.createdAt": 1},
        mostvoted: {"question.upvotes": -1},
        mostviewed: {"question.views": -1},
        mostanswered: {"question.answers": -1},
    }

    const sortCriteria = sortOptions[filter as keyof typeof sortOptions] || sortOptions.mostrecent

    try {

        const pipeline: PipelineStage[] = [
            { $match: { author: new mongoose.Types.ObjectId(userId)}},
            { $lookup: {
                    from: 'questions',
                    localField: 'question',
                    foreignField: '_id',
                    as: 'question'
                }
            },
            { $unwind: "$question"},
            { $lookup: {
                    from: 'users',
                    localField: 'question.author',
                    foreignField: "_id",
                    as: 'question.author'
                }
            },
            { $unwind: "$question.author"},
            { $lookup: {
                    from: 'tags',
                    localField: 'question.tags',
                    foreignField: "_id",
                    as: 'question.tags'
                }
            }
        ]

        if (query) {
            pipeline.push({
                $match: {
                    $or: [
                        {"question.title": {$regex: query, $options: 'i'}},
                        {"question.content": {$regex: query, $options: 'i'}},
                    ]
                }
            })
        }

        const [{ count: totalCount } = { count: 0 }] = await Collection.aggregate([...pipeline, { $count: "count"}]);

        pipeline.push({$sort: sortCriteria}, {$skip: skip}, {$limit: limit});
        pipeline.push({ $project: {question: 1, author: 1}})

        const collection = await Collection.aggregate(pipeline)

        if (!collection) {
            throw new Error("Question not found");
        }

        const isNext = totalCount.count > skip + collection.length

        return { success: true, data: {collection: JSON.parse(JSON.stringify(collection)), isNext}}
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function HasInCollection(params: AddToCollectionParams): Promise<ActionResponse<HasCollectionResponse>> {


    const validationResult = await action({
        params,
        schema: AddToCollectionSchema,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {questionId} = validationResult.params as AddToCollectionParams
    const userId = validationResult.session?.user?.id

    try {
        const question = await Questions.findById(questionId)

        if (!question) {
            throw new Error("Question not found");
        }

        const collection = await Collection.findOne({
            author: userId,
            question: questionId
        })

        return {success: true, data: {haveInCollection: !!collection}}

    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}