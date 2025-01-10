'use client'

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import React, {useState} from 'react';

import {Button} from "@/components/ui/button";
import {formUrlQuery, removeKeysFromQuery} from "@/lib/url";
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
                value,
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
        <section className='mt-10 flex hidden flex-wrap gap-3 sm:flex'>
            {
                filters.map(elem => (
                    <Button
                        onClick={() => handleFilters(elem.value)}
                        key={elem._id}
                        className={cn( filter === elem.value
                            ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
                            : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
                            , "body-medium rounded-lg px-6 py-3 capitalize shadow-none")}
                    >
                            {elem.name}
                    </Button>
                ))
            }
        </section>
    );
};

export default HomeFilter;