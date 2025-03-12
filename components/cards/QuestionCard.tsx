import Image from "next/image";
import Link from "next/link";
import React from 'react';

import TagCard from "@/components/cards/TagCard";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constans/routes";
import {getKCounts, getTimeStamp} from "@/lib/utils";
import {Question} from "@/types/global";

interface Props {
    question: Question;
}

const QuestionCard = ({question}: Props) => {

    return (
        <div className='background-light900_dark200 border-light-900_dark200 flex w-full flex-col gap-4 rounded-xl border-2 px-11 py-9 dark:border-none'>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(new Date(question.createdAt))}
          </span>
            <Link href={ROUTES.QUESTION(question._id)}>
                <h3 className='text-dark400_light700 h3-semibold'>{question.title}</h3>
            </Link>
            <div className='flex flex-wrap gap-2'>
                {
                    question.tags.map(tag => (
                        <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
                    ))
                }
            </div>
            <div className='flex flex-col flex-wrap justify-between gap-4 sm:flex-row'>
                <div className='text-dark400_light700 flex flex-row items-center gap-2 text-light-400'>
                    <UserAvatar
                        className='size-[22px]'
                        fallbackClassName='text-[12px]'
                        id={question.author._id}
                        name={question.author.name}
                        imageUrl={question.author.image}
                    />
                    <div className='size-[6px] rounded-lg bg-dark-300 dark:bg-light-700' />
                    <span className='small-regular'>asked {getTimeStamp(new Date(question.createdAt))}</span>
                </div>
                <div className='text-dark400_light700 flex flex-row items-center gap-2'>
                    <div className='flex gap-2'>
                        <Image src={'/icons/like.svg'} alt={'Like icon'} width={16} height={16} />
                        <p className='small-medium'>{getKCounts(question.upvotes)} Votes</p>
                    </div>
                    <div className='flex gap-2'>
                        <Image src={'/icons/message.svg'} alt={'Message icon'} width={16} height={16} />
                        <p className='small-medium'>{getKCounts(question.answers)} Answers</p>
                    </div>
                    <div className='flex gap-2'>
                        <Image src={'/icons/eye.svg'} alt={'Eye icon'} width={16} height={16} />
                        <p className='small-medium'>{getKCounts(question.views)} Views</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;