
const mongoose = require('mongoose');
const DATABASE_URL = "mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech";

async function recentModified() {
    try {
        await mongoose.connect(DATABASE_URL);
        const courses = await mongoose.connection.db.collection('courses').find({}).sort({ updatedAt: -1 }).limit(5).toArray();
        courses.forEach(c => console.log(`ID: ${c._id} | Slug: ${c.slug} | Title: ${c.title} | UpdatedAt: ${c.updatedAt}`));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

recentModified();
