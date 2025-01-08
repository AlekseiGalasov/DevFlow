'use client'

import React, {EventHandler, useState} from 'react';
import {Input} from "@/components/ui/input";
import Image from "next/image";
import {useSearchParams} from "next/navigation";

interface LocalSearchProps {
    placeholder: string
    imagePath?: string
    otherClasses?: string
}

const LocalSearch = ({placeholder, imagePath, otherClasses}: LocalSearchProps) => {

    const searchParams = useSearchParams()
    const queryParams = searchParams.get('query') || ''

    const [search, setSearch] = useState(queryParams)

    return (
        <div className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4  rounded-[10px] px-4 ${otherClasses}`}>
            {
                imagePath && <Image src={imagePath} alt={'search'} width={24} height={24} />
            }
            <Input
                className='border-none no-focus paragraph-regular placeholder text-dark400_light700 shadow-none outline-none'
                type='text'
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
};

export default LocalSearch;