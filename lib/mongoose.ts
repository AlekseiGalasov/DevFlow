import mongoose, {Mongoose} from "mongoose";

import logger from "@/lib/handlers/logger";

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
        logger.info("Using existing mongoose connection")
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: 'devflow',
        }).then((result) => {
            return result
        }).catch((error) => {
            logger.info("Error connectiong to MongoDb", error)
            throw error
        })
    }

    cached.conn = await cached.promise

    return  cached.conn
}

export default dbConnect