import {model, models, Schema, Types} from "mongoose"

export interface ITag {
    user: Types.ObjectId;
    action?: string;
    actionId: Types.ObjectId;
    actionType?: 'question' | 'answer';
}

const tagSchema = new Schema<ITag>({
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        action: {type: String},
        actionId: {type: Schema.Types.ObjectId, required: true},
        actionType: {type: String, enum: ['question', 'answer']},
    },
    {
        timestamps: true
    }
)

const Tag = models?.Tag || model<ITag>("Tag", tagSchema)

export default Tag