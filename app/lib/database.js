const { MongoClient } = require('mongodb');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/colbee';
const DB_NAME = MONGODB_URI.split('/').pop().split('?')[0] || 'colbee';

// MongoDB Connection with caching
let cached = global.mongodb;
if (!cached) {
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
            return {
                client,
                db: client.db(DB_NAME)
            };
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log('Connected to MongoDB');
    } catch (e) {
        cached.promise = null;
        console.error('MongoDB connection error:', e);
        throw e;
    }

    return cached.conn;
}

module.exports = { connectDB }; 