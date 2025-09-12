import {SearchParams} from "next/dist/server/request/search-params";
import {redirect} from "next/navigation";
import React from 'react';

import {auth} from "@/auth";
import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import {CollectionPageFilters, HomePageFilters} from "@/constans/filters";
import ROUTES from "@/constans/routes";
import {EMPTY_QUESTION} from "@/constans/states";
import {GetAllUserCollection} from "@/lib/actions/collection.action";

const Collections = async (searchParams: SearchParams) => {

    const {query, filter, page, pageSize} = searchParams
    const session = await auth()

    if (!session) {
        redirect(ROUTES.SIGN_IN)
    }

    const {success, data, error} = await GetAllUserCollection({
        query: query || "",
        filter: filter || "",
        pageSize: Number(pageSize) || 10,
        page: Number(page) || 1,
    });

    const {collection, isNext} = data

    return (
        <>
            <section className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
                <h2 className='h1-bold text-dark100_light900'>Collection</h2>
            </section>
            <section className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
                <LocalSearch
                    placeholder='Local search'
                    imagePath='/icons/search.svg'
                    route='/'
                />
                <CommonFilter
                    filters={CollectionPageFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                    containerClasses="max-md:flex"
                />
            </section>
            <HomeFilter route='/'/>
            <DataRenderer
                success={success}
                error={error}
                data={collection}
                empty={EMPTY_QUESTION}
                render={(collection) => (
                    <div className="mt-10 flex w-full flex-col gap-6">
                        {collection.map((item) => (
                            <QuestionCard key={item._id} question={item.question}/>
                        ))}
                    </div>
                )}
            />
        </>
    );
};

export default Collections;