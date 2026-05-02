import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
    siteName: { type: String, default: 'Streva' },
    siteTitle: { type: String, default: 'Youthins' },
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
        whatsapp: { type: String, default: '' },
    },
    freeClasses: [{
        title: { type: String, required: true },
        subtitle: { type: String },
        time: { type: String },
        color: { type: String, default: 'from-blue-500 to-indigo-500' },
        link: { type: String, default: '#' },
        order: { type: Number, default: 0 }
    }],
    testimonials: [{
        studentName: { type: String },
        courseName: { type: String },
        role: { type: String }, // optional, for backward compatibility or extra info
        textFeedback: { type: String },
        videoUrl: { type: String },
        image: { type: String },
        avatar: { type: String },
        videoSize: { type: String },
        thumbnailSize: { type: String },
        order: { type: Number, default: 0 }
    }],
    brands: [{
        name: { type: String, required: true },
        logo: { type: String, required: true },
        link: { type: String },
        order: { type: Number, default: 0 }
    }],
    specialPackageCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    smsConfig: {
        apiKey: { type: String, default: '' },
        senderId: { type: String, default: '' }
    },
    smsTemplates: {
        newUserStudent: { type: String, default: 'Welcome [NAME]! Your account is created.' },
        newUserTeacher: { type: String, default: 'Welcome [NAME]! Your teacher account is created.' },
        forgotPasswordOtp: { type: String, default: 'Your OTP is [OTP].' },
        paymentSuccess: { type: String, default: 'Payment successful for [NAME].' },
        paymentDue: { type: String, default: 'Hi [NAME], this is a reminder that you have a pending payment of [AMOUNT]. Please settle it soon.' },
        offlineStudentSignup: { type: String, default: '[NAME], setup your password [LINK] - YouthINS' }
    }
}, { timestamps: true });

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
