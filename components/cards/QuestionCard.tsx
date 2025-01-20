import Image from "next/image";
import Link from "next/link";
import React from 'react';

import TagCard from "@/components/cards/TagCard";
import ROUTES from "@/constans/routes";
import {getKCounts, getTimeStamp} from "@/lib/utils";

type TagsInterface = {
    _id: string,
    name: string
}

type AuthorInterface = {
    _id: string,
    name: string
}

interface QuestionInterface {
    _id: number
    title: string
    description: string
    tags: TagsInterface[]
    author: AuthorInterface
    upvotes: number
    answers: number
    views: number
    createdAt: Date
}

interface QuestionCardProps {
    className?: string
    questions: QuestionInterface
}

const QuestionCard = ({questions}: QuestionCardProps) => {


    return (
        <div className='background-light900_dark200 border-light-900_dark200 flex w-full flex-col gap-4 rounded-xl border-2 px-11 py-9 dark:border-none'>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(questions.createdAt)}
          </span>
            <Link href={ROUTES.ASK_QUESTION}>
                <h3 className='text-dark400_light700 h3-semibold'>{questions.title}</h3>
            </Link>
            <div className='flex flex-wrap gap-2'>
                {
                    questions.tags.map(tag => (
                        <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
                    ))
                }
            </div>
            <div className='flex flex-col flex-wrap justify-between gap-4 sm:flex-row'>
                <div className='text-dark400_light700 flex flex-row items-center gap-2 text-light-400'>
                    <Image className='invert-colors' src={'/icons/avatar.svg'} alt={'User icon'} width={20} height={20} />
                    <p className='body-medium'>{questions.author.name}</p>
                    <div className='size-[6px] rounded-lg bg-dark-300 dark:bg-light-700' />
                    <span className=' small-regular'>asked {getTimeStamp(questions.createdAt)}</span>
                </div>
                <div className='text-dark400_light700 flex flex-row items-center gap-2'>
                    <div className='flex gap-2'>
                        <Image src={'/icons/like.svg'} alt={'Like icon'} width={16} height={16} />
                        <p className='small-medium'>{getKCounts(questions.upvotes)} Votes</p>
                    </div>
                    <div className='flex gap-2'>
                        <Image src={'/icons/message.svg'} alt={'Message icon'} width={16} height={16} />
                        <p className='small-medium'>{getKCounts(questions.answers)} Answers</p>
                    </div>
                    <div className='flex gap-2'>
                        <Image src={'/icons/eye.svg'} alt={'Eye icon'} width={16} height={16} />
                        <p className='small-medium'>{getKCounts(questions.views)} Views</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;