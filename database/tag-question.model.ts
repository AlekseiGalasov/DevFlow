import {model, models, Schema, Types} from "mongoose"

export interface ITagQuestion {
    question: Types.ObjectId;
    tagId: Types.ObjectId;
}

const tagQuestionSchema = new Schema<ITagQuestion>({
        question: { type: Schema.Types.ObjectId, ref: 'Question', required: true},
        tagId: { type: Schema.Types.ObjectId, ref: 'Tag', required: true},
    },
    {
        timestamps: true
    }
)

const TagQuestion = models?.Tag || model<ITagQuestion>("TagQuestion", tagQuestionSchema)

export default TagQuestion