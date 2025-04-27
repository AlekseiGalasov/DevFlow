'use server'

import mongoose, {ClientSession} from "mongoose";
import {revalidatePath} from "next/cache";

import ROUTES from "@/constans/routes";
import {Answers, Questions} from "@/database";
import Vote, {IVoteDoc} from "@/database/vote.model";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {CreateVoteSchema, HasVotedSchema, UpdateVoteCountSchema} from "@/lib/validation";
import {CreateVoteParams, HasVotedParams, HasVotedResponse, UpdateVoteCountParams} from "@/types/action";
import {ActionResponse, ErrorResponse} from "@/types/global";


export async function updateVoteCount(params: UpdateVoteCountParams, session: ClientSession): Promise<ActionResponse> {
    const validationResult = await action({
        params,
        schema: UpdateVoteCountSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { actionId, type, voteType, change } = validationResult.params!;

    const Model = type === "question" ? Questions : Answers;
    const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

    try {
        const result = await Model.findByIdAndUpdate(
            actionId,
            { $inc: { [voteField]: change } },
            { new: true, session }
        );

        if (!result)
            return handleError(
                new Error("Failed to update vote count")
            ) as ErrorResponse;

        return { success: true };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function createVote(params: CreateVoteParams): Promise<ActionResponse<IVoteDoc>> {

    const validationResult = await action({
        params,
        schema: CreateVoteSchema,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { type, voteType, actionId } = validationResult.params
    const userId = validationResult.session?.user?.id

    if (!userId) return handleError(new Error("Unauthorized")) as ErrorResponse;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingVote = await Vote.findOne({
            author: userId,
            actionId,
            type
        }).session(session)

        if (existingVote) {
            if (existingVote.voteType === voteType) {
                // if user already voted with the same value, DELETE it and DECREMENT vote
                await Vote.deleteOne({ _id: existingVote._id }).session(session);
                await updateVoteCount(
                    { actionId, type, voteType, change: -1 },
                    session
                );
            } else {
                // if user already voted with the different value, UPDATE it and INCREMENT vote
                await Vote.findByIdAndUpdate(
                    existingVote._id,
                    { voteType },
                    {new: true, session}
                )
                await updateVoteCount({voteType, change: 1, actionId, type}, session)
                await updateVoteCount({voteType: existingVote.voteType, change: -1, actionId, type}, session)
            }
        } else {
            // if user do not voted yet, CREATE a new vote
            await Vote.create([{author: userId, actionId, type, voteType, change: 1 }], {
                session,
            });
            await updateVoteCount(
                { actionId, type, voteType, change: 1 },
                session
            );
        }

        await session.commitTransaction()
        
        revalidatePath(ROUTES.QUESTION(actionId))

        return {success: true};
    } catch (error) {
        await session.abortTransaction()
        return handleError(error) as ErrorResponse
    } finally {
        await session.endSession()
    }
}

export async function hasVoted(params: HasVotedParams): Promise<ActionResponse<HasVotedResponse>> {

    const validationResult = await action({
        params,
        schema: HasVotedSchema,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const {actionId, type } = validationResult.params!;
    const userId = validationResult.session?.user?.id

    if (!userId) handleError(new Error("Unauthorized")) as ErrorResponse;

    try {
        const vote = await Vote.findOne({
            author: userId,
            type,
            actionId
        })
        if (!vote) {
            return {success: false, data: {hasUpvoted: false, hasDownvoted: false}};
        }

        const isUpvoted = vote.voteType === 'upvote'

        return {success: true, data: {hasUpvoted: isUpvoted, hasDownvoted: !isUpvoted}};
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}