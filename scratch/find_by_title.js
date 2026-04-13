
const mongoose = require('mongoose');
const DATABASE_URL = "mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech";

async function findByTitle() {
    try {
        await mongoose.connect(DATABASE_URL);
        const courses = await mongoose.connection.db.collection('courses').find({ title: /Student Career/ }).toArray();
        console.log("Found courses:", courses.length);
        courses.forEach(c => console.log(`- ${c._id} : ${c.title}`));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

findByTitle();
