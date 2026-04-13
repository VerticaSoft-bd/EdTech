
const mongoose = require('mongoose');
const DATABASE_URL = "mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech";

async function checkCourse() {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("Connected to DB");
        const id = "69dcda2af75a495054f2be8f";
        const course = await mongoose.connection.db.collection('courses').findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (course) {
            console.log("Course found:", course.title);
        } else {
            console.log("Course not found in DB with ID:", id);
            const allCourses = await mongoose.connection.db.collection('courses').find({}).limit(5).toArray();
            console.log("Sample courses in DB:");
            allCourses.forEach(c => console.log(`- ${c._id} : ${c.title}`));
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkCourse();
