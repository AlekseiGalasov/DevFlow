import Image from "next/image"
import Link from "next/link";
import React from 'react';

import {Avatar, AvatarFallback} from "@/components/ui/avatar";
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
        <Link href={ROUTES.PROFILE(id)}>
            <Avatar className={cn('relative', className)}>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        className="object-cover"
                        quality={100}
                        fill
                    />
                ) : (
                    <AvatarFallback className={cn("primary-gradient font-space-grotesk font-bold tracking-wider text-white", fallbackClassName)}>
                        {initials}
                    </AvatarFallback>
                )}
            </Avatar>
        </Link>
    );
};

export default UserAvatar