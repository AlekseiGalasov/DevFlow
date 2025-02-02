import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import {Button} from "@/components/ui/button";
import ROUTES from "@/constans/routes";
import logger from "@/lib/handlers/logger";

const questions = [
    {
        _id: "1",
        title: "The Lightning Component c:LWC_PizzaTracker generated invalid output for field status. Error How to solve this",
        description: "I want to learn React, can anyone help me?",
        tags: [
            {_id: "1", name: "React"},
            {_id: "2", name: "JavaScript"},
        ],
        author: {_id: "1", name: "John Doe"},
        upvotes: 10,
        answers: 5,
        views: 1200000,
        createdAt: new Date(2024, 11, 11),
    },
    {
        _id: "2",
        title: "How to learn JavaScript?",
        description: "I want to learn JavaScript, can anyone help me?",
        tags: [
            {_id: "1", name: "React"},
            {_id: "2", name: "JavaScript"},
        ],
        author: {_id: "1", name: "John Doe"},
        upvotes: 1000,
        answers: 5235,
        views: 1200,
        createdAt: new Date(2020, 8, 25),
    },
    {
        _id: "3",
        title: "How to learn JavaScript?",
        description: "I want to learn JavaScript, can anyone help me?",
        tags: [
            {_id: "1", name: "React"},
            {_id: "2", name: "JavaScript"},
            {_id: "3", name: "HTML"},
            {_id: "4", name: "CSS"},
        ],
        author: {_id: "1", name: "SimonEblo"},
        upvotes: 1000,
        answers: 5235,
        views: 1200,
        createdAt: new Date(),
    },
];

interface SearchParams {
    searchParams: Promise<{ [key: string]: string }>
}

const Home = async ({searchParams}: SearchParams) => {

    const {query} = await searchParams

    const filteredQuestions = query === undefined ? questions : questions.filter(question => question.title.includes(query));

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