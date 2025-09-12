import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import {Button} from "@/components/ui/button";
import {HomePageFilters} from "@/constans/filters";
import ROUTES from "@/constans/routes";
import {EMPTY_QUESTION} from "@/constans/states";
import {GetAllQuestions} from "@/lib/actions/question.action";

interface SearchParams {
    searchParams: Promise<{ [key: string]: string }>
}

const Home = async ({searchParams}: SearchParams) => {

    const {query, filter, page, pageSize} = await searchParams

    const {success, data, error} = await GetAllQuestions({
        query: query || "",
        filter: filter || "",
        pageSize: Number(pageSize) || 10,
        page: Number(page) || 1,
    });

    const {questions, isNext} = data

    return (
        <>
            <section className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
                <h2 className='h1-bold text-dark100_light900'>All questions</h2>
                <Button asChild className='primary-gradient min-h-[46px] px-4 py-3 !text-light-900'>
                    <Link href={ROUTES.ASK_QUESTION}>
                        Ask a question
                    </Link>
                </Button>
            </section>
            <section className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
                <LocalSearch
                    placeholder='Local search'
                    imagePath='/icons/search.svg'
                    route='/'
                />
                <CommonFilter
                    filters={HomePageFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                    containerClasses="max-md:flex"
                />
            </section>
            <HomeFilter route='/'/>
            <DataRenderer
                success={success}
                error={error}
                data={questions}
                empty={EMPTY_QUESTION}
                render={(questions) => (
                    <div className="mt-10 flex w-full flex-col gap-6">
                        {questions.map((question) => (
                            <QuestionCard key={question._id} question={question}/>
                        ))}
                    </div>
                )}
            />
        </>
    );
}

export default Home