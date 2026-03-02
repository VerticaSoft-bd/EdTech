import mongoose from 'mongoose';
import slugify from 'slugify';

const dbUrl = "mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech";

async function run() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(dbUrl);
        console.log("Connected to DB");
        
        const CourseSchema = new mongoose.Schema({ 
            title: String, 
            slug: { type: String, unique: true } 
        }, { strict: false });

        const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

        const courses = await Course.find({ 
            $or: [
                { slug: { $exists: false } }, 
                { slug: "" },
                { slug: null }
            ] 
        });
        
        console.log(`Found ${courses.length} courses that need slugs.`);

        for (const course of courses) {
            if (course.title) {
                // Generate a base slug from title
                const baseSlug = slugify(course.title, { lower: true, strict: true });
                // Add a random suffix to ensure uniqueness if needed
                const slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
                
                course.slug = slug;
                await course.save();
                console.log(`Updated course ${course._id} with slug: ${slug}`);
            } else {
                console.log(`Course ${course._id} has no title, skipping.`);
            }
        }
        
        console.log("Finished updating courses.");
        process.exit(0);
    } catch (err) {
        console.error("Error during execution:", err);
        process.exit(1);
    }
}

run();
