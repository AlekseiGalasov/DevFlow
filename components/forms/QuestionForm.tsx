'use client'

import {zodResolver} from "@hookform/resolvers/zod";
import React from 'react';
import {Path, useForm} from "react-hook-form";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {AskQuestionSchema} from "@/lib/validation";

const QuestionForm = () => {

    const form = useForm({
        resolver: zodResolver(AskQuestionSchema),
        defaultValues: {
            title: '',
            content: '',
            tags: []
        }
    })

    const handleCreateQuestion = () => {

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
                                    required
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
                                <Input
                                    required
                                    type='text'
                                    {...field}
                                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                                />
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
                    name='title'
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light700">
                                Tags <span className='text-primary-500'>*</span>
                            </FormLabel>
                            <FormControl>
                                <div>
                                    <Input
                                        required
                                        type='text'
                                        {...field}
                                        className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                                    />
                                    Tags
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
                    <Button type='submit' className='primary-gradient w-fit !text-light-900'>
                        Ask A Question
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default QuestionForm;