import React from 'react';

import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import {TagFilters} from "@/constans/filters";
import {EMPTY_TAGS} from "@/constans/states";
import {getAllTags} from "@/lib/actions/tag.action";
import {RouteParams, Tag} from "@/types/global";

const Tags = async ({searchParams}: RouteParams) => {

    const {query, filter, page, pageSize} = await searchParams

    const {data, success, error} = await getAllTags({
        query: query || "",
        filter: filter || "",
        pageSize: Number(pageSize) || 10,
        page: Number(page) || 1,
    })

    const {tags} = data

    return (
        <>
            <h1 className='h1-bold text-dark-100_light900 text-3xl'>
                Tags
            </h1>
            <section className='mt-11'>
                <section className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
                    <LocalSearch
                        placeholder='Search by tag name...'
                        imagePath='/icons/search.svg'
                        route='/tags'
                        otherClasses='flex-1'
                    />
                    <CommonFilter
                        filters={TagFilters}
                        otherClasses="min-h-[56px] sm:min-w-[170px]"
                        containerClasses="max-md:flex"
                    />
                </section>
                <section>
                    <DataRenderer
                        success={success}
                        error={error}
                        data={tags}
                        empty={EMPTY_TAGS}
                        render={(tags: Tag[]) => (
                            <section className="mt-10 flex w-full flex-wrap gap-4">
                                {tags.map((tag: Tag) => (
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