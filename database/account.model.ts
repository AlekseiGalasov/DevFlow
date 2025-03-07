import { Schema,Types, model, models, Document } from "mongoose"

export interface IAccount {
    userId: Types.ObjectId;
    name: string;
    image?: string;
    password?: string;
    provider: string;
    providerAccountId: string;
}

export interface IAccountDoc extends IAccount, Document {}
const accountSchema = new Schema<IAccount>({
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

const Account = models?.Account || model<IAccount>("Account", accountSchema)

export default Account