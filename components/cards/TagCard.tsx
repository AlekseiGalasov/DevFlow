import React from 'react';
import {Badge} from "@/components/ui/badge"
import Link from "next/link";
import ROUTES from "@/constans/routes";
import {getDeviconClassName} from "@/lib/utils";

interface TagCardProps {
    _id: string;
    name: string;
    question: string;
    showCount?: boolean;
    compact?: boolean;
}

const TagCard = ({name, _id, question, compact, showCount}: TagCardProps) => {

    const iconClass = getDeviconClassName(name)

    return (
        <Link className="flex flex-between gap-2" href={ROUTES.TAGS(_id)}>
            <Badge className="subtle-medium background-light800_dark300 rounded-md py-2 px-4 border-none uppercase" variant="outline">
                <div className="flex-center space-x-2">
                    {compact && <i
                        className={`${iconClass} text-sm`}
                    />}
                    <span>{name}</span>
                </div>
            </Badge>
            {
                showCount && <p className='small-medium text-dark500_light700'>{question}</p>
            }
        </Link>
    );
};

export default TagCard;