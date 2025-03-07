import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import {Button} from "@/components/ui/button";
import ROUTES from "@/constans/routes";
import handleError from "@/lib/handlers/error";
import {api} from "@/lib/api";
import {GetAllQuestions} from "@/lib/actions/question.action";


const test = async () => {
    try {
        return await api.users.getAll()
    }catch (error) {
        return handleError(error)
    }
}

interface SearchParams {
    searchParams: Promise<{ [key: string]: string }>
}

const Home = async ({searchParams}: SearchParams) => {

    const {query} = await searchParams

    const {success, data} = await GetAllQuestions()

    const filteredQuestions = query === undefined ? data : data.filter(question => question.title.includes(query));

    console.log(filteredQuestions)

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
            <section className='mt-10 flex w-full flex-col gap-6'>
                {
                    filteredQuestions.map(question => (
                        <QuestionCard key={question._id} questions={question} />
                    ))
                }
            </section>
        </>
    );
}

export default Home