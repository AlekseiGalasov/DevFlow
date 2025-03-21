"use server"

import mongoose, { FilterQuery } from "mongoose";

import Questions, {IQuestion, IQuestionDoc} from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tags, {ITagDoc} from "@/database/tag.model";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {AskQuestionSchema, EditQuestionSchema, GetQuestionSchema, PaginationSearchParamsSchema} from "@/lib/validation";
import {CreateQuestionParams, EditQuestionParams, GetQuestionParams} from "@/types/action";
import {ActionResponse, ErrorResponse, PaginationSearchParams, Question, Tag} from "@/types/global";


export async function CreateQuestion(params: CreateQuestionParams): Promise<ActionResponse> {

    const validationResult = await action({
        params,
        schema: AskQuestionSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {tags, title, content} = validationResult.params
    const userId = validationResult.session?.user?.id

    const session = await mongoose.startSession()
    session.startTransaction()

    try {

        const [question] = await Questions.create([{title, content, author: userId}], {session})

        if (!question) {
            throw new Error("Failed to create question");
        }

        const tagIds: mongoose.Types.ObjectId[] = []
        const tagQuestionDocs = []

        for (const tag of tags) {
            const existingTag = await Tags.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } },
                { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
                {upsert: true, new: true, session}
            )

            tagIds.push(existingTag._id)
            tagQuestionDocs.push({
                tagId: existingTag._id,
                questions: question._id
            })
        }

        await TagQuestion.insertMany(tagQuestionDocs, {session})

        await Questions.findByIdAndUpdate(
            question._id,
            { $push: {tags: {$each: tagIds}}},
            { session}
        )

        await session.commitTransaction()

        return { success: true, data: JSON.parse(JSON.stringify(question)) };

    } catch (error) {
        await session.abortTransaction()
        return handleError(error) as ErrorResponse
    } finally {
        await session.endSession()
    }
}

export async function EditQuestion(params: EditQuestionParams): Promise<ActionResponse> {

    const validationResult = await action({
        params,
        schema: EditQuestionSchema,
        authorize: true,
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {questionId, content, title, tags} = validationResult.params
    const userId = validationResult.session?.user?.id

    const session = await mongoose.startSession();
    session.startTransaction()

    try {

        const question = await Questions.findById(questionId).populate('tags') as IQuestionDoc

        if (!question) {
            throw new Error('Question not found')
        }

        if (question.author.toString() !== userId) {
            throw new Error('Unauthorized')
        }

        if (question.title !== title || question.content !== content) {
            question.title = title
            question.content = content
            await question.save({session})
        }

        const tagsToAdd = tags.filter((tag) => {
            return !question.tags?.some(t => t.name.toLowerCase().includes(tag.toLowerCase()))
        })

        const tagsToRemove = question.tags?.filter((tag: ITagDoc) => {
            return !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
        })

        const newTagDocuments = []

        if (tagsToAdd.length > 0) {
            for (const tag of tagsToAdd) {
                const newOrUpdatedTag = await Tags.findOneAndUpdate(
                    { name: { $regex: new RegExp(`^${tag}$`, "i") } },
                    { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
                    {upsert: true, new: true, session}
                ) as ITagDoc
                if (newOrUpdatedTag) {
                    newTagDocuments.push({
                        tagId: newOrUpdatedTag._id,
                        questions: question._id
                    })
                    if (newOrUpdatedTag._id instanceof mongoose.Types.ObjectId) {
                        question.tags?.push(newOrUpdatedTag._id)
                    }
                }
            }
        }

        if (tagsToRemove.length > 0) {
            const tagIdsToRemove = tagsToRemove.map(tag => tag._id);

            await Tags.updateMany(
                {_id: {$in: tagIdsToRemove}},
                {$inc: {questions: -1}},
                { session }
            )

            await TagQuestion.deleteMany(
                { tag: {$in: tagIdsToRemove}, questions: questionId},
                { session }
            )

            question.tags = question.tags?.filter(
                (tag: mongoose.Types.ObjectId) =>
                    !tagIdsToRemove.some((id: mongoose.Types.ObjectId) =>
                        id.equals(tag._id)
                )
            )
        }

        if (newTagDocuments.length > 0) {
            await TagQuestion.insertMany(newTagDocuments, { session });
        }

        await question.save({session})
        await session.commitTransaction()

        return { success: true, data: JSON.parse(JSON.stringify(question))};

    } catch (error) {
        await session.abortTransaction()
        return handleError(error) as ErrorResponse
    } finally {
        await session.endSession()
    }
}

export async function GetQuestionById (params: GetQuestionParams): Promise<ActionResponse<Question>> {

    const validationResult = await action({
        params,
        schema: GetQuestionSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { questionId } = validationResult.params

    try {
        const question = await Questions.findById(questionId)
            .populate("tags")
            .populate("author", "_id name image");;

        if (!question) {
            throw new Error("Question not found");
        }

        return { success: true, data: JSON.parse(JSON.stringify(question)) }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function GetAllQuestions (params: PaginationSearchParams): Promise<ActionResponse<{ questions: IQuestion[], isNext: boolean}>> {

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

    const filterQuery: FilterQuery<typeof Questions> = {}

    if (filter === 'recommended') {
        return {success: true, data: {questions: [], isNext: false} }
    }

    if (query) {
        filterQuery.$or = [
            {title: {$regex: new RegExp(query, 'i')}},
            {content: {$regex: new RegExp(query, 'i')}}
        ]
    }

    let sortCriteria = {}

    switch (filter) {
        case 'newest':
            sortCriteria = { createdAt: -1 };
            break;
        case 'unanswered':
            filterQuery.answers = 0;
            sortCriteria = { createdAt: -1 };
            break;
        case 'popular':
            sortCriteria = { upvotes: -1 };
            break;
        default:
            sortCriteria = { createdAt: -1 };
            break;
    }

    try {

        const totalQuestions = await Questions.countDocuments(filterQuery)


        const questions = await Questions.find(filterQuery)
            .populate("tags", 'name')
            .populate("author", "name image")
            .lean()
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit)
        if (!questions) {
            throw new Error("Question not found");
        }

        const isNext = totalQuestions > skip + questions.length

        return { success: true, data: {questions: JSON.parse(JSON.stringify(questions)), isNext }}
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}