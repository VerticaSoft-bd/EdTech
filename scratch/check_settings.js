const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech';

// Define schemas to match
const CourseSchema = new mongoose.Schema({ title: String });
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

const BatchSchema = new mongoose.Schema({ name: String });
const Batch = mongoose.models.Batch || mongoose.model('Batch', BatchSchema);

const SiteSettingsSchema = new mongoose.Schema({
    specialPackageCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});
const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

async function checkSettings() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');
        const settings = await SiteSettings.findOne().populate({
            path: 'specialPackageCourses',
            populate: { path: 'assignedBatches' }
        });
        console.log('Settings:', JSON.stringify(settings, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkSettings();
