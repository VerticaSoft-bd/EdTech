import mongoose from 'mongoose';
import connectToDatabase from './lib/db.js';
import Student from './models/Student.js';

async function migrate() {
    await connectToDatabase();
    const result = await Student.updateMany(
        { courseMode: { $exists: false } },
        { $set: { courseMode: 'Online' } }
    );
    console.log(`Migrated ${result.modifiedCount} students to default courseMode: Online`);
    process.exit(0);
}

migrate();
