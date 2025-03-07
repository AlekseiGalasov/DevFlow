import React from 'react';
import {RouteParams} from "@/types/global";
import {notFound, redirect} from "next/navigation";
import {GetQuestionById} from "@/lib/actions/question.action";
import {auth} from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";

const EditQuestionPage = async ({ params }: RouteParams) => {

    const {id} = await params

    if (!id) return notFound();

    const session = await auth();


    if (!session) return redirect("/sign-in");

    const {data: question, success} = await GetQuestionById({questionId: id})

    if (!success) return notFound();

    if (session.user.id !== question?.author?._id) {
        redirect('/')
    }

    return (
        <main>
            <QuestionForm question={question} isEdit />
        </main>
    );
};

export default EditQuestionPage;