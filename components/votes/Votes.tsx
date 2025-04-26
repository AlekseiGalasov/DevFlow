'use client'

import Image from 'next/image'
import {useSession} from "next-auth/react";
import React, {useState} from 'react';

import {toast} from "@/hooks/use-toast";
import {createVote} from "@/lib/actions/vote.action";
import {getKCounts} from "@/lib/utils";

interface VotesProps {
    upvotes: number
    downvotes: number
    hasupVoted: boolean
    hasdownVoted: boolean
    type: "question" | "answer"
    actionId: string
}

const Votes = (props: VotesProps) => {

    const [isLoading, setIsLoading] = useState(false)
    const {hasdownVoted, hasupVoted, upvotes, downvotes, type, actionId} = props
    const session = useSession()
    const userId = session.data?.user?.id

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
                `Upvote ${!hasupVoted ? 'added' : 'removed'} successfully` :
                `Downvote ${!hasdownVoted ? 'added' : 'removed'} successfully`

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
                    src={hasupVoted ? '/icons/upvoted.svg' : '/icons/upvote.svg'}
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
                    src={hasdownVoted ? '/icons/downvoted.svg' : '/icons/downvote.svg'}
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