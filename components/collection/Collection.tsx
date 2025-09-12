'use client'

import Image from "next/image";
import { useSession } from "next-auth/react";
import React, {use, useState} from 'react';

import {toast} from "@/hooks/use-toast";
import {AddOrRemoveToCollection} from "@/lib/actions/collection.action";
import {HasCollectionResponse} from "@/types/action";
import {ActionResponse} from "@/types/global";


interface CollectionProps {
    questionId: string,
    hasCollectionPromise: Promise<ActionResponse<HasCollectionResponse>>
}


const Collection = ({questionId, hasCollectionPromise}: CollectionProps) => {

    const {error, data} = use(hasCollectionPromise)
    const [isLoading, setIsLoading] = useState(false)
    const session = useSession()
    const userId = session.data?.user?.id

    const handleCollection = async () => {
        if (isLoading) return;
        if (!userId) {
            toast({
                title: "You need to be logged in to save a question",
                variant: "destructive"
            })
        }

        setIsLoading(true)

        try {
            const result = await AddOrRemoveToCollection({questionId})
            const message = result?.data?.isAdded ?
                `Successfully added to collection` :
                `Successfully removed from collection`

            if (result?.success) {
                toast({
                    title: message,
                    description: 'Your collection has been updated'
                })
            }
        } catch {
            toast({
                title: 'Failed to add or remove from collection',
                description: 'An error occurred while try execute collection action. Please try again later',
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (error) {
        return null
    }

    return (
        <div className='flex-center mb-1.5 gap-2.5'>
            <div className='flex-center gap-1.5'>
                <Image
                    src={data?.haveInCollection ? '/icons/star-filled.svg' : '/icons/star.svg'}
                    alt='star'
                    height={18}
                    width={18}
                    className={`cursor-pointer `}
                    onClick={() => !isLoading && handleCollection()}
                />
            </div>
        </div>
    );
};

export default Collection;