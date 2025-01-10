'use client'

import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {formUrlQuery, LOCAL_SEARCH_DELAY, removeKeysFromQuery} from "@/lib/url";
import {cn} from "@/lib/utils";

const filters = [
    {_id: 1, name: 'Newest', value: 'newest'},
    {_id: 2, name: 'Oldest', value: 'oldest'},
    {_id: 3, name: 'Unanswered', value: 'unanswered'},
    {_id: 4, name: 'Popular', value: 'popular'},
]

const HomeFilter = ({route}) => {

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const filterParam = searchParams.get('filter') || ''
    const [filter, setFilter] = useState(filterParam)

    const handleFilters = (value) => {
        if (value !== filter) {
            setFilter(value)
            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                value: value,
                key: 'filter'
            })
            router.push(newUrl, {scroll: false})
        } else {
            setFilter('')
            if (pathname === route) {
                const newUrl = removeKeysFromQuery({
                    params: searchParams.toString(),
                    keysToRemove: ['filter'],
                })
                router.push(newUrl, {scroll: false})
            }
        }
    }

    return (
        <section className='flex hidden flex-wrap sm:flex gap-3 mt-10'>
            {
                filters.map(elem => (
                    <Button
                        onClick={() => handleFilters(elem.value)}
                        key={elem._id}
                        className={cn( filter === elem.value ? "primary-text-gradient background-dark-300_light900" : "text-dark-300_light900")}
                    >
                            {elem.name}
                    </Button>
                ))
            }
        </section>
    );
};

export default HomeFilter;