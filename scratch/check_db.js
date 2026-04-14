const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech';

const CourseSchema = new mongoose.Schema({
    title: String,
    slug: String,
    status: String
});

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

async function checkCourses() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');
        const courses = await Course.find({}, 'title slug status');
        console.log('Courses in DB:', JSON.stringify(courses, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkCourses();
