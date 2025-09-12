import React from 'react';

import AnswerCard from "@/components/cards/AnswerCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import {AnswerPageFilters} from "@/constans/filters";
import {EMPTY_ANSWERS} from "@/constans/states";
import {ActionResponse, Answer} from "@/types/global";

interface AllAnswersProps extends ActionResponse<Answer[]>{
    totalAnswers: number
}

const AllAnswers = ({totalAnswers, data, success, error}: AllAnswersProps) => {
    return <div className='mt-11'>
        <div className='flex items-center justify-between'>
            <h3 className='primary-text-gradient'>{totalAnswers} {totalAnswers === 1 ? 'Answer' : 'Answers'}</h3>
            <CommonFilter
                filters={AnswerPageFilters}
                otherClasses="min-h-[56px] sm:min-w-[170px]"
                containerClasses="max-md:flex"
            />
        </div>
        <DataRenderer
            success={success}
            data={data}
            error={error}
            empty={EMPTY_ANSWERS}
            render={(answers) =>
                answers.map(answer => <AnswerCard key={answer._id} {...answer} />)
            } />
    </div>

};

export default AllAnswers;