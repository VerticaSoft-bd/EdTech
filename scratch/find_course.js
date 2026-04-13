
const mongoose = require('mongoose');
const DATABASE_URL = "mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech";

async function findCourse() {
    try {
        await mongoose.connect(DATABASE_URL);
        const courses = await mongoose.connection.db.collection('courses').find({ _id: { $gt: new mongoose.Types.ObjectId("69d000000000000000000000") } }).toArray();
        console.log("Matching courses:", courses.length);
        courses.forEach(c => console.log(`- ${c._id} : ${c.title}`));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

findCourse();
