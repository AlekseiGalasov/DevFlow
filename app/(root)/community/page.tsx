import React from 'react';

import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import {UserFilters} from "@/constans/filters";
import {EMPTY_USERS} from "@/constans/states";
import {getAllUsers} from "@/lib/actions/user.actions";
import {RouteParams, User} from "@/types/global";

const Community = async ({searchParams}: RouteParams) => {

    const {query, filter, page, pageSize} = await searchParams

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
            <section className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
                <LocalSearch
                    placeholder='Search by profile name...'
                    imagePath='/icons/search.svg'
                    route='/tags'
                    otherClasses='flex-1'
                />
                <CommonFilter
                    filters={UserFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                    containerClasses="max-md:flex"
                />
            </section>
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
        </>
    );
};

export default Community;