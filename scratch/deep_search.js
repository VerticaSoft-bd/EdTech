
const mongoose = require('mongoose');
const DATABASE_URL = "mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech";

async function deepSearch() {
    try {
        await mongoose.connect(DATABASE_URL);
        const collections = await mongoose.connection.db.listCollections().toArray();
        const id = "69dcda2af75a495054f2be8f";
        
        for (const col of collections) {
            const doc = await mongoose.connection.db.collection(col.name).findOne({ _id: new mongoose.Types.ObjectId(id) });
            if (doc) {
                console.log(`Found in collection: ${col.name}`);
                console.log(doc);
                break;
            }
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

deepSearch();
