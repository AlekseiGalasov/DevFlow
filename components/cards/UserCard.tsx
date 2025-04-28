import Link from "next/link";
import React from 'react';

import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constans/routes";

interface UserCardProps {
    _id: string,
    email: string,
    image?: string,
    username: string,
    name: string,
}

const UserCard = ({username, name, email, _id, image}: UserCardProps) => {

    return (
        <Link className="flex-between flex gap-2" href={ROUTES.PROFILE(_id)}>
            <article className='background-light900_dark200 light-border flex w-full flex-col items-center justify-center gap-4 rounded-2xl border p-8 sm:w-[230px]'>
                <UserAvatar
                   className='size-24'
                   id={_id}
                   imageUrl={image}
                   name={name}
                />
                <h3 className='h3-bold text-dark200_light900 line-clamp-1'>{username}</h3>
                <p className='small-medium text-dark400_light500'>
                    @{email}
                </p>
            </article>
        </Link>
    );
};

export default UserCard;