import mongoose from 'mongoose';

const dbUrl = "mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech";

async function run() {
    try {
        await mongoose.connect(dbUrl);
        const CourseSchema = new mongoose.Schema({ status: String }, { strict: false });
        const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

        const result = await Course.updateMany({}, { $set: { status: 'Active' } });
        console.log(`Updated ${result.modifiedCount} courses to 'Active'.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
