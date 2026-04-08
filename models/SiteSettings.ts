import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
    siteName: { type: String, default: 'Streva' },
    siteTagline: { type: String, default: 'Education Platform' },
    logo: { type: String, default: '/images/logo.png' },
    favicon: { type: String, default: '/favicon.ico' },
    primaryColor: { type: String, default: '#6C5DD3' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    footerText: { type: String, default: '' },
    socialLinks: {
        facebook: { type: String, default: '' },
        youtube: { type: String, default: '' },
        instagram: { type: String, default: '' },
        linkedin: { type: String, default: '' },
    },
    freeClasses: [{
        title: { type: String, required: true },
        subtitle: { type: String },
        category: { type: String },
        time: { type: String },
        color: { type: String, default: 'from-blue-500 to-indigo-500' },
        link: { type: String, default: '#' },
        order: { type: Number, default: 0 }
    }],
    testimonials: [{
        studentName: { type: String, required: true },
        courseName: { type: String },
        role: { type: String }, // optional, for backward compatibility or extra info
        textFeedback: { type: String },
        videoUrl: { type: String },
        image: { type: String },
        avatar: { type: String },
        order: { type: Number, default: 0 }
    }],
    brands: [{
        name: { type: String, required: true },
        logo: { type: String, required: true },
        order: { type: Number, default: 0 }
    }],
}, { timestamps: true });

if (mongoose.models.SiteSettings) {
    delete mongoose.models.SiteSettings;
}

const SiteSettings = mongoose.model('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
