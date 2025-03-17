'use client'

import {zodResolver} from "@hookform/resolvers/zod";
import {MDXEditorMethods} from "@mdxeditor/editor";
import {ReloadIcon} from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import {useRouter} from "next/navigation";
import React, {useRef, useTransition} from 'react';
import {useForm} from "react-hook-form";
import {z} from "zod";

import TagCard from "@/components/cards/TagCard";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import ROUTES from "@/constans/routes";
import {toast} from "@/hooks/use-toast";
import {CreateQuestion, EditQuestion} from "@/lib/actions/question.action";
import {AskQuestionSchema} from "@/lib/validation";
import {Question} from "@/types/global";

const Editor = dynamic(() => import('@/components/editor'), {
    ssr: false
})

interface QuestionFormProps {
    question?: Question
    isEdit?: boolean
}

const QuestionForm = ({question, isEdit}: QuestionFormProps) => {

    const editorRef = useRef<MDXEditorMethods>(null)
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof AskQuestionSchema>>({
        resolver: zodResolver(AskQuestionSchema),
        defaultValues: {
            title: question?.title || "",
            content: question?.content || "",
            tags: question?.tags.map((tag) => tag.name) || [],
        }
    })

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: { value: string[]}) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const tagInput = e.currentTarget.value.trim()
            if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
                form.setValue("tags", [...field.value, tagInput])
                e.currentTarget.value = ''
                form.clearErrors('tags')
            } else if (tagInput.length > 15) {
                form.setError("tags", {
                    type: 'manual',
                    message: 'Tag should be less than 15 characters'
                })
            } else if (field.value.includes(tagInput)) {
                form.setError("tags", {
                    type: 'manual',
                    message: 'Tag already exist'
                })
            }
        }
    }

    const handleTagRemove = (tag: string, field: {value: string[]}) => {
        const newTags = field.value.filter((t) => t !== tag)
        form.setValue('tags', newTags)
        if (!newTags.length) {
            form.setError("tags", {
                type: 'manual',
                message: 'Tags are required'
            })
        }
    }

    const handleCreateQuestion = async (data: z.infer<typeof AskQuestionSchema>) => {
        startTransition( async () => {
            let result
            if (isEdit && question) {
                result = await EditQuestion({...data, questionId: question?._id} as EditQuestionParams)
            } else {
                result = await CreateQuestion(data)
            }
            if (result?.success) {
                toast({
                    title: `Success`,
                    description: isEdit? 'Question Updated' : 'New question created',
                })
                router.push(ROUTES.HOME)
            } else {
                toast({
                    title: `Error ${result.status}`,
                    description: `Error ${result.error?.message}`,
                    variant: 'destructive'
                })
            }
        })
    }

    return (
        <Form {...form} >
            <form className='flex w-full flex-col gap-10' onSubmit={form.handleSubmit(handleCreateQuestion)}>
                <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light700">
                                Question Title <span className='text-primary-500'>*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    {...field}
                                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                                />
                            </FormControl>
                            <FormDescription className='body-regular mt-2.5 text-light-500'>
                                Be specific and imagine you&#39;re asking a question to another person.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='content'
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light700">
                                Detailed explanation of your problem <span className='text-primary-500'>*</span>
                            </FormLabel>
                            <FormControl>
                                <Editor value={field.value} editorRef={editorRef} fieldChange={field.onChange} />
                            </FormControl>
                            <FormDescription className='body-regular mt-2.5 text-light-500'>
                                Introduce the problem and expand on what you&#39;ve put in the title.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='tags'
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light700">
                                Tags <span className='text-primary-500'>*</span>
                            </FormLabel>
                            <FormControl>
                                <div>
                                    <Input
                                        placeholder="Add tags..."
                                        type='text'
                                        onKeyDown={(e) => handleInputKeyDown(e, field)}
                                        className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                                    />
                                    {
                                        field?.value?.length > 0 && (
                                            <div className='flex-start mt-2.5 flex-wrap gap-2.5'>
                                                {field?.value?.map((tag: string, index: number) =>
                                                    <TagCard
                                                        key={index}
                                                        compact
                                                        _id={String(index)}
                                                        name={tag}
                                                        remove
                                                        isButton
                                                        handleRemove={() => handleTagRemove(tag, field)}
                                                    />
                                                )}
                                            </div>
                                        )
                                    }
                                </div>
                            </FormControl>
                            <FormDescription className='body-regular mt-2.5 text-light-500'>
                                Add up to 3 tags to describe what your question is about. You need to press enter to add tag
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='mt-16 flex justify-end'>
                    <Button
                        type='submit'
                        className='primary-gradient w-fit !text-light-900'
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <ReloadIcon className="mr-2 size-4 animate-spin" />
                                <span>Submitting</span>
                            </>
                        ) : (
                            <>{isEdit ? "Edit" : "Ask a Question"}</>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default QuestionForm;