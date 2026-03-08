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
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
