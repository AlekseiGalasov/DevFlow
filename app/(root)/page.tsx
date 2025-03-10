import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import {Button} from "@/components/ui/button";
import ROUTES from "@/constans/routes";
import {GetAllQuestions} from "@/lib/actions/question.action";

interface SearchParams {
    searchParams: Promise<{ [key: string]: string }>
}

const Home = async ({searchParams}: SearchParams) => {

    const {query, filter, page, pageSize} = await searchParams

    const { success, data, error } = await GetAllQuestions({
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
            <LocalSearch
                placeholder='Local search'
                imagePath='/icons/search.svg'
                route='/'
            />
            <HomeFilter route='/' />
            {
                success ?
                    <section className='mt-10 flex w-full flex-col gap-6'>
                        {
                            questions && questions.length ? questions.map(question => (
                                <QuestionCard key={question._id} questions={question}/>
                            )) : (
                                <div className='mt-10 flex w-full items-center justify-center'>
                                    <p className='text-dark400_light700'>No questions found</p>
                                </div>
                            )
                        }
                        {
                            isNext && <p>Pagination!!!</p>
                        }
                    </section> :
                    <section className='mt-10 flex w-full items-center justify-center'>
                        <p className='text-dark400_light700'>{error?.message || 'Failed to fetch questions'}</p>
                    </section>
            }
        </>
    );
}

export default Home