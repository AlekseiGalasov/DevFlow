import { Schema,Types, model, models } from "mongoose"

export interface IAccount {
    _id: string;
    userId: Types.ObjectId;
    name: string;
    image?: string;
    password?: string;
    provider: string;
    providerAccountId: string;
}

const accountSchema = new Schema({
        _id: {type: String, required: true},
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
        name: {type: String, required: true, unique: true},
        image: {type: String},
        password: {type: String},
        provider: {type: String, required: true},
        providerAccountId: {type: String, required: true},
    },
    {
        timestamps: true
    }
)

const User = models?.account || model<IAccount>("Account", accountSchema)

export default User