import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/colbee';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface MongoDBCache {
    conn: any;
    client: MongoClient | null;
    promise: Promise<any> | null;
}

// @ts-ignore
let cached: MongoDBCache = global.mongodb;

if (!cached) {
    // @ts-ignore
    cached = global.mongodb = { conn: null, client: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        cached.promise = MongoClient.connect(MONGODB_URI).then((client) => {
            const dbName = MONGODB_URI.split('/').pop()?.split('?')[0] || 'colbee';
            return {
                client,
                db: client.db(dbName)
            };
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB; 