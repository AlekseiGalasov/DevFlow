import Link from "next/link";
import {notFound, redirect} from "next/navigation";
import React, {Suspense} from 'react';

import {auth} from "@/auth";
import AllAnswers from "@/components/answers/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/Metric";
import {Button} from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/votes/Votes";
import ROUTES from "@/constans/routes";
import {getAnswersByQuestionId} from "@/lib/actions/answer.action";
import {GetQuestionById} from "@/lib/actions/question.action";
import {hasVoted} from "@/lib/actions/vote.action";
import {getKCounts, getTimeStamp} from "@/lib/utils";
import {RouteParams, Tag} from "@/types/global";


const QuestionDetails = async ({params}: RouteParams) => {

    const {id} = await params

    if (!id) return notFound();

    const session = await auth()

    if (!session) {
        return redirect("/sign-in");
    }

    const {success: questionSuccess, data: question} = await GetQuestionById({questionId: id})

    if (!questionSuccess || !question) return redirect("/404");

    const hasVotedPromise = hasVoted({actionId: question._id, type: 'question'})

    const {success: answersSuccess, data: answers, error: answersError} = await getAnswersByQuestionId({
        questionId: id,
        filter: 'popular',
        page: 1,
        pageSize: 10
    })

    const isAuthor = session.user.id === question.author._id

    return (
        <>
            <div className='flex-start w-full flex-col'>
                <div className='flex w-full flex-col-reverse justify-between'>
                    <div className='flex items-center gap-1'>
                        <UserAvatar
                            id={question.author._id}
                            name={question.author.name}
                            imageUrl={question.author.image}
                            className='size-[22px]'
                            fallbackClassName='text-[10px]'
                        />
                        <Link className='paragraph-semibold text-dark300_light700'
                              href={ROUTES.PROFILE(question.author._id)}>
                            {question.author.name}
                        </Link>
                        {isAuthor && <Button asChild className='primary-gradient ml-auto px-4 py-3 !text-light-900'>
                            <Link href={ROUTES.EDIT_QUESTION(id)}>
                                Edit a question
                            </Link>
                        </Button>}
                    </div>
                    <div className='flex justify-end'>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Votes
                                upvotes={question.upvotes}
                                downvotes={question.downvotes}
                                hasVotedPromise={hasVotedPromise}
                                type='question'
                                actionId={question._id}
                            />
                        </Suspense>
                    </div>
                </div>
                <h2 className='h2-semibold text-dark200_light900 mt-3.5 w-full'>{question.title}</h2>
            </div>
            <div className='mb-8 mt-5 flex flex-wrap gap-4'>
                <Metric
                    imgUrl={'/icons/clock.svg'}
                    alt={'clock icon'}
                    value={`asked ${getTimeStamp(new Date(question.createdAt))}`}
                    title=''
                    textStyles='small-regular text-dark400_light700'
                />
                <Metric
                    imgUrl={'/icons/message.svg'}
                    alt={'message icon'}
                    value={question.answers}
                    title=''
                    textStyles='small-regular text-dark400_light700'
                />
                <Metric
                    imgUrl={'/icons/eye.svg'}
                    alt={'eye icon'}
                    value={getKCounts(question.views)}
                    title=''
                    textStyles='small-regular text-dark400_light700'
                />
            </div>
            <Preview content={question.content}/>
            <div className='mt-8 flex flex-wrap gap-2'>
                {question && question.tags.map((tag: Tag) => (
                    <TagCard compact key={tag._id} question={tag.questions} _id={tag._id} name={tag.name}/>
                ))}
            </div>
            <section>
                <AllAnswers
                    data={answers?.answers}
                    success={answersSuccess}
                    error={answersError}
                    totalAnswers={answers?.totalAnswers || 0}
                />
            </section>
            <AnswerForm questionTitle={question.title} questionContent={question.content} questionId={question._id}/>
        </>
    );
};

export default QuestionDetails;