
const mongoose = require('mongoose');
const DATABASE_URL = "mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech";

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    subtitle: { type: String, required: true },
    courseMode: { type: String, required: true },
    duration: { type: String, required: true },
    fullDetails: { type: String, required: true },
    regularFee: { type: Number, required: true },
    status: { type: String, enum: ['Draft', 'Active', 'Archived'], default: 'Draft' }
}, { timestamps: true });

async function simulatePatch() {
    try {
        await mongoose.connect(DATABASE_URL);
        const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
        
        const id = "69dcc634f4ae3a2bb4348ba7";
        const course = await Course.findById(id);
        if (!course) {
            console.log("Course not found");
            return;
        }

        console.log("Original Title:", course.title);

        const body = {
            title: course.title, // No change
            subtitle: course.subtitle,
            courseMode: course.courseMode,
            duration: course.duration,
            fullDetails: course.fullDetails,
            regularFee: course.regularFee,
            tools: [{ name: "Test Tool", image: "" }] // Adding a tool
        };

        const excludedFields = ['id', '_id', '__v', 'createdAt', 'updatedAt', 'slug'];
        Object.keys(body).forEach((key) => {
            if (excludedFields.includes(key)) {
                return;
            }
            course[key] = body[key];
        });

        await course.save();
        console.log("Successfully saved!");
        await mongoose.disconnect();
    } catch (err) {
        console.error("Patch Failed:", err.message);
        if (err.errors) {
            Object.keys(err.errors).forEach(key => {
                console.error(`- Field ${key}: ${err.errors[key].message}`);
            });
        }
        await mongoose.disconnect();
    }
}

simulatePatch();
