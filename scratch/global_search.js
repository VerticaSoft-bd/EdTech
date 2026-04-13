
const mongoose = require('mongoose');
const DATABASE_URL = "mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech";

async function globalSearch() {
    try {
        await mongoose.connect(DATABASE_URL);
        const id = "69dcda2af75a495054f2be8f";
        const course = await mongoose.connection.db.collection('courses').findOne({ 
            $or: [
                { _id: new mongoose.Types.ObjectId(id) },
                { slug: id },
                { title: id }
            ] 
        });
        if (course) {
            console.log("Found course:", course.title);
            console.log("Real ID:", course._id);
            console.log("Real Slug:", course.slug);
        } else {
            console.log("Not found anywhere in courses");
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

globalSearch();
