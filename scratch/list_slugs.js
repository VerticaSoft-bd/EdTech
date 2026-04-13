
const mongoose = require('mongoose');
const DATABASE_URL = "mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech";

async function listSlugs() {
    try {
        await mongoose.connect(DATABASE_URL);
        const courses = await mongoose.connection.db.collection('courses').find({}).toArray();
        courses.forEach(c => console.log(`ID: ${c._id} | Slug: ${c.slug} | Title: ${c.title}`));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

listSlugs();
