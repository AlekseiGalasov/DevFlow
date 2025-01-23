import mongoose, {Mongoose} from "mongoose";

const MONGODB_URI = process.env.MONGO_DB_URI as string

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined")
}

interface MongooseCache {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
}

declare global {
    var mongoose: MongooseCache
}

let cached = global.mongoose

if(!cached) {
    cached = global.mongoose = { conn: null, promise: null}
}

const dbConnect: Promise<Mongoose> = async () => {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: 'devflow',
        }).then((result) => {
            console.log('Connected to MongoDB')
            return result
        }).catch((error) => {
            console.log("Error connectiong to MongoDb", error)
            throw error
        })
    }

    cached.conn = await cached.promise

    return  cached.conn
}

export default dbConnect