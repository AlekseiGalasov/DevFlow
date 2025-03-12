import {notFound} from "next/navigation";
import React from 'react';

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constans/routes";
import {EMPTY_QUESTION} from "@/constans/states";
import {getQuestionsByTag} from "@/lib/actions/tag.action";
import {RouteParams} from "@/types/global";

const Page = async ({searchParams, params}: RouteParams) => {

    const { id } = await params
    const { page, pageSize, query } = await searchParams

    if (!id) {
        notFound()
    }

    const {data, success, error} = await getQuestionsByTag({
        query: query || "",
        pageSize: Number(pageSize) || 10,
        page: Number(page) || 1,
        tagId: id
    })

    const {tag, isNext, questions} = data

    return (
        <>
            <section className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
                <h2 className='h1-bold text-dark100_light900'>{tag.name}</h2>
            </section>
            <LocalSearch
                placeholder='Local search'
                imagePath='/icons/search.svg'
                route={ROUTES.TAG(tag._id)}
            />
            <DataRenderer
                success={success}
                error={error}
                data={questions}
                empty={EMPTY_QUESTION}
                render={(questions) => (
                    <div className="mt-10 flex w-full flex-col gap-6">
                        {questions.map((question) => (
                            <QuestionCard key={question._id} question={question} />
                        ))}
                    </div>
                )}
            />
        </>
    );
};

export default Page;