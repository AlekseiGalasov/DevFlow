"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {MDXEditorMethods} from "@mdxeditor/editor";
import {ReloadIcon} from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from 'next/image'
import React, {useRef, useState} from "react";
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormMessage,} from "@/components/ui/form"
import {AnswerSchema} from "@/lib/validation";

const Editor = dynamic(() => import('@/components/editor'), {
    ssr: false
})

const AnswerForm = () => {

    const [isSubmitting, setIsSubmitting] = useState(true)
    const [isAiSubmitting, setIsAiSubmitting] = useState(false)

    const editorRef = useRef<MDXEditorMethods>(null)
    const form = useForm<z.infer<typeof AnswerSchema>>({
        resolver: zodResolver(AnswerSchema),
        defaultValues: {content: ''}
    })

    const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {

        console.log(values)
        // if (result?.success) {
        //     toast({
        //         title: `Success`,
        //         description: formType === 'SIGN_UP' ? 'Signed in successfully' : 'Signed up successfully' ,
        //     })
        //     router.push(ROUTES.HOME)
        // } else {
        //     toast({
        //         title: `Error ${result.status}`,
        //         description: `Error ${result.error?.message}`,
        //         variant: 'destructive'
        //     })
        // }
    }

    return (
        <div className='mt-8'>
            <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                <h4 className='paragraph-semibold text-dark400_light800'>Write your answer here</h4>
                <Button
                    className='btn light-border-2 border-md gap-1.5 border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500' disabled={isAiSubmitting}>
                    {isAiSubmitting ?
                        <>
                            <ReloadIcon className="mr-2 size-4 animate-spin"/>
                            Generate
                        </>
                        :
                        <>
                            <Image
                                src='/icons/stars.svg'
                                alt='Generate Ai answer'
                                width='12'
                                height='12'
                                className='object-contain'
                            />{" "}
                            Generate AI Answer
                        </>
                    }
                </Button>
            </div>
            <Form {...form}>
                <form action={form.handleSubmit(handleSubmit)} className="mt-10 space-y-8">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Editor value={field.value} editorRef={editorRef} fieldChange={field.onChange}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className='flex justify-end'>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="primary-gradient w-fit"
                        >
                            {isSubmitting ?
                                <>
                                    <ReloadIcon className="mr-2 size-4 animate-spin"/>
                                    Posting
                                </>
                                : 'Post answer'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
};

export default AnswerForm;