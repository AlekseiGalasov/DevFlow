import Image from "next/image";
import Link from "next/link";
import React from 'react';

import {Badge} from "@/components/ui/badge"
import ROUTES from "@/constans/routes";
import {cn, getDeviconClassName, getTechDescription} from "@/lib/utils";

interface TagCardProps {
    _id: string;
    name: string;
    question?: number;
    showCount?: boolean;
    compact?: boolean;
    remove?: boolean
    isButton?: boolean
    handleRemove?: () => void
}

const TagCard = ({name, _id, question, compact, showCount, handleRemove, remove, isButton}: TagCardProps) => {

    const iconClass = getDeviconClassName(name)

    const preventHandler = (e: React.MouseEvent) => {
        e.preventDefault()
    }

    const content = (
        <>
            <Badge className="subtle-medium background-light800_dark300 flex flex-row gap-2 rounded-md border-none px-4 py-2 uppercase" variant="outline">
                <div className="flex-center space-x-2">
                    <i className={`${iconClass} text-sm`}/>
                    <span>{name}</span>
                </div>
                {
                    remove && (
                        <Image
                            src={'/icons/close.svg'}
                            alt={'close icon'}
                            width={12}
                            height={12}
                            className='cursor-pointer object-contain invert-0 dark:invert'
                            onClick={handleRemove}
                        />
                    )
                }
            </Badge>
            {
                showCount && <p className='small-medium text-dark500_light700'>{question}</p>
            }
        </>
    )

    if (compact) {
        return isButton ? (
            <button onClick={preventHandler} className='flex justify-between gap-2'>
                {content}
            </button>
        ) : (
            <Link className="flex-between flex gap-2" href={ROUTES.TAG(_id)}>
                {content}
            </Link>
        )

    }

    return (
        <Link href={ROUTES.TAG(_id)} className='shadow-light-100_darknone'>
            <article className='background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]'>
                <div className='flex items-center justify-between gap-3'>
                    <div className='background-light800_dark400 w-fit rounded-sm px-5 py-1.5'>
                        <p className='paragraph-semibold text-dark300_light900'>{name}</p>
                    </div>
                    <i className={cn(iconClass, "text-2xl")} aria-hidden="true" />
                </div>
                <p className='small-regular text-dark500_light700 mt-5 line-clamp-3 w-full'>{getTechDescription(name)}</p>
                <p className='small-medium text-dark400_light500 mt-3.5'>
                    <span className='body-semibold primary-text-gradient mr-2.5'>
                        {question}+
                    </span>
                    Questions
                </p>
            </article>
        </Link>
    )
};

export default TagCard;