import React from 'react';

import QuestionCard from "@/components/cards/QuestionCard";
import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import {EMPTY_QUESTION, EMPTY_TAGS} from "@/constans/states";
import {getAllTags} from "@/lib/actions/tag.action";
import {RouteParams} from "@/types/global";

const Tags = async ({searchParams}: RouteParams) => {

    const {query, filter, page, pageSize} = await searchParams

    const {data, success, error} = await getAllTags({
        query: query || "",
        filter: filter || "",
        pageSize: Number(pageSize) || 10,
        page: Number(page) || 1,
    })

    const {tags, isNext} = data

    return (
        <>
            <h1 className='h1-bold text-dark-100_light900 text-3xl'>
                Tags
            </h1>
            <section className='mt-11'>
                <LocalSearch
                    placeholder='Search by tag name...'
                    imagePath='/icons/search.svg'
                    route='/tags'
                    otherClasses='flex-1'
                />
                <HomeFilter route='/tags'/>
                <section>
                    <DataRenderer
                        success={success}
                        error={error}
                        data={tags}
                        empty={EMPTY_TAGS}
                        render={(tags) => (
                            <section className="mt-10 flex w-full flex-wrap gap-4">
                                {tags.map((tag) => (
                                    <TagCard key={tag._id} question={tag.questions} _id={tag._id} name={tag.name} />
                                ))}
                            </section>
                        )}
                    />
                </section>
            </section>
        </>
    );
};

export default Tags;