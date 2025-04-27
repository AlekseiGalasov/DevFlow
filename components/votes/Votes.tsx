'use client'

import Image from 'next/image'
import {useSession} from "next-auth/react";
import React, {useState, use} from 'react';

import {toast} from "@/hooks/use-toast";
import {createVote} from "@/lib/actions/vote.action";
import {getKCounts} from "@/lib/utils";
import {HasVotedResponse} from "@/types/action";
import {ActionResponse} from "@/types/global";

interface VotesProps {
    upvotes: number
    downvotes: number
    type: "question" | "answer"
    actionId: string
    hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>
}

const Votes = (props: VotesProps) => {

    const [isLoading, setIsLoading] = useState(false)
    const {upvotes, downvotes, type, actionId, hasVotedPromise} = props
    const session = useSession()
    const userId = session.data?.user?.id
    const {success, data: vote} = use(hasVotedPromise)

    const {hasUpvoted, hasDownvoted} = vote

    const handleVote = async (voteType: 'upvote' | 'downvote') => {
        if (!userId) {
            return toast({
                title: 'Please login to vote',
                description: 'Only logged-in user can vote.'
            })
        }

        setIsLoading(true)

        try {
            const result = await createVote({type, voteType, actionId})
            const successMessage = voteType === 'upvote' ?
                `Upvote ${!hasUpvoted ? 'added' : 'removed'} successfully` :
                `Downvote ${!hasDownvoted ? 'added' : 'removed'} successfully`

            if (result?.success) {
                toast({
                    title: successMessage,
                    description: 'Your vote has been recorded'
                })
            }
        } catch {
            toast({
                title: 'Failed to vote',
                description: 'An error occured while voting. Please try again later',
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='flex-center mb-1.5 gap-2.5'>
            <div className='flex-center gap-1.5'>
                <Image
                    src={success && hasUpvoted ? '/icons/upvoted.svg' : '/icons/upvote.svg'}
                    alt='upvote'
                    height={18}
                    width={18}
                    className={`cursor-pointer ${isLoading && 'opacity-50'}`}
                    onClick={() => !isLoading &&  handleVote('upvote')}
                />
                <div className='flex-center background-light700_dark400 min-w-5 rounded-sm p-1'>
                    <p className='subtle-medium text-dark400_light900'>{getKCounts(upvotes)}</p>
                </div>
            </div>
            <div className='flex-center gap-1.5'>
                <Image
                    src={success && hasDownvoted ? '/icons/downvoted.svg' : '/icons/downvote.svg'}
                    alt='upvote'
                    height={18}
                    width={18}
                    className={`cursor-pointer ${isLoading && 'opacity-50'}`}
                    onClick={() => !isLoading && handleVote('downvote')}
                />
                <div className='flex-center background-light700_dark400 min-w-5 rounded-sm p-1'>
                    <p className='subtle-medium text-dark400_light900'>{getKCounts(downvotes)}</p>
                </div>
            </div>
        </div>
    );
};

export default Votes;