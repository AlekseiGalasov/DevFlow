import React from 'react';

import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import {EMPTY_USERS} from "@/constans/states";
import {getAllUsers} from "@/lib/actions/user.actions";
import {RouteParams, User} from "@/types/global";

const Community = async ({searchParams}: RouteParams) => {

    const { query, filter, page, pageSize } = await searchParams

    const {data, success, error} = await getAllUsers({
        query: query || "",
        filter: filter || "",
        pageSize: Number(pageSize) || 10,
        page: Number(page) || 1,
    })

    const {users} = data

    return (
        <>
            <h1 className='h1-bold text-dark-100_light900 text-3xl'>
                Community
            </h1>
            <section className='mt-11'>
                <LocalSearch
                    placeholder='Search by profile name...'
                    imagePath='/icons/search.svg'
                    route='/tags'
                    otherClasses='flex-1'
                />
                <section>
                     <DataRenderer
                        success={success}
                        error={error}
                        data={users}
                        empty={EMPTY_USERS}
                        render={(users: User[]) => (
                            <section className="mt-10 flex w-full flex-wrap gap-4">
                                {users.map((user: User) => (
                                    <UserCard
                                        key={user._id}
                                        name={user.name}
                                        image={user.image}
                                        _id={user._id}
                                        username={user.username}
                                        email={user.email}
                                    />
                                ))}
                            </section>
                        )}
                     />
                </section>
            </section>
        </>
    );
};

export default Community;