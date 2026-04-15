const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech';

async function checkPrices() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');
        const db = mongoose.connection.db;
        const courses = await db.collection('courses').find({}).limit(5).toArray();
        
        courses.forEach(c => {
            console.log(`Title: ${c.title}`);
            console.log(`RegularFee: ${c.regularFee}`);
            console.log(`DiscountPercentage: ${c.discountPercentage}`);
            console.log(`Price Field exists?: ${c.price !== undefined}`);
            console.log('---');
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkPrices();
