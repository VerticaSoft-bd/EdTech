import mongoose from "mongoose";
import './../models/Course';
import './../models/User';
import './../models/Batch';
import './../models/SiteSettings';


const DATABASE_URL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/ed-tech";

if (!DATABASE_URL) {
    throw new Error(
        "Please define the DATABASE_URL environment variable inside .env.local"
    );
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        console.log("Using existing MongoDB connection");
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        console.log(`Connecting to MongoDB at: ${DATABASE_URL}`);
        cached.promise = mongoose.connect(DATABASE_URL, opts).then((mongoose) => {
            console.log("Successfully connected to MongoDB");
            return mongoose;
        }).catch(err => {
            console.error("Mongoose Initial Connection Error:", err);
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        console.error("Mongoose Await Connection Error:", e);
        cached.promise = null;
        throw e;
    }

    // Ensure any models we expect are registered
    // (They are imported above, accessing them just to be doubly sure)
    const models = mongoose.models;
    if (!models.Course || !models.User || !models.Batch || !models.SiteSettings) {
        // This is mostly to satisfy internal checks and ensure they are loaded
    }

    return cached.conn;
}


export default connectToDatabase;
