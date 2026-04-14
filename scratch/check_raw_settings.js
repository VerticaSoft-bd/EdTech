const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech';

async function checkSiteSettings() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');
        const db = mongoose.connection.db;
        const collection = db.collection('sitesettings'); // Mongoose pluralizes
        const docs = await collection.find({}).toArray();
        console.log('Docs:', JSON.stringify(docs, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkSiteSettings();
