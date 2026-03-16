import mongoose from 'mongoose';
import connectDB from './lib/db';
import SiteSettings from './models/SiteSettings';

async function diagnose() {
    try {
        console.log("Connecting to DB...");
        await connectDB();
        const count = await SiteSettings.countDocuments();
        console.log(`Total SiteSettings documents: ${count}`);
        
        const settings = await SiteSettings.find();
        settings.forEach((s, i) => {
            console.log(`Document ${i}:`);
            console.log(`  _id: ${s._id}`);
            console.log(`  siteName: ${s.siteName}`);
            console.log(`  freeClasses count: ${s.freeClasses?.length || 0}`);
            console.log(`  testimonials count: ${s.testimonials?.length || 0}`);
            if (s.freeClasses && s.freeClasses.length > 0) {
                console.log(`  Sample Free Class Title: ${s.freeClasses[0].title}`);
            }
        });
    } catch (err) {
        console.error("DIAGNOSE ERROR:", err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

diagnose();
