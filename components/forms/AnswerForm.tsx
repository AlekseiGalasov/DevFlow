"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {MDXEditorMethods} from "@mdxeditor/editor";
import {ReloadIcon} from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from 'next/image'
import {useSession} from "next-auth/react";
import React, {useRef, useState, useTransition} from "react";
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormMessage,} from "@/components/ui/form"
import {toast} from "@/hooks/use-toast";
import {createAnswer} from "@/lib/actions/answer.action";
import {api} from "@/lib/api";
import {AnswerSchema} from "@/lib/validation";

const Editor = dynamic(() => import('@/components/editor'), {
    ssr: false
})

interface AnswerFormProps {
    questionTitle: string
    questionContent: string
    questionId: string
}

const AnswerForm = ({questionId, questionTitle, questionContent}: AnswerFormProps) => {

    const [isAnswering, startAnsweringTransition] = useTransition()
    const [isAiSubmitting, setIsAiSubmitting] = useState(false)
    const session = useSession();

    const editorRef = useRef<MDXEditorMethods>(null)
    const form = useForm<z.infer<typeof AnswerSchema>>({
        resolver: zodResolver(AnswerSchema),
        defaultValues: {content: ''}
    })

    const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
        startAnsweringTransition(async () => {
            const result = await createAnswer({ questionId, content: values.content })
            if (result?.success) {
                toast({
                    title: `Success`,
                    description: 'Answer created!',
                })
                if (editorRef.current) {
                    editorRef.current.setMarkdown('')
                }
            } else {
                toast({
                    title: `Error ${result.status}`,
                    description: `Error ${result.error?.message}`,
                    variant: 'destructive'
                })
            }
        })
    }

    const generateAIanswer = async () => {

        if (session.status !== 'authenticated') {
            return toast({
                title: 'Please log in',
                description: 'You need to be logged in to use this feature'
            })
        }
        setIsAiSubmitting(true)

        const userAnswer = editorRef.current?.getMarkdown();

        try {
            const {success, data, error} = await api.ai.getAnswer(questionTitle, questionContent, userAnswer)

            if (!success) {
                return toast({
                    title: 'Error',
                    description: error?.message,
                    variant: 'destructive'
                })
            }

            const formmatedAnswer = data.replace(/<br>/g, " ").toString().trim();

            if (editorRef.current) {
                editorRef.current.setMarkdown(formmatedAnswer)
                form.setValue('content', formmatedAnswer)
                form.trigger('content')
            }

            toast({
                title: 'Success',
                description: 'AI answer successfully generated'
            })

        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'There was a problem with your request',
                variant: 'destructive'
            })
        } finally {
            setIsAiSubmitting(false)
        }
    }

    return (
        <div className='mt-8'>
            <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                <h4 className='paragraph-semibold text-dark400_light800'>Write your answer here</h4>
                <Button
                    onClick={generateAIanswer}
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
                            disabled={isAnswering}
                            className="primary-gradient w-fit"
                        >
                            {isAnswering ?
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