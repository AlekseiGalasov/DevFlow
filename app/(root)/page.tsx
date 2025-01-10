import {Button} from "@/components/ui/button";
import ROUTES from "@/constans/routes";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";

const questions = [
    {
        _id: "1",
        title: "How to learn React?",
        description: "I want to learn React, can anyone help me?",
        tags: [
            {_id: "1", name: "React"},
            {_id: "2", name: "JavaScript"},
        ],
        author: {_id: "1", name: "John Doe"},
        upvotes: 10,
        answers: 5,
        views: 100,
        createdAt: new Date(),
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
        upvotes: 10,
        answers: 5,
        views: 100,
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
                    <Link href={ROUTES.ASK_QUESTION('1')}>
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
                        <div key={question._id}>
                            <p>{question.title}</p>
                            <p>{question.description}</p>
                            <p>{question.author.name}</p>
                        </div>
                    ))
                }
            </section>
        </>
    );
}

export default Home