import React from 'react';

import QuestionForm from "@/components/forms/QuestionForm";

const AskQuestion = () => {
    return (
        <>
            <h1 className='h1-bold text-dark100_light900'>Ask a question</h1>
            <section className='mt-9'>
                <QuestionForm />
            </section>
        </>
    );
};

export default AskQuestion;