import Image from "next/image";
import Link from "next/link";
import React from 'react';

import {Badge} from "@/components/ui/badge"
import ROUTES from "@/constans/routes";
import {getDeviconClassName} from "@/lib/utils";

interface TagCardProps {
    _id: string ;
    name: string;
    question?: string;
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
            <Link className="flex-between flex gap-2" href={ROUTES.TAGS(_id)}>
                {content}
            </Link>
        )

    }
};

export default TagCard;