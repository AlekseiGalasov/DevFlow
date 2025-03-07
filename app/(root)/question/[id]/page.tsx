import React from 'react';
import {GetQuestionById} from "@/lib/actions/question.action";
import {auth} from "@/auth";
import {Button} from "@/components/ui/button";
import ROUTES from "@/constans/routes";
import Link from "next/link";
import {RouteParams} from "@/types/global";
import {notFound, redirect} from "next/navigation";

const QuestionDetails = async ({params}: RouteParams) => {

    const {id} = await params

    if (!id) return notFound();

    const session = await auth()

    if (!session) {
        return redirect("/sign-in");
    }

    const {success, data: question} = await GetQuestionById({questionId: id})

    if (!success) return notFound();

    const isAuthor = session.user.id === question.author._id

    return (
        <main>
            <section className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
                <h2 className='h1-bold text-dark100_light900'>{question.title}</h2>
                {isAuthor && <Button asChild className='primary-gradient min-h-[46px] px-4 py-3 !text-light-900'>
                    <Link href={ROUTES.EDIT_QUESTION(question._id)}>
                        Edit question
                    </Link>
                </Button>}
            </section>
        </main>
    );
};

export default QuestionDetails;