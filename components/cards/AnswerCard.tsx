import Link from "next/link";
import React from 'react';

import Preview from "@/components/editor/preview";
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/votes/Votes";
import ROUTES from "@/constans/routes";
import {hasVoted} from "@/lib/actions/vote.action";
import {getTimeStamp} from "@/lib/utils";
import {Answer} from "@/types/global";

const AnswerCard = async (answer: Answer) => {

    const {_id, upvotes, content, createdAt, author, downvotes} = answer

    const hasVotedPromise = hasVoted({actionId: _id, type: 'answer'})

    return (
        <article className='light-border border-b py-10'>
            <span className='hash-span' id={JSON.stringify(_id)}/>
            <div className='mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                <div className='flex flex-1 items-start gap-1 sm:items-center'>
                    <UserAvatar
                        id={author._id}
                        name={author.name}
                        imageUrl={author.image}
                        className='size-5 rounded-full object-cover max-sm:mt-2'
                    />
                    <Link href={ROUTES.PROFILE(author._id)}
                          className='flex flex-col max-sm:ml-1 sm:flex-row sm:items-center'>
                        <p className='body-semibold text-dark300_light700'>{author.name ?? 'Anonymous'}</p>
                        <p className='small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1'>
                            <span className='max-sm:hidden'>•</span>
                            answered {getTimeStamp(new Date(createdAt))}
                        </p>
                    </Link>
                </div>
                <div className='flex justify-end'>
                    <Votes
                        upvotes={upvotes}
                        downvotes={downvotes}
                        hasVotedPromise={hasVotedPromise}
                        type='answer'
                        actionId={_id}
                    />
                </div>
            </div>
            <Preview content={content}/>
        </article>
    );
};

export default AnswerCard;