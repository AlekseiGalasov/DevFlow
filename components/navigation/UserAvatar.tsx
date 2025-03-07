import React from 'react';
import Link from "next/link";
import ROUTES from "@/constans/routes";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";

interface UserAvatarProps {
    id: string
    name: string
    imageUrl?: string
    className?: string
}

const UserAvatar = ({id, name, imageUrl, className = 'h-9 w-9'}: UserAvatarProps) => {

    const initials = name.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2)

    return (
        <Link className='flex gap-4 align-center items-center' href={ROUTES.PROFILE(id)}>
            <Avatar className={className}>
                <AvatarImage src={imageUrl} />
                <AvatarFallback className='primary-gradient font-space-grotesk font-bold tracking-wider text-white'>{initials}</AvatarFallback>
            </Avatar>
            <p className="base-medium max-lg:hidden">{name}</p>
        </Link>
    );
};

export default UserAvatar