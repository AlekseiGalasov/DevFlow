import {Schema, Types, model, models, Document} from "mongoose"
import {IAccount} from "@/database/account.model";

export interface IQuestion {
    title: string;
    content?: string;
    tags?: Types.ObjectId[];
    views: number;
    upvotes: number;
    downvotes: number;
    answers: Array<string>;
    author: Types.ObjectId;
}

export interface IQuestionDoc extends IQuestion, Document {}
const questionSchema = new Schema<IQuestion>({
        title: {type: String, required: true},
        content: {type: String},
        tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
        views: {type: Number, default: 0},
        upvotes: {type: Number, default: 0},
        downvotes: {type: Number, default: 0},
        answers: [{type: Number, default: 0}],
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    },
    {
        timestamps: true
    }
)

const Question = models?.Question || model<IQuestion>("Question", questionSchema)

export default Question