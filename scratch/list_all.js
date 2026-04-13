
const mongoose = require('mongoose');
const DATABASE_URL = "mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech";

async function listAll() {
    try {
        await mongoose.connect(DATABASE_URL);
        const courses = await mongoose.connection.db.collection('courses').find({}).sort({ createdAt: -1 }).toArray();
        console.log(`Total courses: ${courses.length}`);
        courses.forEach(c => console.log(`ID: ${c._id} | CreatedAt: ${c.createdAt} | Title: ${c.title}`));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

listAll();
