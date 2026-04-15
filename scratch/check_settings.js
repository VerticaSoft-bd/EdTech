const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/ed-tech';

const SiteSettingsSchema = new mongoose.Schema({
    siteName: { type: String, default: 'Streva' },
    siteTitle: { type: String, default: 'Youthins' },
    siteTagline: { type: String, default: 'Education Platform' },
    favicon: { type: String, default: '/favicon.ico' },
}, { strict: false });

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

async function checkSettings() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');
        const settings = await SiteSettings.findOne();
        console.log('Settings in DB:', JSON.stringify(settings, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkSettings();
