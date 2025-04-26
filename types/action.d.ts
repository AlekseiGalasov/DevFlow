import {PaginationSearchParams} from "@/types/global";

interface SignInWithOAuthParams {
    provider: "github" | "google";
    providerAccountId: string;
    user: {
        email: string;
        name: string;
        image: string;
        username: string;
    };
}

interface AuthWithCredentialParams {
    name: string;
    username: string;
    password: string;
    email: string;
}

interface CreateQuestionParams {
    title: string;
    content: string;
    tags: string[];
}

interface EditQuestionParams extends CreateQuestionParams {
    questionId: string;
}

interface GetQuestionParams {
    questionId: string;
}

interface QuestionByTagParams extends Omit<PaginationSearchParams, 'filter'> {
    tagId: string
}

interface AnswersByQuestionIdParams extends Omit<PaginationSearchParams, 'query' | 'sort'> {
    questionId: string
}

interface CreateAnswerParams {
    questionId: string;
    content: string;
}

interface CreateVoteParams {
    actionId: string
    type: "question" | "answer"
    voteType: "upvote" | "downvote"
}

interface UpdateVoteCountParams extends CreateVoteParams {
    change: 1 | -1;
}