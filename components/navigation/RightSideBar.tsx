import Image from "next/image";
import Link from "next/link";
import React from 'react';

import TagCard from "@/components/cards/TagCard";
import ROUTES from "@/constans/routes";
import {getTopTags} from "@/lib/actions/tag.action";
import {Tag} from "@/types/global";


const hotQuestions = [
    {_id: '1', title: 'test 1'},
    {_id: '2', title: 'test 2'},
    {_id: '3', title: 'test 3'},
    {_id: '4', title: 'test 4'},
    {_id: '5', title: 'test 5'}
]

const RightSideBar = async () => {

    const {data} = await getTopTags()

    const {tags} = data

    return (
        <section className='custom-scrollbar background-light900_dark200 light-border sticky
         right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6
         pt-36 shadow-light-300 dark:shadow-none max-lg:hidden'>
            <div>
                <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
                <div className='my-7 flex w-full flex-col gap-[30px]'>
                    {
                        hotQuestions.map(({_id, title}) => (
                            <Link key={_id} href={ROUTES.ASK_QUESTION}
                                  className="flex cursor-pointer items-center justify-between gap-7">
                                <p className="body-medium text-dark500_light700">{title}</p>
                                <Image
                                    src="/icons/chevron-right.svg"
                                    alt="Chevron"
                                    width={20}
                                    height={20}
                                    className="invert-colors"
                                />
                            </Link>
                        ))
                    }
                </div>
                <h3 className="h3-bold text-dark200_light900 mt-16">Top Tags</h3>
                <div className='mt-7 flex w-full flex-col gap-[30px]'>
                    {
                        tags && tags.length > 0 && tags.map((tag: Tag) => (
                            <TagCard key={tag._id} showCount compact name={tag.name} question={tag.questions} _id={tag._id}/>
                        ))
                    }
                </div>
            </div>
        </section>
    );
};

export default RightSideBar;