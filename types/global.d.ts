import {NextResponse} from "next/server";

interface Tag {
    _id: string;
    name: string;
    questions: number
}

interface Author {
    _id: string;
    name: string;
    image: string;
}

interface Question {
    _id: string;
    title: string;
    content: string
    tags: Tag[];
    author: Author;
    upvotes: number;
    downvotes: number;
    answers: number;
    views: number;
    createdAt: Date;
}

interface User {
    _id: string;
    name: string;
    username: string;
    email: string
    bio?: string;
    image?: string;
    location?: string;
    portfolio?: string;
    reputation?: number;
}

interface Answer {
    _id: string
    author: Author
    question: string
    content: string
    createdAt: Date
    updatedAt: Date
    upvotes: number
    downvotes: number
}

type ActionResponse<T = null> = {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        details?: Record<string, string[]>;
    };
    status?: number;
};

interface RouteParams {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
}

interface PaginationSearchParams {
    page?: number
    pageSize?: number
    query?: string
    filter?: string
    sort?: string
}


type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;