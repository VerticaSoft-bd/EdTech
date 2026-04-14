const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech';

// Define schemas to match the app
const CourseSchema = new mongoose.Schema({
    title: String,
    status: String
});
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

const SiteSettingsSchema = new mongoose.Schema({
    specialPackageCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});
const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

async function testPopulate() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected');
        
        const settings = await SiteSettings.findOne().populate('specialPackageCourses');
        console.log('Settings found:', !!settings);
        if (settings) {
            console.log('specialPackageCourses length:', settings.specialPackageCourses.length);
            console.log('specialPackageCourses data:', JSON.stringify(settings.specialPackageCourses, null, 2));
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

testPopulate();
