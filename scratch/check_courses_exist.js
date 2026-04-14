const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech';

async function checkCourses() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');
        const db = mongoose.connection.db;
        const collection = db.collection('courses');
        const ids = ["69dce374d0c2eec5ea8748b4", "69dcc634f4ae3a2bb4348ba7"];
        const docs = await collection.find({ _id: { $in: ids.map(id => new mongoose.Types.ObjectId(id)) } }).toArray();
        console.log('Found Courses:', docs.length);
        docs.forEach(d => console.log(d.title));
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkCourses();
