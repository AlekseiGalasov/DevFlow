import Image from "next/image";
import Link from "next/link";
import React from 'react';

import TagCard from "@/components/cards/TagCard";
import Metric from "@/components/Metric";
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
                    <Metric
                        imgUrl={question.author.image}
                        alt={question.author.name}
                        value={question.author.name}
                        title={`• asked ${getTimeStamp( new Date(question.createdAt))}`}
                        href={ROUTES.PROFILE(question.author._id)}
                        textStyles="body-medium text-dark400_light700"
                        isAuthor
                    />
                </div>
                <div className='text-dark400_light700 flex flex-row items-center gap-2'>
                    <Metric
                        imgUrl="/icons/like.svg"
                        alt="like"
                        value={getKCounts(question.upvotes)}
                        title=" Votes"
                        textStyles="small-medium text-dark400_light800"
                    />
                    <Metric
                        imgUrl="/icons/message.svg"
                        alt="answers"
                        value={getKCounts(question.answers)}
                        title=" Answers"
                        textStyles="small-medium text-dark400_light800"
                    />
                    <Metric
                        imgUrl="/icons/eye.svg"
                        alt="views"
                        value={getKCounts(question.views)}
                        title=" Views"
                        textStyles="small-medium text-dark400_light800"
                    />
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;