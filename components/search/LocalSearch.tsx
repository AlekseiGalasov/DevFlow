'use client'

import Image from "next/image";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import React, {useEffect, useState} from 'react';

import {Input} from "@/components/ui/input";
import {formUrlQuery, LOCAL_SEARCH_DELAY, removeKeysFromQuery} from "@/lib/url";

interface LocalSearchProps {
    placeholder: string
    imagePath?: string
    otherClasses?: string
    route: string
    iconPosition?: 'left' | 'right'
}

const LocalSearch = ({placeholder, imagePath, otherClasses, route, iconPosition = 'left'}: LocalSearchProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const queryParams = searchParams.get('query') || ''
    const [search, setSearch] = useState(queryParams)

    useEffect(() => {
        const debouncedFn = setTimeout(() => {
            if (search) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    value: search,
                    key: 'query'
                })
                router.push(newUrl, {scroll: false})
            } else {
                if (pathname === route) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ['query'],
                    })
                    router.push(newUrl, {scroll: false})
                }
            }
        }, LOCAL_SEARCH_DELAY)

        return () => {
            clearTimeout(debouncedFn)
        }
    }, [queryParams, search, router, pathname, route])


    return (
        <section
            className={`background-light800_darkgradient mt-11 flex min-h-[56px] grow items-center gap-4  rounded-[10px] px-4 ${otherClasses}`}>
            {
                iconPosition === 'left' && imagePath && <Image src={imagePath} alt={'search'} width={24} height={24}/>
            }
            <Input
                className='no-focus paragraph-regular placeholder text-dark400_light700 border-none shadow-none outline-none'
                type='text'
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {
                iconPosition === 'right' && imagePath && <Image src={imagePath} alt={'search'} width={24} height={24}/>
            }
        </section>
    );
};

export default LocalSearch;