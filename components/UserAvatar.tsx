import Link from "next/link";
import React from 'react';

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import ROUTES from "@/constans/routes";
import {cn} from "@/lib/utils";

interface UserAvatarProps {
    id: string
    name: string
    imageUrl?: string
    className?: string
    fallbackClassName?: string
}

const UserAvatar = ({id, name, imageUrl, className = 'h-9 w-9', fallbackClassName = ''}: UserAvatarProps) => {

    const initials = name.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2)

    return (
        <Link className='align-center flex items-center gap-4' href={ROUTES.PROFILE(id)}>
            <Avatar className={className}>
                <AvatarImage src={imageUrl} />
            </Avatar>
            <p className={cn("max-lg:hidden", fallbackClassName)}>{name}</p>
        </Link>
    );
};

export default UserAvatar