'use server'

import mongoose from "mongoose";
import {revalidatePath} from "next/cache";

import ROUTES from "@/constans/routes";
import Answers, {IAnswerDoc} from "@/database/answer.models";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {CreateAnswerSchema, GetAnswersByQuestionIdSchema} from "@/lib/validation";
import {AnswersByQuestionIdParams, CreateAnswerParams} from "@/types/action";
import {ActionResponse, Answer, ErrorResponse} from "@/types/global";

import Questions from "../../database/question.model";


export async function createAnswer(params: CreateAnswerParams): Promise<ActionResponse<IAnswerDoc>> {

    const validationResult = await action({
        params,
        schema: CreateAnswerSchema,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { content, questionId } = validationResult.params
    const userId = validationResult.session?.user?.id

    const session = await mongoose.startSession()
    session.startTransaction()

    try {

        const [answer] = await Answers.create([{content, author: userId, question: questionId}], {session})

        if (!answer) {
            throw new Error("Failed to create question");
        }

        await Questions.findByIdAndUpdate(
            questionId,
            {$inc: { answers: 1 } },
            { session }
        )

        await session.commitTransaction()

        revalidatePath(ROUTES.QUESTION(questionId))

        return { success: true, data: JSON.parse(JSON.stringify(answer)) };

    } catch (error) {
        await session.abortTransaction()
        return handleError(error) as ErrorResponse
    } finally {
        await session.endSession()
    }

}

export async function getAnswersByQuestionId(params: AnswersByQuestionIdParams): Promise<ActionResponse<{ answers: Answer[], isNext: boolean, totalAnswers: number}>> {

    const validationResult = await action({
        params,
        schema: GetAnswersByQuestionIdSchema,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { questionId, page = 1, pageSize = 10, filter } = validationResult.params
    const skip = (Number(page) - 1) * pageSize
    const limit = Number(pageSize)

    let sortCriteria = {}

    switch (filter) {
        case 'latest':
            sortCriteria = { createdAt: -1 };
            break;
        case 'oldest':
            sortCriteria = { createdAt: 1 };
            break;
        case 'popular':
            sortCriteria = { upvotes: -1 };
            break;
        default:
            sortCriteria = { createdAt: -1 };
            break;
    }

    try {
        const totalAnswers = await Answers.countDocuments({ question: questionId })

        const answers = await Answers.find({ question: questionId })
            .populate('author', 'name image')
            .lean()
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit)

        if (!answers) {
            throw new Error("Failed to find answers");
        }

        const isNext = totalAnswers > skip + answers.length

        return { success: true, data: {answers: JSON.parse(JSON.stringify(answers)), isNext, totalAnswers }}
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}