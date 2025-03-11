import React from 'react';
import {getAllTags} from "@/lib/actions/tag.action";
import {RouteParams} from "@/types/global";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import DataRenderer from "@/components/DataRenderer";
import {EMPTY_QUESTION, EMPTY_TAGS} from "@/constans/states";
import QuestionCard from "@/components/cards/QuestionCard";
import TagCard from "@/components/cards/TagCard";

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
        <div>
            <LocalSearch
                placeholder='Local search'
                imagePath='/icons/search.svg'
                route='/tags'
            />
            <HomeFilter route='/tags'/>
            <section>
            <DataRenderer
                success={success}
                error={error}
                data={tags}
                empty={EMPTY_TAGS}
                render={(tags) => (
                    <div className="mt-10 flex w-full flex-col gap-6">
                        {tags.map((tag) => (
                            <TagCard question={tag.questions} showCount key={tag._id} _id={tag._id} name={tag.name} compact />
                        ))}
                    </div>
                )}
            />
            </section>
        </div>
    );
};

export default Tags;